import { NavLink } from "react-router-dom";
import { Shield, User, LogOut, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the system.",
    });
    window.location.href = "/verifier-login"; // Redirect to login
  };

  return (
    <nav className="bg-green-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-white" />
            <span className="text-xl font-bold text-white">
              CertVerify
            </span>
          </div>
          <div className="hidden md:flex space-x-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-green-700/50 text-white"
                    : "text-white/80 hover:bg-green-700/20 hover:text-white"
                }`
              }
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Verify Certificate</span>
              </div>
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-green-700/50 text-white"
                    : "text-white/80 hover:bg-green-700/20 hover:text-white"
                }`
              }
            >
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </div>
            </NavLink>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-white hover:bg-green-700/20 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
        <div className="md:hidden pb-3">
          <div className="flex space-x-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-green-700/50 text-white"
                    : "text-white/80 hover:bg-green-700/20 hover:text-white"
                }`
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Verify</span>
              </div>
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-green-700/50 text-white"
                    : "text-white/80 hover:bg-green-700/20 hover:text-white"
                }`
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;