import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAccount, useWriteContract, useChainId, useSwitchChain } from 'wagmi';
import { waitForTransactionReceipt } from 'viem/actions';
import { createPublicClient, http } from 'viem';
import { sepolia } from 'wagmi/chains';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { ethers } from 'ethers';
import CertificateManagerABI from '../../contracts/CertificateManagerABI.json';

const SenateIssueCertificate = () => {
  const [formData, setFormData] = useState({
    recipientID: '',
    program: '',
    graduationDate: new Date(),
    certificateFile: null,
  });
  const [recipients, setRecipients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fileHash, setFileHash] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const sepoliaChainId = 11155111;

  // Initialize viem client for transaction receipt
  const client = createPublicClient({
    chain: sepolia,
    transport: http(import.meta.env.VITE_INFURA_PROJECT_ID),
  });

  const { writeContractAsync: issueCertificate } = useWriteContract();

  // Check for MetaMask availability on mount
  useEffect(() => {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      toast({
        title: "MetaMask Required",
        description: "Please install the MetaMask extension to use this feature.",
        variant: "destructive",
        action: (
          <Button
            variant="outline"
            onClick={() => window.open('https://metamask.io/download', '_blank')}
            className="border-green-300 text-green-700 hover:bg-green-50"
          >
            Install MetaMask
          </Button>
        ),
      });
    }
  }, [toast]);

  useEffect(() => {
    console.log('Contract Address:', contractAddress);
    console.log('Wallet Address:', address);
    console.log('Is Connected:', isConnected, 'Is Connecting:', isConnecting, 'Is Disconnected:', isDisconnected);
    console.log('Current Chain ID:', chainId);
    if (isConnected && chainId !== sepoliaChainId) {
      toast({
        title: "Network Mismatch",
        description: `Please switch to Sepolia network (current chain ID: ${chainId || 'unknown'})`,
        variant: "destructive",
      });
      switchChainAsync({ chainId: sepoliaChainId }).catch(err => {
        console.error('Switch chain error:', err);
        toast({
          title: "Error",
          description: "Failed to switch to Sepolia network",
          variant: "destructive",
        });
      });
    }
  }, [contractAddress, address, isConnected, isConnecting, isDisconnected, chainId, switchChainAsync, toast]);

  useEffect(() => {
    const fetchRecipients = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({ title: "Error", description: "Please log in.", variant: "destructive" });
        return;
      }
      try {
        const response = await axios.get(`${VITE_BACKEND_URI}/api/issuers/recipients?search=${searchTerm}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Fetched recipients:', response.data);
        setRecipients(response.data);
        if (response.data.length === 0) {
          toast({ title: "Warning", description: "No recipients found.", variant: "destructive" });
        }
      } catch (err) {
        console.error('Fetch recipients error:', err);
        toast({
          title: "Error",
          description: err.response?.data?.message || 'Failed to fetch recipients',
          variant: "destructive",
        });
      }
    };

    fetchRecipients();
  }, [searchTerm, toast]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "Error", description: "File size exceeds 10MB limit", variant: "destructive" });
        return;
      }

      setFormData({ ...formData, certificateFile: file });

      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = `0x${hashArray.map(b => b.toString(16).padStart(2, '0')).join('')}`;
      setFileHash(hashHex);

      toast({ title: "File uploaded", description: "SHA-256 hash generated" });
    }
  };

  const checkCertificateID = async (certificateID) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${VITE_BACKEND_URI}/api/issuers/check-certificate-id`, {
        certificateID,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.exists;
    } catch (err) {
      console.error('Check certificate ID error:', err);
      toast({
        title: "Error",
        description: err.response?.data?.message || 'Failed to check certificate ID',
        variant: "destructive",
      });
      return false;
    }
  };

  const generateUniqueCertificateID = async () => {
    let certificateID;
    let exists = true;
    let attempts = 0;
    const maxAttempts = 5;

    while (exists && attempts < maxAttempts) {
      certificateID = `CERT-${Date.now()}-${uuidv4().slice(0, 8)}`;
      exists = await checkCertificateID(certificateID);
      attempts++;
      if (exists) {
        console.log(`Certificate ID ${certificateID} already exists, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    if (exists) {
      throw new Error('Failed to generate a unique certificate ID after multiple attempts');
    }

    return certificateID;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.recipientID || !formData.program || !formData.graduationDate || !formData.certificateFile) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    if (!window.ethereum || !window.ethereum.isMetaMask) {
      toast({
        title: "MetaMask Required",
        description: "Please install the MetaMask extension to use this feature.",
        variant: "destructive",
        action: (
          <Button
            variant="outline"
            onClick={() => window.open('https://metamask.io/download', '_blank')}
            className="border-green-300 text-green-700 hover:bg-green-50"
          >
            Install MetaMask
          </Button>
        ),
      });
      return;
    }

    if (!isConnected) {
      toast({ title: "Error", description: "Please connect MetaMask.", variant: "destructive" });
      return;
    }

    if (chainId !== sepoliaChainId) {
      toast({ title: "Error", description: "Please switch to Sepolia network.", variant: "destructive" });
      try {
        await switchChainAsync({ chainId: sepoliaChainId });
      } catch (err) {
        console.error('Switch chain error:', err);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const recipientResponse = await axios.get(`${VITE_BACKEND_URI}/api/issuers/recipients/${formData.recipientID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (recipientResponse.status !== 200) {
        throw new Error(recipientResponse.data.message || "Failed to fetch recipient");
      }
      const recipient = recipientResponse.data;

      // Validate graduation date
      const currentDate = new Date();
      if (formData.graduationDate > currentDate) {
        throw new Error("Graduation date cannot be in the future");
      }

      const certificateID = await generateUniqueCertificateID();

      // Call issueCertificate on the blockchain
      const certificateIdBytes32 = ethers.id(certificateID);
      console.log('Calling issueCertificate with:', {
        certificateId: certificateID,
        certificateHash: fileHash,
        jambRegNumber: recipient.matricNo,
        program: formData.program,
        issueDate: Math.floor(formData.graduationDate.getTime() / 1000),
      });

      const txHash = await issueCertificate({
        address: contractAddress,
        abi: CertificateManagerABI,
        functionName: 'issueCertificate',
        args: [
          certificateIdBytes32,
          fileHash,
          recipient.matricNo,
          formData.program,
          Math.floor(formData.graduationDate.getTime() / 1000),
        ],
        gas: 300000,
      });
      console.log(`Transaction submitted: ${txHash}`);

      // Wait for transaction confirmation
      const receipt = await waitForTransactionReceipt(client, { hash: txHash });
      if (receipt.status !== 'success') {
        throw new Error('Blockchain transaction reverted');
      }
      console.log(`Certificate ${certificateID} registered on blockchain: ${txHash}`);

      // Submit to backend for storage
      const formDataToSend = new FormData();
      formDataToSend.append('recipientID', formData.recipientID);
      formDataToSend.append('program', formData.program);
      formDataToSend.append('graduationDate', formData.graduationDate.toISOString());
      formDataToSend.append('certificateHash', fileHash);
      formDataToSend.append('certificateFile', formData.certificateFile);
      formDataToSend.append('certificateID', certificateID);
      formDataToSend.append('transactionHash', txHash);

      console.log('Submitting to backend:', {
        recipientID: formData.recipientID,
        program: formData.program,
        graduationDate: formData.graduationDate,
        fileName: formData.certificateFile?.name,
        certificateHash: fileHash,
        certificateID,
        transactionHash: txHash,
      });

      const response = await axios.post(`${VITE_BACKEND_URI}/api/issuers/issue`, formDataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 201) {
        throw new Error(response.data.message || 'Failed to issue certificate');
      }

      toast({ title: "Success", description: `Certificate ${certificateID} issued successfully` });

      setFormData({ recipientID: '', program: '', graduationDate: new Date(), certificateFile: null });
      setFileHash('');
      setSearchTerm('');
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to issue certificate",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800 mb-2">Issue Certificate</h1>
        <p className="text-green-600">Create and issue a new blockchain-verified certificate</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Certificate Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                {isConnected ? (
                  <p className="text-sm text-gray-600">
                    Connected Wallet: {address || 'Not available'} (Network: {chainId === sepoliaChainId ? 'Sepolia' : 'Unknown'})
                  </p>
                ) : (
                  <p className="text-sm text-red-600">Please connect MetaMask</p>
                )}
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient *</Label>
                  <Input
                    id="recipient"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or JAMB Reg Number"
                    className="border-green-300 focus:border-green-500"
                  />
                  <Select
                    value={formData.recipientID}
                    onValueChange={(value) => setFormData({ ...formData, recipientID: value })}
                  >
                    <SelectTrigger className="border-green-300 focus:border-green-500">
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      {recipients.length === 0 && (
                        <div className="p-2 text-gray-500">No recipients found</div>
                      )}
                      {recipients.map((recipient) => (
                        <SelectItem key={recipient.id} value={recipient.id}>
                          {recipient.name} ({recipient.matricNo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="program">Program *</Label>
                  <Input
                    id="program"
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    placeholder="e.g., Agribusiness"
                    className="border-green-300 focus:border-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="graduationDate">Graduation Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-green-300 focus:border-green-500",
                          !formData.graduationDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.graduationDate ? (
                          format(formData.graduationDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.graduationDate}
                        onSelect={(date) => setFormData({ ...formData, graduationDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certificateFile">Certificate File *</Label>
                  <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                    <Upload className="h-8 w-8 mx-auto text-green-500 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mb-4">PDF, PNG, JPG up to 10MB</p>
                    <Input
                      id="certificateFile"
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('certificateFile')?.click()}
                      className="border-green-300 text-green-700 hover:bg-green-50"
                    >
                      Choose File
                    </Button>
                    {formData.certificateFile && (
                      <p className="text-sm text-green-600 mt-2">
                        Selected: {formData.certificateFile.name}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.recipientID || !isConnected || chainId !== sepoliaChainId || !window.ethereum || !window.ethereum.isMetaMask}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Issue Certificate
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          {fileHash && (
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center text-sm">
                  <Shield className="h-4 w-4 mr-2" />
                  SHA-256 Hash
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-3 rounded border text-xs font-mono break-all">
                  {fileHash}
                </div>
              </CardContent>
            </Card>
          )}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 text-sm">Blockchain Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>
                <div>
                  <p className="text-sm font-medium">Generate Hash</p>
                  <p className="text-xs text-gray-600">SHA-256 hash of certificate file</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>
                <div>
                  <p className="text-sm font-medium">Blockchain Submission</p>
                  <p className="text-xs text-gray-600">Submit to MetaMask for approval</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>
                <div>
                  <p className="text-sm font-medium">Backend Storage</p>
                  <p className="text-xs text-gray-600">Store metadata and file on server</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>
                <div>
                  <p className="text-sm font-medium">MongoDB Storage</p>
                  <p className="text-xs text-gray-600">Store metadata in database</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SenateIssueCertificate;