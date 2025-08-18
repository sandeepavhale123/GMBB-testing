
import React from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";
import { useProfile } from '../../hooks/useProfile';

export const UserProfileDropdown: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthRedux();
  const { profileData } = useProfile();

  const handleAccountSettings = () => {
    navigate('/settings');
  };

  const handleViewProfile = () => {
    const isInMainDashboard = location.pathname.startsWith('/main-dashboard');
    if (isInMainDashboard) {
      navigate('/main-dashboard/profile');
    } else {
      navigate('/profile');
    }
  };

  // Helper function to check if user role should be restricted
  const shouldHideAccountSettings = () => {
    const userRole = profileData?.role?.toLowerCase();
    return userRole === 'staff' || userRole === 'client';
  };

  // Get user info from profile data
  const userName = profileData ? `${profileData.first_name} ${profileData.last_name}` : "User";
  const userEmail = profileData?.username || "user@example.com";
  const userInitials = profileData ? 
    `${profileData.first_name?.charAt(0) || ''}${profileData.last_name?.charAt(0) || ''}` : 
    "U";
  const userProfilePic = profileData?.profilePic || "/lovable-uploads/e82c6af8-dd5a-48b6-bc12-9663e5ab24eb.png";

  return (
    <div className="flex items-center gap-2 ml-1 sm:ml-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0 rounded-full hover:bg-gray-100">
            <Avatar className="w-7 h-7 sm:w-8 sm:h-8 cursor-pointer">
              <AvatarImage src={userProfilePic} />
              <AvatarFallback className="bg-blue-600 text-white font-semibold text-xs">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg border">
          <div className="px-3 py-2 border-b">
            <p className="font-medium text-gray-900">{userName}</p>
            <p className="text-sm text-gray-500">{userEmail.length > 20? userEmail.slice(0,19)+'...' : userEmail}</p>
          </div>
          <DropdownMenuItem onClick={handleViewProfile} className="cursor-pointer">
            <User className="w-4 h-4 mr-2" />
            View Profile
          </DropdownMenuItem>
          {!shouldHideAccountSettings() && (
            <DropdownMenuItem onClick={handleAccountSettings} className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Account Settings
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
