
import React from 'react';
import { Lock, Camera } from 'lucide-react';
import { Button } from '../ui/button';

interface ProfileHeaderProps {
  activeTab: 'edit' | 'password';
  onTabChange: (tab: 'edit' | 'password') => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-lg backdrop-blur-sm"></div>
      <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm"></div>
      <div className="absolute bottom-10 left-20 w-12 h-12 bg-white/10 rounded backdrop-blur-sm"></div>
      
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Profile Picture */}
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-white rounded-full shadow-lg flex items-center justify-center overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-purple-700 transition-colors">
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          
          {/* User Info */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            Vijay Salve
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 mb-8">
            Worker
          </p>
          
          {/* Tabs */}
          <div className="flex justify-center gap-4">
            <Button
              variant={activeTab === 'edit' ? 'secondary' : 'ghost'}
              size="lg"
              onClick={() => onTabChange('edit')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === 'edit'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30 border-0'
              }`}
            >
              Edit Profile
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => onTabChange('password')}
              className="px-6 py-3 rounded-full font-medium bg-white/20 text-white hover:bg-white/30 border-0 transition-all"
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
