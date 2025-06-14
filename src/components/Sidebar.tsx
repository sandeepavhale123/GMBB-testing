
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  BarChart3, 
  MapPin, 
  Star, 
  TrendingUp, 
  Building, 
  Users, 
  Bell, 
  Settings, 
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
}

const menuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/' },
  { id: 'posts', label: 'Posts', icon: FileText, path: '/posts' },
  { id: 'media', label: 'Media', icon: Image, path: '/media' },
  { id: 'insights', label: 'Insights', icon: BarChart3, path: '/insights' },
  { id: 'geo-ranking', label: 'GEO Ranking', icon: MapPin, path: '/geo-ranking' },
  { id: 'reviews', label: 'Reviews', icon: Star, path: '/reviews' },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp, path: '/analytics' },
  { id: 'businesses', label: 'Businesses', icon: Building, path: '/businesses' },
  { id: 'team', label: 'Team', icon: Users, path: '/team' },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab based on current path
  const getActiveTab = () => {
    const currentPath = location.pathname;
    const activeItem = menuItems.find(item => item.path === currentPath);
    return activeItem ? activeItem.id : 'overview';
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tab: string, path: string) => {
    navigate(path);
  };

  return (
    <div className={cn(
      "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4">
          {!collapsed ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GM</span>
              </div>
              <span className="text-xl font-bold text-gray-900">GMB Genie</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GM</span>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start h-10 px-3",
                    collapsed ? "px-2" : "px-3",
                    isActive 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={() => handleTabChange(item.id, item.path)}
                >
                  <Icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </Button>
              );
            })}
          </nav>
        </ScrollArea>

        {/* User Profile Section */}
        <div className="border-t border-gray-200 p-4">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start h-12",
              collapsed ? "px-2" : "px-3"
            )}
            onClick={() => navigate('/profile')}
          >
            <div className={cn(
              "w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center",
              collapsed ? "mx-auto" : "mr-3"
            )}>
              <span className="text-sm font-medium text-gray-600">JD</span>
            </div>
            {!collapsed && (
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">john@example.com</p>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
