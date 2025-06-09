
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
  Search
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

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
}

const navigationItems = [
  { 
    id: 'overview', 
    label: 'Overview', 
    icon: BarChart3,
    description: 'Dashboard overview'
  },
  { 
    id: 'posts', 
    label: 'Posts', 
    icon: FileText,
    description: 'Manage posts'
  },
  { 
    id: 'reviews', 
    label: 'Reviews', 
    icon: MessageSquare,
    description: 'Customer reviews'
  },
  { 
    id: 'media', 
    label: 'Media', 
    icon: Image,
    description: 'Photos & videos'
  },
  { 
    id: 'analytics', 
    label: 'Analytics', 
    icon: TrendingUp,
    description: 'Performance insights'
  },
  { 
    id: 'businesses', 
    label: 'Locations', 
    icon: MapPin,
    description: 'Business locations'
  },
  { 
    id: 'team', 
    label: 'Team', 
    icon: Users,
    description: 'Team management'
  },
  { 
    id: 'notifications', 
    label: 'Notifications', 
    icon: Bell,
    description: 'Alerts & updates'
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: Settings,
    description: 'Account settings'
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
  const [selectedBusiness, setSelectedBusiness] = useState(businesses[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out shadow-sm",
      collapsed ? "w-16" : "w-72"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        {!collapsed && (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GB</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg tracking-tight">GMB Manager</h1>
              <p className="text-xs text-gray-500 font-medium">Business Dashboard</p>
            </div>
          </div>
        )}
        
        {!collapsed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between text-left border-gray-200 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {selectedBusiness.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {selectedBusiness.address}
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80">
              <div className="p-2">
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search listings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 text-sm"
                  />
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {filteredBusinesses.map((business) => (
                    <DropdownMenuItem
                      key={business.id}
                      onClick={() => setSelectedBusiness(business)}
                      className="flex items-center gap-3 p-3 cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {business.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {business.address}
                        </p>
                        <span className={cn(
                          "inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1",
                          business.status === 'Active' 
                            ? "bg-emerald-100 text-emerald-700" 
                            : "bg-amber-100 text-amber-700"
                        )}>
                          {business.status}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  {filteredBusinesses.length === 0 && (
                    <div className="p-3 text-center text-gray-500 text-sm">
                      No listings found
                    </div>
                  )}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full justify-start gap-3 h-10 font-medium transition-all duration-200",
                  collapsed ? "px-2" : "px-3",
                  isActive 
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className={cn(
                  "flex-shrink-0 transition-colors",
                  collapsed ? "w-5 h-5" : "w-4 h-4",
                  isActive ? "text-blue-600" : "text-gray-500"
                )} />
                {!collapsed && (
                  <span className="truncate text-sm">{item.label}</span>
                )}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-xs">JD</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">John Doe</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
