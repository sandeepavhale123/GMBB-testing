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
                          ? 'bg-primary text-white shadow-md' 
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
          <header className="bg-slate-800 text-white h-[250px] z-10">
                            <h2 className="text-3xl font-bold text-white" style={{marginTop:"30px",textAlign:"center"}}>{title}</h2>
            <div className="container mx-auto flex items-center justify-between px-8" style={{paddingTop:'20px',paddingBottom:'50px'}}>
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
                  <p className="text-lg text-gray-300">123 Main Street, Business City, BC 12345</p>
                </div>
              </div>

              {/* Center: Report Title */}
              <div className="flex-1 text-center">

              </div>

              {/* Right: Report Date */}
              <div className="text-right">
                <p className="text-sm text-gray-400">Report Date</p>
                <p className="text-lg text-white">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1  overflow-auto  relative z-40" style={{marginTop:'-100px'}}>
            <div className="container mx-auto p-8">
                {children}
            </div>
          </main>

          {/* CTA Section */}
          <section className="bg-slate-50 border-t border-gray-200 px-6 py-12">
            <div className="container mx-auto">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">
                  Want detailed reports like this for your business?
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  Get comprehensive insights and analytics to grow your online presence
                </p>
                
                {/* Company Branding */}
                <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-4">
                      {companyLogo ? (
                        <img src={companyLogo} alt="Company Logo" className="w-16 h-16 rounded-lg object-cover" />
                      ) : (
                        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary">{companyName?.charAt(0) || 'C'}</span>
                        </div>
                      )}
                      <div className="text-left">
                        <h3 className="text-xl font-semibold text-slate-800">{companyName}</h3>
                        <p className="text-slate-600">Digital Marketing Solutions</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-left">
                      <div className="flex items-center space-x-3">
                        <span className="text-slate-500 min-w-[60px]">Email:</span>
                        <span className="text-slate-700">contact@{companyName?.toLowerCase().replace(/\s+/g, '') || 'company'}.com</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-slate-500 min-w-[60px]">Phone:</span>
                        <span className="text-slate-700">(555) 123-4567</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-slate-500 min-w-[60px]">Website:</span>
                        <span className="text-slate-700">www.{companyName?.toLowerCase().replace(/\s+/g, '') || 'company'}.com</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-slate-500 min-w-[60px]">Address:</span>
                        <span className="text-slate-700">123 Business Ave, Suite 100, City, ST 12345</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    Get Started Today
                  </button>
                  <button className="border border-gray-300 text-slate-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                    Schedule Demo
                  </button>
                </div>
              </div>
            </div>
          </section>

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