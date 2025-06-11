import React from 'react';
import { Download, Share2, CheckCircle, XCircle, Calendar, Building, Award, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CertificateCard = ({ certificate, userRole, onVerify, onRevoke, onDownload, onShare }) => {
  const getStatusColor = (status) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-orange-100 text-orange-800 border-orange-200';
  };

  const getStatusIcon = (status) => {
    return status === 'active' ? '✓' : '⏳';
  };

  const handleVerify = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const response = await fetch(`http://localhost:5000/api/issuers/verify-certificate/${certificate.certificateID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Verification failed');
      onVerify(certificate.certificateID);
    } catch (err) {
      console.error('Verification error:', err.message);
    }
  };

  const handleRevoke = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const response = await fetch(`http://localhost:5000/api/issuers/revoke-certificate/${certificate.certificateID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Revocation failed');
      onRevoke(certificate.certificateID);
    } catch (err) {
      console.error('Revocation error:', err.message);
    }
  };

  const handleDownload = () => {
    console.log(`Downloading certificate ${certificate.certificateID}`);
    onDownload(certificate.certificateID);
  };

  const handleShare = () => {
    console.log(`Sharing certificate ${certificate.certificateID}`);
    onShare(certificate.certificateID);
  };

  return (
    <Card className="bg-white border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
              {certificate.program}
            </CardTitle>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-1" />
                {certificate.type}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(certificate.issueDate).toLocaleDateString()}
              </div>
            </div>
          </div>
          <Badge className={`${getStatusColor(certificate.status)} font-medium`}>
            {getStatusIcon(certificate.status)} {certificate.status === 'active' ? 'Verified' : 'Pending'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Building className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-gray-600">Issuer:</span>
              <span className="ml-2 font-medium text-gray-900">{certificate.issuer}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">Certificate ID:</span>
              <span className="ml-2 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {certificate.certificateID}
              </span>
            </div>
          </div>

          {certificate.certificateHash && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center mb-2">
                <Hash className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Blockchain Hash</span>
              </div>
              <p className="text-xs font-mono text-gray-600 break-all">
                {certificate.certificateHash}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-green-200">
            {userRole === 'issuer' && (
              <>
                <Button
                  onClick={handleVerify}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify Certificate
                </Button>
                <Button
                  onClick={handleRevoke}
                  variant="outline"
                  className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Revoke Certificate
                </Button>
              </>
            )}
            {userRole === 'recipient' && (
              <>
                <Button
                  onClick={handleDownload}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Certificate
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Certificate
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificateCard;