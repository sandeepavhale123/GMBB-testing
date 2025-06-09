
import React from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Settings, 
  Moon, 
  Sun,
  Plus,
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

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="hover:bg-accent"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">
              Manage your Google Business Profile
            </p>
          </div>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search businesses, posts, reviews..."
              className="pl-10 bg-background border-border"
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
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          )}
          
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            New Post
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(toggleTheme())}
            className="hover:bg-accent"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <Button variant="ghost" size="sm" className="hover:bg-accent">
            <Bell className="w-4 h-4" />
          </Button>

          <Button variant="ghost" size="sm" className="hover:bg-accent">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
