import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Award, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SenateHomePage = () => {
  const [stats, setStats] = useState([
    { title: 'Total Certificates Issued', value: '0', icon: Award, trend: '+0%', color: 'text-green-600' },
    { title: 'Active Certificates', value: '0', icon: FileText, trend: '+0%', color: 'text-blue-600' },
    { title: 'Recipients', value: '0', icon: Users, trend: '+0%', color: 'text-purple-600' },
    { title: 'This Month', value: '0', icon: TrendingUp, trend: '+0%', color: 'text-orange-600' },
  ]);
  const [recentActivity, setRecentActivity] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({ title: "Error", description: "Please log in.", variant: "destructive" });
        return;
      }
      try {
        console.log('Fetching certificates with token:', token.slice(0, 10) + '...');
        const certResponse = await fetch(`${VITE_BACKEND_URI}/api/issuers/certificates`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Certificates response status:', certResponse.status);
        if (!certResponse.ok) {
          const errorData = await certResponse.json();
          throw new Error(errorData.message || 'Failed to fetch certificates');
        }
        const certificates = await certResponse.json();
        console.log('Fetched certificates:', certificates);

        const uniqueRecipients = new Set(certificates.map(cert => cert.recipientID)).size;
        const activeCerts = certificates.filter(cert => cert.status === 'active').length;
        const thisMonthCerts = certificates.filter(cert => {
          const issueDate = new Date(cert.graduationDate);
          const now = new Date();
          return issueDate.getMonth() === now.getMonth() && issueDate.getFullYear() === now.getFullYear();
        }).length;

        setStats([
          { title: 'Total Certificates Issued', value: certificates.length, icon: Award, trend: '+0%', color: 'text-green-600' },
          { title: 'Active Certificates', value: activeCerts, icon: FileText, trend: '+0%', color: 'text-blue-600' },
          { title: 'Recipients', value: uniqueRecipients, icon: Users, trend: '+0%', color: 'text-purple-600' },
          { title: 'This Month', value: thisMonthCerts, icon: TrendingUp, trend: '+0%', color: 'text-orange-600' },
        ]);

        setRecentActivity(certificates.slice(0, 4).map(cert => ({
          id: cert.certificateID,
          action: cert.status === 'revoked' ? 'Certificate revoked' : `Certificate issued by ${cert.issuerName || 'Unknown'}`,
          recipient: cert.recipientName,
          time: new Date(cert.createdAt).toLocaleTimeString(),
        })));

        if (certificates.length === 0) {
          toast({ title: "Info", description: "No certificates found for this issuer.", variant: "default" });
        }
      } catch (err) {
        console.error('Fetch data error:', err);
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    };

    fetchData();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800 mb-2">Dashboard Overview</h1>
        <p className="text-green-600">Welcome to the FUTO Senate Certificate Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-green-200 hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${stat.color} mt-1`}>{stat.trend} from last month</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-100`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b border-green-100 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.recipient}</p>
                  </div>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors cursor-pointer">
                <h3 className="font-medium text-green-800">Issue New Certificate</h3>
                <p className="text-sm text-green-600">Create and issue a new blockchain certificate</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
                <h3 className="font-medium text-blue-800">Verify Certificate</h3>
                <p className="text-sm text-blue-600">Verify the authenticity of a certificate</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer">
                <h3 className="font-medium text-purple-800">Bulk Operations</h3>
                <p className="text-sm text-purple-600">Perform bulk certificate operations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SenateHomePage;