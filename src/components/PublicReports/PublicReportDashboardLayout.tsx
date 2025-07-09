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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    <TooltipProvider>
      <div className="min-h-screen bg-white flex">
        {/* Fixed Icon Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-24 bg-white/80 backdrop-blur-sm border-r border-gray-100 shadow-sm z-50 flex flex-col items-center py-8 px-2">
          {/* Favicon at Top */}
          <div className="mb-8">
            <img 
              src="/lovable-uploads/f6f982ce-daf2-42fe-bff3-b78a0c684308.png" 
              alt="Favicon" 
              className="w-12 h-12 rounded-xl shadow-lg object-cover"
            />
          </div>

          {/* Navigation Icons */}
          <div className="flex flex-col items-center space-y-6 flex-1 justify-center">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentReportId === item.id;
              
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => navigate(item.path)}
                      className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm ${
                        isActive 
                          ? 'bg-blue-500 text-white shadow-md' 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-md'
                      }`}
                    >
                      <IconComponent className="h-10 w-10" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="ml-2">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 ml-24 flex flex-col">
          {/* Dark Header */}
          <header className="bg-slate-800 text-white h-[300px] z-10">
            <div className="container mx-auto h-full flex items-center justify-between px-8">
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
                </div>
              </div>

              {/* Center: Reserved for future expansion */}
              <div className="flex-1"></div>

              {/* Right: Report Date */}
              <div className="text-right">
                <p className="text-sm text-gray-400">Report Date</p>
                <p className="text-lg text-white">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 bg-white overflow-auto -mt-20 relative z-40">
            <div className="container mx-auto p-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                {children}
              </div>
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
    </TooltipProvider>
  );
};