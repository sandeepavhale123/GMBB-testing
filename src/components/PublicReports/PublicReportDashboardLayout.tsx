import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  BarChart3, 
  Star, 
  MapPin, 
  Heart, 
  Image,
  LogOut,
  Search,
  Bell,
  User,
  Sun,
  Moon,
  Target
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface PublicReportDashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  companyName?: string;
  companyLogo?: string;
  onExport?: () => void;
  onShare?: () => void;
}

const sidebarItems = [
  { 
    id: 'gmb-health', 
    label: 'GMB Health', 
    icon: Heart, 
    path: '/public-reports/gmb-health/demo-token'
  },
  { 
    id: 'geo-ranking', 
    label: 'GEO Ranking', 
    icon: MapPin, 
    path: '/public-reports/geo-ranking/demo-token'
  },
  { 
    id: 'reviews', 
    label: 'Reviews', 
    icon: Star, 
    path: '/public-reports/reviews/demo-token'
  },
  { 
    id: 'insights', 
    label: 'Business Insights', 
    icon: BarChart3, 
    path: '/public-reports/insights/demo-token'
  },
  { 
    id: 'media', 
    label: 'Media Performance', 
    icon: Image, 
    path: '/public-reports/media/demo-token'
  }
];

export const PublicReportDashboardLayout: React.FC<PublicReportDashboardLayoutProps> = ({
  children,
  title,
  companyName = 'Demo Business',
  companyLogo,
  onExport,
  onShare
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const getCurrentReportId = () => {
    const path = location.pathname;
    return sidebarItems.find(item => path.includes(item.id))?.id || '';
  };

  const currentReportId = getCurrentReportId();

  return (
    <div className="min-h-screen bg-white flex">
      {/* Fixed Icon Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-20 bg-white/80 backdrop-blur-sm border-r border-gray-100 shadow-sm z-50 flex flex-col items-center py-8">
        {/* Favicon at Top */}
        <div className="mb-8">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-xl font-bold text-white">F</span>
          </div>
        </div>

        {/* Navigation Icons */}
        <div className="flex flex-col items-center space-y-6 flex-1 justify-center">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentReportId === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm ${
                  isActive 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-md'
                }`}
                title={item.label}
              >
                <IconComponent className="h-8 w-8" />
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-20 flex flex-col">
        {/* Dark Header */}
        <header className="bg-slate-800 text-white h-[200px] flex items-center justify-between px-8 sticky top-0 z-40">
          {/* Left: Business Branding */}
          <div className="flex items-center space-x-4">
            {companyLogo ? (
              <img src={companyLogo} alt="Business Logo" className="w-16 h-16 rounded-lg object-cover" />
            ) : (
              <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{companyName?.charAt(0) || 'B'}</span>
              </div>
            )}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">{companyName}</h1>
              <p className="text-lg text-gray-300">{title}</p>
              <p className="text-sm text-gray-400">Report Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Center: Reserved for future expansion */}
          <div className="flex-1"></div>

          {/* Right: Empty for now */}
          <div></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-white overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between text-sm text-gray-500">
          <div>
            Created by <span className="font-medium text-gray-700">{companyName}</span>
          </div>
          <div className="flex items-center space-x-6">
            <button className="hover:text-gray-700 transition-colors">About</button>
            <button className="hover:text-gray-700 transition-colors">Support</button>
            <button className="hover:text-gray-700 transition-colors">Purchase</button>
          </div>
        </footer>
      </div>
    </div>
  );
};