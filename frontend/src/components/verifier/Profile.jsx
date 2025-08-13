import { useState, useEffect } from "react";
import { User, Building, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navigation from "./Navigation";

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    organization: "",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Please log in");
        }

        const response = await fetch(`${VITE_BACKEND_URI}/api/verifiers/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch profile");
        }

        const data = await response.json();
        setUserData({
          name: data.name || "",
          email: data.email || "",
          organization: data.organization || "",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to load profile",
          variant: "destructive",
        });
      }
    };

    fetchProfile();
  }, [toast]);

  const handleProfileUpdate = async () => {
    if (!userData.name || !userData.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      toast({
        title: "Error",
        description: "Invalid email format",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingProfile(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${VITE_BACKEND_URI}/api/verifiers/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (passwords.new.length < 8 || !/[a-zA-Z]/.test(passwords.new) || !/[0-9]/.test(passwords.new)) {
      toast({
        title: "Error",
        description: "New password must be at least 8 characters and include letters and numbers",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${VITE_BACKEND_URI}/api/verifiers/profile/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update password");
      }

      setPasswords({ current: "", new: "", confirm: "" });
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-100">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-800 rounded-full mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border-green-200/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900">
                  <User className="h-5 w-5 text-green-600" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-900">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    placeholder="Enter full name"
                    className="border-gray-300 focus:ring-green-200 focus:border-green-200"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-900">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    placeholder="Enter email address"
                    className="border-gray-300 focus:ring-green-200 focus:border-green-200"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="organization" className="text-sm font-medium text-gray-900">
                    Organization
                  </label>
                  <Input
                    id="organization"
                    value={userData.organization}
                    onChange={(e) => setUserData({ ...userData, organization: e.target.value })}
                    placeholder="Enter organization (optional)"
                    className="border-gray-300 focus:ring-green-200 focus:border-green-200"
                  />
                </div>
                <Button
                  onClick={handleProfileUpdate}
                  disabled={isUpdatingProfile || !userData.name || !userData.email}
                  className="w-full bg-green-800 text-white hover:bg-green-700"
                >
                  {isUpdatingProfile ? "Updating..." : "Update Profile"}
                </Button>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-green-200/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900">
                  <Lock className="h-5 w-5 text-green-600" />
                  <span>Update Password</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="current-password" className="text-sm font-medium text-gray-900">
                    Current Password
                  </label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      placeholder="Enter current password"
                      className="border-gray-300 focus:ring-green-200 focus:border-green-200"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="new-password" className="text-sm font-medium text-gray-900">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      placeholder="Enter new password"
                      className="border-gray-300 focus:ring-green-200 focus:border-green-200"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="text-sm font-medium text-gray-900">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      placeholder="Confirm new password"
                      className="border-gray-300 focus:ring-green-200 focus:border-green-200"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handlePasswordUpdate}
                  disabled={isUpdatingPassword || !passwords.current || !passwords.new || !passwords.confirm}
                  className="w-full bg-green-800 text-white hover:bg-green-700"
                >
                  {isUpdatingPassword ? "Updating..." : "Update Password"}
                </Button>
                <div className="mt-4 p-3 bg-green-100/50 rounded-md">
                  <p className="text-xs text-gray-500">
                    Password must be at least 8 characters and include letters and numbers.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;