import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ProfileBasicInfoFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
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
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            className="mt-1 h-10"
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

        {/* Phone Number - keeping for UI consistency */}
        <div>
          <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
          <div className="flex mt-1">
            <Select defaultValue="us">
              <SelectTrigger className="w-20 h-10 rounded-r-none border-r-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">🇺🇸 +1</SelectItem>
                <SelectItem value="uk">🇬🇧 +44</SelectItem>
                <SelectItem value="in">🇮🇳 +91</SelectItem>
                <SelectItem value="ca">🇨🇦 +1</SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={(e) => onInputChange('phone', e.target.value)}
              className="h-10 rounded-l-none flex-1"
            />
          </div>
        </div>

        {/* Address - keeping for UI consistency */}
        <div>
          <Label htmlFor="address" className="text-gray-700 font-medium">Address</Label>
          <Textarea
            id="address"
            placeholder="Enter your full address..."
            className="mt-1 min-h-[100px] resize-none"
            value={formData.address}
            onChange={(e) => onInputChange('address', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
