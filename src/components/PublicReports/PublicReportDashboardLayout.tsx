import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Star, 
  MapPin, 
  Heart, 
  Image,
  Menu,
  X,
  FileText,
  Download,
  Share2
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
    path: '/public-reports/gmb-health/demo-token',
    color: 'text-red-400'
  },
  { 
    id: 'geo-ranking', 
    label: 'GEO Ranking', 
    icon: MapPin, 
    path: '/public-reports/geo-ranking/demo-token',
    color: 'text-blue-400'
  },
  { 
    id: 'reviews', 
    label: 'Reviews', 
    icon: Star, 
    path: '/public-reports/reviews/demo-token',
    color: 'text-yellow-400'
  },
  { 
    id: 'insights', 
    label: 'Business Insights', 
    icon: BarChart3, 
    path: '/public-reports/insights/demo-token',
    color: 'text-green-400'
  },
  { 
    id: 'media', 
    label: 'Media Performance', 
    icon: Image, 
    path: '/public-reports/media/demo-token',
    color: 'text-purple-400'
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getCurrentReportId = () => {
    const path = location.pathname;
    return sidebarItems.find(item => path.includes(item.id))?.id || '';
  };

  const currentReportId = getCurrentReportId();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Light Sidebar - Fixed Position */}
        <div className={`fixed inset-y-0 left-0 z-50 w-20 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Logo Section */}
          <div className="h-16 flex items-center justify-center border-b border-gray-100">
            {companyLogo ? (
              <img 
                src={companyLogo} 
                alt={companyName}
                className="h-10 w-auto object-contain"
              />
            ) : (
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {companyName.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Sidebar Navigation - Vertically Centered */}
          <nav className="flex-1 flex flex-col justify-center px-3">
            <div className="space-y-4">
              {sidebarItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentReportId === item.id;
                
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          navigate(item.path);
                          setSidebarOpen(false);
                        }}
                        className={`w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-200 ${
                          isActive 
                            ? 'bg-primary text-white shadow-lg' 
                            : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                        }`}
                      >
                        <IconComponent className="h-8 w-8" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-2">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            {/* Back to Reports Hub */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => navigate('/public-reports')}
                    className="w-14 h-14 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-50 hover:text-primary transition-all duration-200"
                  >
                    <FileText className="h-8 w-8" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  <p>All Reports</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </nav>

          {/* Mobile Close Button */}
          <div className="lg:hidden p-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Main Content - Adjusted for fixed sidebar */}
        <div className="flex-1 flex flex-col min-w-0 ml-20">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-500">{companyName}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onShare && (
                <Button variant="outline" size="sm" onClick={onShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              )}
              {onExport && (
                <Button size="sm" onClick={onExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              )}
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-4 lg:p-6">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </TooltipProvider>
  );
};