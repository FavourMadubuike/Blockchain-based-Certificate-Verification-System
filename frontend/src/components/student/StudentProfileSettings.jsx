import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Hash, GraduationCap, MapPin, Users } from 'lucide-react';

const StudentProfileSettings = ({ user }) => {
  if (!user || !user.role) {
    return <div className="text-red-600">Invalid user data</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800 mb-2">Student Profile</h1>
        <p className="text-green-600">View your profile information</p>
      </div>

      <Card className="border-green-200 hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-700">Name</Label>
              <Input
                value={user.name || 'N/A'}
                readOnly
                className="border-green-200 bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <Label className="text-gray-700">JAMB Registration Number</Label>
              <Input
                value={user.jambRegNumber || 'N/A'}
                readOnly
                className="border-green-200 bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <Label className="text-gray-700">General Serial Number</Label>
              <Input
                value={user.generalSerialNumber || 'N/A'}
                readOnly
                className="border-green-200 bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <Label className="text-gray-700">Department Serial Number</Label>
              <Input
                value={user.departmentSerialNumber || 'N/A'}
                readOnly
                className="border-green-200 bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <Label className="text-gray-700">Program</Label>
              <Input
                value={user.program || 'N/A'}
                readOnly
                className="border-green-200 bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <Label className="text-gray-700">Gender</Label>
              <Input
                value={user.gender || 'N/A'}
                readOnly
                className="border-green-200 bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <Label className="text-gray-700">State</Label>
              <Input
                value={user.state || 'N/A'}
                readOnly
                className="border-green-200 bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <Label className="text-gray-700">LGA</Label>
              <Input
                value={user.lga || 'N/A'}
                readOnly
                className="border-green-200 bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <Label className="text-gray-700">Mode of Admission</Label>
              <Input
                value={user.modeOfAdmission || 'N/A'}
                readOnly
                className="border-green-200 bg-gray-50 text-gray-900"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfileSettings;