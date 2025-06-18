
import React, { useState, useRef } from 'react';
import { Lock, Pencil, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useToast } from '../../hooks/use-toast';
import { useProfile } from '../../hooks/useProfile';

interface ProfileHeaderProps {
  activeTab: 'edit' | 'password';
  onTabChange: (tab: 'edit' | 'password') => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  activeTab,
  onTabChange
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profileData, isLoading, updateProfile, isUpdating } = useProfile();
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      
      try {
        if (profileData) {
          await updateProfile({
            first_name: profileData.frist_name,
            last_name: profileData.last_name,
            timezone: profileData.timezone,
            username: profileData.username,
            dashboardType: 1, // Default to advanced
            language: profileData.language,
            profilePic: result
          });
          
          toast({
            title: "Profile picture updated",
            description: "Your profile picture has been successfully updated.",
          });
        }
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to update profile picture. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePencilClick = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="p-6">
          <div className="animate-pulse flex items-center gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const profileImage = profileData?.profilePic || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
  const fullName = profileData ? `${profileData.frist_name} ${profileData.last_name}` : "User";

  return (
    <Card className="shadow-lg border-0">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Profile Picture */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full shadow-md flex items-center justify-center overflow-hidden border-4 border-gray-100">
              <img 
                src={profileImage}
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <button 
              onClick={handlePencilClick}
              disabled={isUploading || isUpdating}
              className="absolute bottom-0 right-0 w-6 h-6 sm:w-7 sm:h-7 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          
          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              {fullName}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Worker
            </p>
            
            {/* Tabs */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                variant={activeTab === 'edit' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onTabChange('edit')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'edit'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTabChange('password')}
                className="px-4 py-2 rounded-lg font-medium border-blue-200 text-blue-600 hover:bg-blue-50 transition-all"
              >
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
