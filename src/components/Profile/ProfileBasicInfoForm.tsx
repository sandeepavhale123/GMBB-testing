
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ProfileBasicInfoFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    language: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export const ProfileBasicInfoForm: React.FC<ProfileBasicInfoFormProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">Edit Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => onInputChange('firstName', e.target.value)}
              className="mt-1 h-10"
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => onInputChange('lastName', e.target.value)}
              className="mt-1 h-10"
              required
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
          <Input
            id="email_s"
            type="email"
            value={formData.email}
            className="mt-1 h-10"
             disabled="true"
            
          />
           <Input
            id="email"
            type="hidden"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            className="mt-1 h-10 "
            required
            
          />
        </div>

        {/* Language Field */}
        <div>
          <Label htmlFor="language" className="text-gray-700 font-medium">Language</Label>
          <Select value={formData.language} onValueChange={(value) => onInputChange('language', value)}>
            <SelectTrigger className="mt-1 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
              <SelectItem value="french">French</SelectItem>
              <SelectItem value="german">German</SelectItem>
              <SelectItem value="italian">Italian</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
