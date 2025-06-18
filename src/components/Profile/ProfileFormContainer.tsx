
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { useToast } from '../../hooks/use-toast';
import { useProfile } from '../../hooks/useProfile';
import { useAppSelector } from '../../hooks/useRedux';
import { ProfileBasicInfoForm } from './ProfileBasicInfoForm';
import { ProfilePreferencesForm } from './ProfilePreferencesForm';

export const ProfileFormContainer: React.FC = () => {
  const { toast } = useToast();
  const { profileData, timezones, isUpdating, updateError, updateProfile, clearProfileErrors } = useProfile();
  const { user } = useAppSelector(state => state.auth); // Get user from auth state
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    timezone: '',
    language: '',
    dashboardType: '1'
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        firstName: profileData.first_name || '',
        lastName: profileData.last_name || '',
        email: profileData.username || '',
        timezone: profileData.timezone || '',
        language: profileData.language || 'english',
        dashboardType: '1'
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
      // Update profile WITHOUT password - password should only be updated via change password modal
      await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        timezone: formData.timezone,
        username: formData.email,
        dashboardType: parseInt(formData.dashboardType),
        language: formData.language,
        profilePic: profileData.profilePic || ''
        // Password is intentionally NEVER included in profile updates
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
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info Section */}
      <ProfileBasicInfoForm
        formData={formData}
        onInputChange={handleInputChange}
      />

      {/* Preferences Section */}
      <ProfilePreferencesForm
        formData={formData}
        timezones={timezones}
        userRole={user?.role || profileData?.role} // Pass user role from auth state or profile data
        onInputChange={handleInputChange}
      />

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
