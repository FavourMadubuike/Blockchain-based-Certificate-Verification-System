import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileSettings = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    username: user.username || '',
    email: user.email || '',
    password: '',
    ...(user.role === 'recipient' && {
      jambRegNumber: user.jambRegNumber || '',
      program: user.program || '',
      generalSerialNumber: user.generalSerialNumber || '',
      departmentSerialNumber: user.departmentSerialNumber || '',
      gender: user.gender || '',
      state: user.state || '',
      lga: user.lga || '',
      modeOfAdmission: user.modeOfAdmission || '',
    }),
  });


  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `http://localhost:5000/api/${user.role === 'issuer' ? 'issuers' : 'recipients'}/update-profile`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update profile');
      setMessage('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user || !user.role) {
    return <div className="text-red-600">Invalid user data</div>;
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {user.role === 'issuer' && !isEditing ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white border-green-200 hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Senate Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-700">Name</Label>
                    <Input
                      value={formData.name || 'N/A'}
                      readOnly
                      className="border-green-200 bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Username</Label>
                    <Input
                      value={formData.username || 'N/A'}
                      readOnly
                      className="border-green-200 bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Email</Label>
                    <Input
                      value={formData.email || 'N/A'}
                      readOnly
                      className="border-green-200 bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Role</Label>
                    <Input
                      value={user.role || 'Issuer'}
                      readOnly
                      className="border-green-200 bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Member Since</Label>
                    <Input
                      value={user.memberSince || 'N/A'}
                      readOnly
                      className="border-green-200 bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Created At</Label>
                    <Input
                      value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      readOnly
                      className="border-green-200 bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Updated At</Label>
                    <Input
                      value={user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
                      readOnly
                      className="border-green-200 bg-gray-50 text-gray-900"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-green-600 hover:bg-green-700 text-white transition-all duration-200 hover:scale-105"
                  >
                    Update Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : user.role === 'issuer' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white border-green-200 hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Update Senate Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-gray-700">
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border-green-200 focus:ring-green-500 focus:border-green-500 text-gray-900"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="username" className="text-gray-700">
                        Username
                      </Label>
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="border-green-200 focus:ring-green-500 focus:border-green-500 text-gray-900"
                        placeholder="Enter your username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-700">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border-green-200 focus:ring-green-500 focus:border-green-500 text-gray-900"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-gray-700">
                        Password (leave blank to keep unchanged)
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="border-green-200 focus:ring-green-500 focus:border-green-500 text-gray-900"
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>
                  {(error || message) && (
                    <div
                      className={`p-4 rounded ${
                        error
                          ? 'bg-red-100 border-red-200 text-red-600'
                          : 'bg-green-100 border-green-200 text-green-800'
                      }`}
                    >
                      {error || message}
                    </div>
                  )}
                  <div className="flex space-x-4">
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white transition-all duration-200 hover:scale-105"
                    >
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="text-gray-700 border-green-200 hover:bg-green-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white border-green-200 hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Student Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-700">General Serial Number</Label>
                    <Input
                      value={formData.generalSerialNumber || 'N/A'}
                      readOnly
                      className="border-green-200 bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Department Serial Number</Label>
                    <Input
                      value={formData.departmentSerialNumber || 'N/A'}
                      readOnly
                      className="border-green-200 bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Name</Label>
                    <Input
                      value={formData.name || 'N/A'}
                      readOnly
                      className="border-green-200 bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">JAMB Registration Number</Label>
                    <Input
                      value={formData.jambRegNumber || 'N/A'}
                      readOnly
                      className="border-green-200 bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Gender</Label>
                    <Input
                      value={formData.gender || 'N/A'}
                      readOnly
                      className="border-green-200 bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">State</Label>
                    <Input
                      value={formData.state || 'N/A'}
                      readOnly
                      className="border-green-200 bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Local Government Area</Label>
                    <Input
                      value={formData.lga || 'N/A'}
                      readOnly
                      className="border-green-200 bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Mode of Admission</Label>
                    <Input
                      value={formData.modeOfAdmission || 'N/A'}
                      readOnly
                      className="border-green-200 bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Program</Label>
                    <Input
                      value={formData.program || 'N/A'}
                      readOnly
                      className="border-green-200 bg-gray-50 text-gray-900"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileSettings;