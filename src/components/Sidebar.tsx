import React, { useState } from 'react';
import { 
  BarChart3, 
  FileText, 
  MessageSquare, 
  Image, 
  TrendingUp, 
  MapPin, 
  Users, 
  Bell, 
  Settings,
  ChevronDown,
  Search,
  Star,
  CreditCard,
  User
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
}

const navigationItems = [
  { 
    id: 'overview', 
    label: 'Dashboard', 
    icon: BarChart3,
    description: 'Dashboard overview',
    path: '/'
  },
  { 
    id: 'posts', 
    label: 'Posts', 
    icon: FileText,
    description: 'Manage posts',
    path: '/'
  },
  { 
    id: 'media', 
    label: 'Media', 
    icon: Image,
    description: 'Media library',
    path: '/'
  },
  { 
    id: 'insights', 
    label: 'Insights', 
    icon: TrendingUp,
    description: 'Performance insights',
    path: '/'
  },
  { 
    id: 'reviews', 
    label: 'Reviews', 
    icon: MessageSquare,
    description: 'Customer reviews',
    path: '/'
  },
  { 
    id: 'geo-ranking', 
    label: 'GEO Ranking', 
    icon: MapPin,
    description: 'Local search rankings',
    path: '/'
  },
  { 
    id: 'subscription', 
    label: 'Subscription', 
    icon: CreditCard,
    description: 'Subscription management',
    path: '/'
  },
];

const businesses = [
  { 
    id: '1', 
    name: 'Downtown Coffee Shop', 
    address: '123 Main St, NYC',
    status: 'Active'
  },
  { 
    id: '2', 
    name: 'Uptown Bakery', 
    address: '456 Park Ave, NYC',
    status: 'Active'
  },
  { 
    id: '3', 
    name: 'Westside Restaurant', 
    address: '789 West St, NYC',
    status: 'Pending'
  },
  { 
    id: '4', 
    name: 'East End Boutique', 
    address: '321 East Ave, NYC',
    status: 'Active'
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  collapsed 
}) => {
  const navigate = useNavigate();
  const [selectedBusiness, setSelectedBusiness] = useState(businesses[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavigation = (item: any) => {
    navigate('/');
    onTabChange(item.id);
  };

  return (
    <div className={cn(
      "bg-slate-900 text-white flex flex-col transition-all duration-300 ease-in-out fixed top-0 left-0 h-screen z-40 border-r border-slate-700",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        {!collapsed && (
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GB</span>
            </div>
            <div>
              <h1 className="font-bold text-white text-base tracking-tight">GBP Manager</h1>
              <p className="text-xs text-slate-400 font-medium">Professional Suite</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => handleNavigation(item)}
                className={cn(
                  "w-full justify-start gap-3 h-10 font-medium transition-all duration-200 text-left",
                  collapsed ? "px-2" : "px-3",
                  isActive 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className={cn(
                  "flex-shrink-0 transition-colors",
                  collapsed ? "w-5 h-5" : "w-4 h-4"
                )} />
                {!collapsed && (
                  <span className="truncate text-sm">{item.label}</span>
                )}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Upgrade Section */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-700">
          <div className="bg-slate-800 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold text-white">Upgrade to Pro+</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">Unlock advanced features</p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm">
              Upgrade Now
            </Button>
          </div>
          
          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-xs">JD</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">John Doe</p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-slate-400">Pro Plan Active</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
