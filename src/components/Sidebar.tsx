
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  BarChart3, 
  MapPin, 
  Star, 
  Building, 
  Settings, 
  Crown,
  Sparkles
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
  { id: 'businesses', label: 'Management', icon: Building, path: '/businesses' },
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
      "fixed left-0 top-0 z-40 h-screen bg-gray-900 border-r border-gray-800 transition-all duration-300 ease-in-out",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-center border-b border-gray-800 px-4">
          {!collapsed ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GM</span>
              </div>
              <span className="text-xl font-bold text-white">GMB Genie</span>
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
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
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

        {/* Upgrade Plan Card */}
        {!collapsed && (
          <div className="px-3 pb-4">
            <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-0">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm font-semibold text-white">Upgrade Plan</span>
                </div>
                <p className="text-xs text-blue-100 mb-3">
                  Unlock premium features and get unlimited access
                </p>
                <Button 
                  size="sm" 
                  className="w-full bg-white text-blue-600 hover:bg-blue-50 text-xs font-medium"
                  onClick={() => navigate('/settings')}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* User Profile Section */}
        <div className="border-t border-gray-800 p-4">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start h-12 text-gray-300 hover:bg-gray-800 hover:text-white",
              collapsed ? "px-2" : "px-3"
            )}
            onClick={() => navigate('/profile')}
          >
            <div className={cn(
              "w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center",
              collapsed ? "mx-auto" : "mr-3"
            )}>
              <span className="text-sm font-medium text-gray-200">JD</span>
            </div>
            {!collapsed && (
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white">John Doe</p>
                <p className="text-xs text-gray-400">john@example.com</p>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
