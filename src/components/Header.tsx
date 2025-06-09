
import React, { useEffect, useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Settings, 
  Moon, 
  Sun,
  Filter
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { toggleTheme } from '../store/slices/themeSlice';
import { cn } from '../lib/utils';

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
    // Update greeting every minute
    const interval = setInterval(updateGreeting, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
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
          
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
              <span className="text-sm text-gray-500 font-medium px-3 py-1 bg-gray-100 rounded-full">
                {greeting}, John
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              Manage your Google Business Profile effortlessly
            </p>
          </div>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search businesses, posts, reviews..."
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 transition-colors"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {showFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onShowFilters}
              className="gap-2 border-gray-200 hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(toggleTheme())}
            className="hover:bg-gray-100 p-2"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <Button variant="ghost" size="sm" className="hover:bg-gray-100 p-2 relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <Button variant="ghost" size="sm" className="hover:bg-gray-100 p-2">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
