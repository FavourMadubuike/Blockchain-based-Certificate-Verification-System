import React, { useState } from 'react';
import { Home, FileText, Settings, LogOut, Menu, X, University } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SenateHomePage from './SenateHomePage';
import SenateIssueCertificate from './SenateIssueCertificate';
import SenateManageCertificates from './SenateManageCertificates';
import SenateProfileSettings from './SenateProfileSettings';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNavigate } from 'react-router-dom';

const SenateDashboardApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const navigation = [
    { name: 'Home', icon: Home, id: 'home' },
    { name: 'Issue Certificate', icon: FileText, id: 'issue' },
    { name: 'Manage Certificates', icon: FileText, id: 'manage' },
    { name: 'Profile Settings', icon: Settings, id: 'profile' },
  ];

  const handleNavigate = (page) => {
    if (page === 'logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/senate-login');
      return;
    }
    setCurrentPage(page);
  };

  // Define renderCurrentPage before the return statement
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <SenateHomePage />;
      case 'issue':
        return <SenateIssueCertificate />;
      case 'manage':
        return <SenateManageCertificates />;
      case 'profile':
        return <SenateProfileSettings />;
      default:
        return <SenateHomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <header className="bg-white shadow-sm border-b border-green-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-green-700 hover:bg-green-100"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center space-x-3">
              <University className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-green-800">FUTO Senate</h1>
                <p className="text-sm text-green-600">Certificate Management Dashboard</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ConnectButton
              chainStatus="icon"
              showBalance={false}
              accountStatus="address"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNavigate('logout')}
              className="text-green-700 border-green-300 hover:bg-green-100"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className={cn(
          "bg-white shadow-lg border-r border-green-200 transition-all duration-300 sticky top-16 h-[calc(100vh-4rem)]",
          sidebarOpen ? "w-64" : "w-16"
        )}>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start transition-all duration-200",
                  currentPage === item.id 
                    ? "bg-green-600 text-white hover:bg-green-700" 
                    : "text-green-700 hover:bg-green-100",
                  !sidebarOpen && "justify-center px-2"
                )}
                onClick={() => handleNavigate(item.id)}
              >
                <item.icon className={cn("h-5 w-5", sidebarOpen && "mr-3")} />
                {sidebarOpen && item.name}
              </Button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6 transition-all duration-300">
          <div className="animate-fade-in">
            {renderCurrentPage()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SenateDashboardApp;
