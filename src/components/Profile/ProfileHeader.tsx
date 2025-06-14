
import React from 'react';
import { Lock, Camera, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface ProfileHeaderProps {
  activeTab: 'edit' | 'password';
  onTabChange: (tab: 'edit' | 'password') => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <Card className="shadow-lg border-0">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Profile Picture */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full shadow-md flex items-center justify-center overflow-hidden border-4 border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 w-6 h-6 sm:w-7 sm:h-7 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors">
              <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
          
          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              Vijay Salve
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
