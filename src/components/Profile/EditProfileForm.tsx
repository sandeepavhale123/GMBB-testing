
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';

export const EditProfileForm: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    }, 1000);
  };

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
                defaultValue="Vijay"
                className="mt-1 h-10"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
              <Input
                id="lastName"
                defaultValue="Salve"
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
              defaultValue="vijay.salve@example.com"
              className="mt-1 h-10 bg-gray-50 text-gray-500"
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          {/* Phone Number */}
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
                className="h-10 rounded-l-none flex-1"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address" className="text-gray-700 font-medium">Address</Label>
            <Textarea
              id="address"
              placeholder="Enter your full address..."
              className="mt-1 min-h-[100px] resize-none"
              defaultValue="123 Main Street, New York, NY 10001"
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
              <Select defaultValue="est">
                <SelectTrigger className="mt-1 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="est">Eastern Time (EST)</SelectItem>
                  <SelectItem value="cst">Central Time (CST)</SelectItem>
                  <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                  <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dashboard Type */}
            <div>
              <Label htmlFor="dashboardType" className="text-gray-700 font-medium">Dashboard Type</Label>
              <Select defaultValue="advanced">
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
          disabled={isLoading}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};
