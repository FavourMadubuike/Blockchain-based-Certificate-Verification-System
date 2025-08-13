import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Ban, Download, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SenateManageCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    const fetchCertificates = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({ title: "Error", description: "Please log in.", variant: "destructive" });
        return;
      }
      try {
        console.log('Fetching certificates with token:', token.slice(0, 10) + '...');
        const response = await fetch(`${VITE_BACKEND_URI}/api/issuers/certificates`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Certificates response status:', response.status);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch certificates');
        }
        const data = await response.json();
        console.log('Fetched certificates:', data);
        setCertificates(data);
        if (data.length === 0) {
          toast({ title: "Info", description: "No certificates found for this issuer.", variant: "default" });
        }
      } catch (err) {
        console.error('Fetch certificates error:', err);
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    };

    fetchCertificates();
  }, [toast]);

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.certificateID.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.matricNo.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || cert.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRevoke = async (certificateID) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${VITE_BACKEND_URI}/api/issuers/revoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ certificateID }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to revoke certificate');

      setCertificates(certificates.map(cert =>
        cert.certificateID === certificateID ? { ...cert, status: 'revoked' } : cert
      ));
      toast({
        title: "Certificate Revoked",
        description: `Certificate ${certificateID} has been revoked successfully`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleView = async (certificateID, certificateHash) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${VITE_BACKEND_URI}/api/issuers/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ certificateID, certificateHash }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to verify certificate');

      toast({
        title: "Certificate Verified",
        description: `Certificate ${certificateID} is valid: ${data.certificate.recipientName}, ${data.certificate.program}`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (certificateID) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${VITE_BACKEND_URI}/api/issuers/certificates/${certificateID}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certificateID}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast({
        title: "Download Started",
        description: `Downloading certificate ${certificateID}`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-300',
      revoked: 'bg-red-100 text-red-800 border-red-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };
    return styles[status.toLowerCase()];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800 mb-2">Manage Certificates</h1>
        <p className="text-green-600">View, search, and manage issued certificates</p>
      </div>

      <Card className="border-green-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by Certificate ID, Name, or JAMB Reg Number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-green-300 focus:border-green-500"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-green-300">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="revoked">Revoked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">
            Certificates ({filteredCertificates.length} found)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-green-200">
                  <th className="text-left py-3 px-4 font-semibold text-green-800">Certificate ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-green-800">Recipient Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-green-800">JAMB Reg Number</th>
                  <th className="text-left py-3 px-4 font-semibold text-green-800">Program</th>
                  <th className="text-left py-3 px-4 font-semibold text-green-800">Issue Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-green-800">Issuer</th>
                  <th className="text-left py-3 px-4 font-semibold text-green-800">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-green-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCertificates.map((certificate) => (
                  <tr key={certificate.certificateID} className="border-b border-green-100 hover:bg-green-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-sm">{certificate.certificateID}</td>
                    <td className="py-3 px-4 font-medium">{certificate.recipientName}</td>
                    <td className="py-3 px-4">{certificate.matricNo}</td>
                    <td className="py-3 px-4">{certificate.program}</td>
                    <td className="py-3 px-4">{new Date(certificate.graduationDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{certificate.issuerName || 'Unknown'}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusBadge(certificate.status)}>
                        {certificate.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(certificate.certificateID, certificate.certificateHash)}
                          className="h-8 text-blue-600 border-blue-300 hover:bg-blue-50"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(certificate.certificateID)}
                          className="h-8 text-green-600 border-green-300 hover:bg-green-50"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        {certificate.status === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRevoke(certificate.certificateID)}
                            className="h-8 text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <Ban className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCertificates.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No certificates found matching your search criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {certificates.filter(c => c.status === 'active').length}
            </p>
            <p className="text-sm text-gray-600">Active Certificates</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {certificates.filter(c => c.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-600">Pending Certificates</p>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">
              {certificates.filter(c => c.status === 'revoked').length}
            </p>
            <p className="text-sm text-gray-600">Revoked Certificates</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SenateManageCertificates;