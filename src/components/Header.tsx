
import React, { useEffect, useState } from 'react';
import { 
  Menu, 
  Bell, 
  Settings, 
  Moon, 
  Sun,
  Filter,
  Search,
  ChevronDown,
  MapPin
} from 'lucide-react';
import { Button } from './ui/button';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { toggleTheme } from '../store/slices/themeSlice';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface HeaderProps {
  onToggleSidebar: () => void;
  title: string;
  showFilters?: boolean;
  onShowFilters?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onToggleSidebar, 
  title, 
  showFilters, 
  onShowFilters 
}) => {
  const dispatch = useAppDispatch();
  const { isDark } = useAppSelector((state) => state.theme);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();
      const hour = now.getHours();
      
      if (hour < 12) {
        setGreeting('Good morning');
      } else if (hour < 17) {
        setGreeting('Good afternoon');
      } else {
        setGreeting('Good evening');
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="hover:bg-gray-100 p-2"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </Button>
          
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-gray-900">{greeting}, John!</h1>
                <span className="text-lg">👋</span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">
                Manage your business listings with ease
              </p>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Business Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-gray-200 hover:bg-gray-50"
              >
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Downtown Coffee...</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Restaurant</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-sm">Downtown Coffee Shop</p>
                    <p className="text-xs text-gray-500">123 Main St, NYC</p>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm" className="hover:bg-gray-100 p-2">
            <Search className="w-4 h-4 text-gray-600" />
          </Button>

          <Button variant="ghost" size="sm" className="hover:bg-gray-100 p-2 relative">
            <Bell className="w-4 h-4 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
          </Button>

          <Button variant="ghost" size="sm" className="hover:bg-gray-100 p-2">
            <Settings className="w-4 h-4 text-gray-600" />
          </Button>

          <div className="flex items-center gap-2 ml-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-xs">JD</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-700">John Doe</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Pro Plan</span>
            </div>
            <Button variant="ghost" size="sm" className="text-sm text-gray-600 hover:bg-gray-100">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
