
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Star, 
  Image, 
  Settings, 
  Building2,
  BarChart3,
  Users,
  Bell,
  ChevronDown,
  MapPin
} from 'lucide-react';
import { cn } from '../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
}

const menuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'posts', label: 'Posts', icon: FileText },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'media', label: 'Media', icon: Image },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'businesses', label: 'Businesses', icon: Building2 },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const businesses = [
  { id: 1, name: 'Downtown Café', address: '123 Main St, New York' },
  { id: 2, name: 'Sunset Restaurant', address: '456 Ocean Ave, Miami' },
  { id: 3, name: 'Tech Solutions Inc', address: '789 Business Blvd, Austin' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, collapsed }) => {
  const [selectedBusiness, setSelectedBusiness] = useState(businesses[0]);

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm",
      collapsed ? "w-16" : "w-72"
    )}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-xl text-gray-900 tracking-tight">GMB Manager</h1>
              <p className="text-xs text-gray-500 font-medium">Business Dashboard</p>
            </div>
          )}
        </div>
      </div>

      {/* Business Selector */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-100">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
              <div className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 text-sm truncate max-w-[140px]">
                      {selectedBusiness.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[140px]">
                      {selectedBusiness.address}
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2" align="start">
              {businesses.map((business) => (
                <DropdownMenuItem
                  key={business.id}
                  onClick={() => setSelectedBusiness(business)}
                  className="p-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{business.name}</p>
                      <p className="text-xs text-gray-500">{business.address}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-3 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-gray-600" />
                  </div>
                  <p className="font-medium text-gray-700 text-sm">Add New Business</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium text-sm",
              activeTab === item.id
                ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-colors",
              activeTab === item.id ? "text-blue-600" : "text-gray-500"
            )} />
            {!collapsed && (
              <span>{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* User Profile */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-semibold">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">John Doe</p>
              <p className="text-xs text-gray-500 truncate">john@company.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
