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
      <div className="min-h-screen flex">
        {/* Ultra-minimal Light Sidebar - Fixed Position */}
        <div className={`fixed inset-y-0 left-0 z-50 w-16 bg-background border-r shadow-sm transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Logo Section */}
          <div className="h-16 flex items-center justify-center">
            {companyLogo ? (
              <img 
                src={companyLogo} 
                alt={companyName}
                className="h-8 w-8 object-contain"
              />
            ) : (
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  {companyName.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Sidebar Navigation - Vertically Centered */}
          <nav className="flex-1 flex flex-col justify-center">
            <div className="space-y-1">
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
                        className={`w-full h-12 flex items-center justify-center transition-all duration-200 ${
                          isActive 
                            ? 'bg-primary text-primary-foreground' 
                            : 'text-muted-foreground hover:text-primary hover:bg-muted'
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
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
            <div className="mt-8">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => navigate('/public-reports')}
                    className="w-full h-12 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted transition-all duration-200"
                  >
                    <FileText className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  <p>All Reports</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </nav>
        </div>

        {/* Main Content - Dark theme area */}
        <div className="flex-1 flex flex-col min-w-0 ml-16 bg-slate-900">
          {/* Header - Dark theme */}
          <header className="bg-slate-800 border-b border-slate-700 h-16 flex items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-slate-300 hover:text-white"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              
              <div>
                <h1 className="text-xl font-semibold text-white">{title}</h1>
                <p className="text-sm text-slate-400">{companyName}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onShare && (
                <Button variant="outline" size="sm" onClick={onShare} className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              )}
              {onExport && (
                <Button size="sm" onClick={onExport} className="bg-primary hover:bg-primary/90">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              )}
            </div>
          </header>

          {/* Page Content - Dark theme */}
          <main className="flex-1 overflow-auto bg-slate-900">
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