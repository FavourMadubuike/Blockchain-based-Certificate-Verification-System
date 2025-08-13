import { useState } from "react";
import { Search, CheckCircle, XCircle, Loader2, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const CertificateVerification = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Error",
        description: "Please enter a certificate ID, recipient name, or JAMB number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResults([]);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in");
      }

      const response = await fetch(`${VITE_BACKEND_URI}/api/verifiers/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ searchTerm }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Verification failed");
      }

      const certificates = await response.json();
      setResults(certificates);

      if (certificates.length === 0) {
        toast({
          title: "No results",
          description: "No certificates found for the provided search term",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Search completed",
          description: `Found ${certificates.length} certificate(s)`,
        });
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: error.message || "Error during verification",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-green-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <Search className="h-5 w-5 text-green-600" />
            <span>Certificate Verification</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="search-term" className="text-sm font-medium text-gray-900">
              Certificate ID, Recipient Name, or JAMB Number
            </label>
            <Input
              id="search-term"
              placeholder="Enter CERT-123..., name, or JAMB number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-base border-gray-300 focus:ring-green-200 focus:border-green-200"
            />
          </div>
          <Button
            onClick={handleVerify}
            disabled={isLoading || !searchTerm.trim()}
            className="w-full bg-green-800 text-white hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Verify Certificate
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card className="border-2 border-green-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <FileText className="h-5 w-5 text-green-600" />
              <span>Verification Results ({results.length} found)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-green-200/20">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Certificate ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Recipient</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">JAMB Number</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Program</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Graduation Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Issuer</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">File</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id} className="border-b border-green-200/10 hover:bg-green-100/50">
                      <td className="py-3 px-4 font-mono text-sm text-gray-900">{result.id}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900">{result.recipientName}</td>
                      <td className="py-3 px-4 text-gray-600">{result.jambNumber}</td>
                      <td className="py-3 px-4 text-gray-600">{result.program}</td>
                      <td className="py-3 px-4 text-gray-600">{new Date(result.graduationDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-gray-600">{result.issuer}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={result.status === "valid" ? "default" : "destructive"}
                          className={result.status === "valid" ? "bg-green-800 text-white" : "bg-red-500 text-white"}
                        >
                          {result.status === "valid" ? (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          ) : (
                            <XCircle className="mr-1 h-3 w-3" />
                          )}
                          {result.status === "valid" ? "VALID" : `INVALID${result.reason ? `: ${result.reason}` : ""}`}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {result.filePath ? (
                          <a
                            href={`${VITE_BACKEND_URI}${result.filePath}`}
                            download
                            className="text-green-600 hover:underline flex items-center"
                          >
                            <Download className="mr-1 h-4 w-4" />
                            {result.fileType ? result.fileType.toUpperCase() : 'PDF'}
                          </a>
                        ) : (
                          "No file"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 bg-green-100/50 border border-green-200/50 rounded-md">
              <p className="text-sm text-green-600 font-medium">
                ✓ Certificates verified on the Sepolia testnet.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CertificateVerification;