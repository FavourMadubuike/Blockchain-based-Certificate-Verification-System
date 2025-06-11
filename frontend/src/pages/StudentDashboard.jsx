import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, GraduationCap, Shield, CheckCircle, XCircle, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CertificateCard from '@/components/CertificateCard';
import ProfileSettings from '@/components/ProfileSetting';
import { ConnectButton } from "@rainbow-me/rainbowkit";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('certificates');
  const [user, setUser] = useState({});
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/student-login');
        return;
      }

      try {
        const profileResponse = await fetch('http://localhost:5000/api/recipients/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!profileResponse.ok) throw new Error('Failed to fetch profile');
        const profileData = await profileResponse.json();
        console.log('Recipient profile data:', profileData); // Debug role
        setUser({
          name: profileData.name,
          jambRegNumber: profileData.jambRegNumber,
          program: profileData.program,
          department: profileData.department || 'N/A',
          role: 'recipient', // Fix Invalid user role
          totalCertificates: 0,
          verifiedCertificates: 0,
          memberSince: new Date(profileData.createdAt).toLocaleDateString(),
        });

        const certResponse = await fetch('http://localhost:5000/api/recipients/certificates', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!certResponse.ok) throw new Error('Failed to fetch certificates');
        const certData = await certResponse.json();
        setCertificates(certData);
        setUser((prev) => ({
          ...prev,
          totalCertificates: certData.length,
          verifiedCertificates: certData.filter((c) => c.status === 'active').length,
        }));
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [navigate]);

  const handleDownload = async (certificateId) => {
    try {
      setMessage('');
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/recipients/certificates/${certificateId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certificateId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      setMessage(`Downloaded certificate ${certificateId}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleShare = (certificateId) => {
    try {
      setMessage('');
      const shareUrl = `http://localhost:5173/verify/${certificateId}`;
      navigator.clipboard.writeText(shareUrl);
      setMessage('Certificate link copied to clipboard!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    setMessage('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/student-login');
    setMessage('Logged out successfully.');
  };

  const handleConnectWallet = () => {
    setMessage('');
    setMessage('Wallet connection feature coming soon!');
  };

  return (
    <div className="min-h-screen bg-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-8 w-8 text-green-800" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FUTO Student Dashboard</h1>
              <p className="text-sm text-gray-600">Certificate Management System</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ConnectButton />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 border-red-200 hover:bg-green-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="flex flex-row gap-8">
          <div className="lg:w-64">
            <Card className="bg-white border-green-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeTab === 'certificates' ? 'default' : 'ghost'}
                  className={`w-full justify-start ${
                    activeTab === 'certificates'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'text-gray-700 hover:bg-green-50'
                  }`}
                  onClick={() => setActiveTab('certificates')}
                >
                  <Shield className="h-4 w-4 mr-3" />
                  My Certificates
                </Button>
                <Button
                  variant={activeTab === 'profile' ? 'default' : 'ghost'}
                  className={`w-full justify-start ${
                    activeTab === 'profile'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'text-gray-700 hover:bg-green-50'
                  }`}
                  onClick={() => setActiveTab('profile')}
                >
                  <User className="h-4 w-4 mr-3" />
                  Profile Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            {(error || message) && (
              <div
                className={`border p-4 rounded mb-6 ${
                  error
                    ? 'bg-red-100 border-red-200 text-red-700'
                    : 'bg-green-100 border-green-200 text-green-800'
                }`}
              >
                {error || message}
              </div>
            )}
            {activeTab === 'certificates' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">My Certificates</h2>
                  <p className="text-gray-600">Manage and share your blockchain-verified certificates</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-green-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-sm">Total Certificates</p>
                          <p className="text-3xl font-bold">{certificates.length}</p>
                        </div>
                        <Shield className="h-12 w-12 text-green-200" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-sm">Verified</p>
                          <p className="text-3xl font-bold">{certificates.filter((c) => c.status === 'active').length}</p>
                        </div>
                        <CheckCircle className="h-12 w-12 text-green-200" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100 text-sm">Pending</p>
                          <p className="text-3xl font-bold">{certificates.filter((c) => c.status === 'pending').length}</p>
                        </div>
                        <XCircle className="h-12 w-12 text-orange-200" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  {certificates.map((certificate) => (
                    <CertificateCard
                      key={certificate.certificateID}
                      certificate={certificate}
                      userRole="recipient"
                      onDownload={handleDownload}
                      onShare={handleShare}
                    />
                  ))}
                  {certificates.length === 0 && (
                    <p className="text-gray-600 text-center">No certificates found.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'profile' && <ProfileSettings user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;