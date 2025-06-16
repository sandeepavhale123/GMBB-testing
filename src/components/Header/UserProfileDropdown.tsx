
import React from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";

export const UserProfileDropdown: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthRedux();

  const handleAccountSettings = () => {
    navigate('/settings');
  };

  return (
    <div className="flex items-center gap-2 ml-1 sm:ml-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0 rounded-full hover:bg-gray-100">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer">
              <span className="text-white font-semibold text-xs">JD</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg border">
          <div className="px-3 py-2 border-b">
            <p className="font-medium text-gray-900">John Doe</p>
            <p className="text-sm text-gray-500">john.doe@example.com</p>
          </div>
          <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
            <User className="w-4 h-4 mr-2" />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleAccountSettings} className="cursor-pointer">
            <Settings className="w-4 h-4 mr-2" />
            Account Settings
          </DropdownMenuItem>
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
