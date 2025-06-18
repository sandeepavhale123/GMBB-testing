
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { useProfile } from '../../hooks/useProfile';

export const EditProfileForm: React.FC = () => {
  const { toast } = useToast();
  const { profileData, timezones, isUpdating, updateError, updateProfile, clearProfileErrors } = useProfile();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    timezone: '',
    language: '',
    dashboardType: 'advanced'
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        firstName: profileData.frist_name || '',
        lastName: profileData.last_name || '',
        email: profileData.username || '',
        phone: '',
        address: '',
        timezone: profileData.timezone || '',
        language: profileData.language || 'english',
        dashboardType: 'advanced'
      });
    }
  }, [profileData]);

  useEffect(() => {
    if (updateError) {
      toast({
        title: "Update Failed",
        description: updateError,
        variant: "destructive"
      });
      clearProfileErrors();
    }
  }, [updateError, toast, clearProfileErrors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileData) return;

    try {
      // Update profile without password
      await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        timezone: formData.timezone,
        username: formData.email,
        dashboardType: formData.dashboardType === 'advanced' ? 1 : 0,
        language: formData.language,
        profilePic: profileData.profilePic || ''
        // Note: password is intentionally excluded here
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!profileData) {
    return (
      <div className="space-y-6">
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Edit Profile Section */}
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
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="mt-1 h-10"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
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
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="mt-1 h-10"
              required
            />
          </div>

          {/* Language Field */}
          <div>
            <Label htmlFor="language" className="text-gray-700 font-medium">Language</Label>
            <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
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
                onChange={(e) => handleInputChange('phone', e.target.value)}
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
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferences & Settings */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Preferences & Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Timezone */}
            <div>
              <Label htmlFor="timezone" className="text-gray-700 font-medium">Timezone</Label>
              <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                <SelectTrigger className="mt-1 h-10">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones && Object.entries(timezones).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dashboard Type */}
            <div>
              <Label htmlFor="dashboardType" className="text-gray-700 font-medium">Dashboard Type</Label>
              <Select value={formData.dashboardType} onValueChange={(value) => handleInputChange('dashboardType', value)}>
                <SelectTrigger className="mt-1 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Dashboard</SelectItem>
                  <SelectItem value="advanced">Advanced Dashboard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={isUpdating}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
        >
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};
