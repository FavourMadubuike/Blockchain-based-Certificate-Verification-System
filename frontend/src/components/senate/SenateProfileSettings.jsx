import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Building, Shield, Save, Camera, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const SenateProfileSettings = () => {
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    email: '',
    department: '',
    senateRole: '',
    avatar: '/placeholder.svg',
    password: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const departments = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Medicine',
    'Law',
    'Business Administration',
    'Information Technology',
    'Cybersecurity',
    'Software Engineering',
    'Microbiology'
  ];

  const senateRoles = [
    'Senate Secretary',
    'Deputy Senate Secretary',
    'Senate Member',
    'Committee Chair',
    'Academic Affairs',
    'Student Affairs'
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/senate-login');
        return;
      }
      try {
        const response = await fetch(`${VITE_BACKEND_URI}/api/issuers/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setProfile({
          name: data.name,
          username: data.username,
          email: data.email,
          department: data.department,
          senateRole: data.senateRole,
          avatar: '/placeholder.svg',
          password: '',
        });
      } catch (err) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      }
    };

    fetchProfile();
  }, [navigate, toast]);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${VITE_BACKEND_URI}/api/issuers/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          username: profile.username,
          email: profile.email,
          department: profile.department,
          senateRole: profile.senateRole,
          password: profile.password || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update profile');

      toast({
        title: "Profile Updated",
        description: "Your profile settings have been saved successfully",
      });
      setIsEditing(false);
      setProfile({ ...profile, password: '' });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleAvatarChange = () => {
    toast({
      title: "Avatar Upload",
      description: "Avatar upload functionality would be implemented here",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800 mb-2">Profile Settings</h1>
        <p className="text-green-600">Manage your account information and senate role details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 text-lg">Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="text-2xl bg-green-100 text-green-700">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full p-2 bg-green-600 hover:bg-green-700"
                  onClick={handleAvatarChange}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">{profile.name}</h3>
              <p className="text-green-600">{profile.senateRole}</p>
              <p className="text-sm text-gray-600">{profile.department}</p>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-green-800 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={isEditing ? "bg-green-600 hover:bg-green-700" : "border-green-300 text-green-700 hover:bg-green-50"}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </>
                ) : (
                  "Edit Profile"
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!isEditing}
                    className="border-green-300 focus:border-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    disabled={!isEditing}
                    className="border-green-300 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!isEditing}
                  className="border-green-300 focus:border-green-500"
                />
              </div>

              {isEditing && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password (leave blank to keep unchanged)</Label>
                  <Input
                    id="password"
                    type="password"
                    value={profile.password}
                    onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                    className="border-green-300 focus:border-green-500"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Senate Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={profile.department}
                    onValueChange={(value) => setProfile({ ...profile, department: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="border-green-300">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senateRole">Senate Role</Label>
                  <Select
                    value={profile.senateRole}
                    onValueChange={(value) => setProfile({ ...profile, senateRole: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="border-green-300">
                      <SelectValue placeholder="Select senate role" />
                    </SelectTrigger>
                    <SelectContent>
                      {senateRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="border-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">Certificate Issuance</h4>
                  <p className="text-sm text-green-600">Authorized to issue certificates</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Active Permission
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Certificate Management</h4>
                  <p className="text-sm text-blue-600">Can view and manage all certificates</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      Active Permission
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">Blockchain Access</h4>
                <p className="text-sm text-yellow-600">MetaMask wallet connected for blockchain operations</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                    Wallet Connected
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SenateProfileSettings;