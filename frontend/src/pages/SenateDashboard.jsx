import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, GraduationCap, Shield, CheckCircle, XCircle, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CertificateCard from '@/components/CertificateCard';
import ProfileSettings from '@/components/ProfileSetting';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const SenateDashboard = () => {
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
        navigate('/senate-login');
        return;
      }

      try {
        const profileResponse = await fetch('http://localhost:5000/api/issuers/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!profileResponse.ok) throw new Error('Failed to fetch profile');
        const profileData = await profileResponse.json();
        console.log('Profile data:', profileData);
        setUser({
          name: profileData.name,
          username: profileData.username,
          email: profileData.email,
          role: 'issuer',
          totalCertificates: 0,
          verifiedCertificates: 0,
          memberSince: new Date(profileData.createdAt).toLocaleDateString(),
        });

        const certResponse = await fetch('http://localhost:5000/api/issuers/certificates', {
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

  const handleIssueCertificate = () => {
    setMessage('');
    setMessage('Certificate issuance feature coming soon!');
  };

  const handleVerifyCertificate = (certificateId) => {
    setMessage('');
    setCertificates((prev) =>
      prev.map((cert) =>
        cert.certificateID === certificateId ? { ...cert, status: 'active' } : cert
      )
    );
    setUser((prev) => ({
      ...prev,
      verifiedCertificates: prev.verifiedCertificates + 1,
    }));
    setMessage(`Certificate ${certificateId} verified successfully`);
  };

  const handleRevokeCertificate = (certificateId) => {
    setMessage('');
    setCertificates((prev) =>
      prev.map((cert) =>
        cert.certificateID === certificateId ? { ...cert, status: 'pending' } : cert
      )
    );
    setUser((prev) => ({
      ...prev,
      verifiedCertificates: prev.verifiedCertificates - 1,
    }));
    setMessage(`Certificate ${certificateId} revoked successfully`);
  };

  const handleLogout = () => {
    setMessage('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/senate-login');
    setMessage('Logged out successfully.');
  };

  return (
    <div className="min-h-screen bg-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-green-800" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">FUTO Senate Dashboard</h1>
                <p className="text-sm text-gray-600">Certificate Issuance & Verification System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Welcome, {user.name || 'Issuer'}</span>
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
                  Certificates
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
                <div className="mb-8 flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Certificate Management</h2>
                    <p className="text-gray-600">Issue, verify, and manage blockchain-verified certificates</p>
                  </div>
                  <Button
                    onClick={handleIssueCertificate}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Issue New Certificate
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-green-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
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
                  <Card className="bg-green-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
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
                  <Card className="bg-orange-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
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

                <Card className="bg-white border-green-200">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-900">Certificates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {certificates.map((certificate) => (
                      <CertificateCard
                        key={certificate.certificateID}
                        certificate={certificate}
                        userRole="issuer"
                        onVerify={() => handleVerifyCertificate(certificate.certificateID)}
                        onRevoke={() => handleRevokeCertificate(certificate.certificateID)}
                      />
                    ))}
                    {certificates.length === 0 && (
                      <p className="text-gray-600 text-center">No certificates found.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'profile' && <ProfileSettings user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SenateDashboard;