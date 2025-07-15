import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart3, Star, MapPin, Heart, Image, LogOut, Search, Bell, User, Sun, Moon, Target, FileText, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

interface PublicReportDashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  companyName?: string;
  companyLogo?: string;
  onExport?: () => void;
  onShare?: () => void;
}

const sidebarItems = [{
  id: 'gmb-health',
  label: 'GMB Health',
  icon: Heart,
  path: '/public-reports/gmb-health/demo-token'
}, {
  id: 'insights',
  label: 'Business Insights',
  icon: BarChart3,
  path: '/public-reports/insights/demo-token'
}, {
  id: 'reviews',
  label: 'Reviews',
  icon: Star,
  path: '/public-reports/reviews/demo-token'
}, {
  id: 'post-performance',
  label: 'Post Performance',
  icon: FileText,
  path: '/public-reports/post-performance/demo-token'
}, {
  id: 'media',
  label: 'Media Performance',
  icon: Image,
  path: '/public-reports/media/demo-token'
}, {
  id: 'geo-ranking',
  label: 'GEO Ranking',
  icon: MapPin,
  path: '/public-reports/geo-ranking/demo-token'
}];

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const getCurrentReportId = () => {
    const path = location.pathname;
    return sidebarItems.find(item => path.includes(item.id))?.id || '';
  };

  const currentReportId = getCurrentReportId();

  return <TooltipProvider>
      <div className="min-h-screen bg-white flex relative">
        {/* Mobile Overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed left-0 top-0 h-full bg-white/95 backdrop-blur-sm border-r border-gray-100 shadow-sm z-50 flex flex-col items-center py-8 px-2 transition-transform duration-300
          ${isMobile ? 'w-24' : 'w-24'}
          ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
        `}>
          {/* Favicon at Top */}
          <div className="mb-8">
            <img src="/lovable-uploads/f6f982ce-daf2-42fe-bff3-b78a0c684308.png" alt="Favicon" className="w-12 h-12 rounded-xl shadow-lg object-cover" />
          </div>

          {/* Navigation Icons */}
          <div className="flex flex-col items-center space-y-6 flex-1 justify-center">
            {sidebarItems.map(item => {
            const IconComponent = item.icon;
            const isActive = currentReportId === item.id;
            return <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => {
                        navigate(item.path);
                        if (isMobile) setSidebarOpen(false);
                      }} 
                      className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm ${isActive ? 'bg-primary text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-md'}`}
                    >
                      <IconComponent className="h-10 w-10" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="ml-2">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>;
          })}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${isMobile ? 'ml-0' : 'ml-24'}`}>
          {/* Dark Header */}
          <header className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white h-[250px] z-10 relative">
            {/* Report Date - Top Right */}
            <div className={`${isMobile ? 'absolute top-4 right-4 z-20' : 'absolute top-6 right-6'}`}>
              <div className="text-right">
                <span className={`text-white ${isMobile ? 'text-sm' : 'text-base'}`}>
                  Report Date: {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="absolute top-4 left-4 p-2 bg-white/20 rounded-lg backdrop-blur-sm z-20"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}
            
            <h2 className="text-3xl font-bold text-white" style={{
              marginTop: isMobile ? "60px" : "30px",
              textAlign: "center"
            }}>{title}</h2>
            <div className={`container mx-auto px-4 md:px-8 ${isMobile ? 'flex items-center justify-center' : 'flex items-center justify-between'}`} style={{
              paddingTop: '20px',
              paddingBottom: '50px'
            }}>
              {/* Business Branding - Centered on mobile */}
              <div className={`flex items-center ${isMobile ? 'space-x-4' : 'space-x-4'}`}>
                {companyLogo ? <img src={companyLogo} alt="Business Logo" className={`rounded-lg object-cover ${isMobile ? 'w-8 h-8' : 'w-16 h-16'}`} /> : <div className={`bg-white rounded-lg flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-16 h-16'}`}>
                    <span className={`font-bold text-gray-900 ${isMobile ? 'text-sm' : 'text-2xl'}`}>{companyName?.charAt(0) || 'B'}</span>
                  </div>}
                <div className={`flex flex-col`}>
                  <h1 className={`font-bold text-white ${isMobile ? 'text-base' : 'text-2xl'}`}>{companyName}</h1>
                  <p className={`text-white/80 ${isMobile ? 'text-xs leading-tight max-w-[280px]' : 'text-lg'}`}>123 Main Street, Business City, BC 12345</p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto relative z-40" style={{
            marginTop: '0'
          }}>
            <div className={`${isMobile ? 'w-full px-4 py-6' : 'container mx-auto p-8'}`}>
                {children}
            </div>
          </main>

          {/* CTA Section */}
          <section className="relative overflow-hidden" style={{ backgroundColor: '#1e293b' }}>
            <div className={`container mx-auto ${isMobile ? 'px-4 py-12' : 'px-6 py-20'}`}>
              <div className="grid grid-cols-1 gap-12 items-center">
                {/* Left Content */}
                <div className="text-white">
                  {/* Report Branding Information */}
                  

                  {/* Company Branding Card */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className={`flex items-center mb-4 ${isMobile ? 'flex-col space-y-2 text-center' : 'space-x-4'}`}>
                      {companyLogo ? <img src={companyLogo} alt="Company Logo" className="w-12 h-12 rounded-lg object-cover" /> : <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-bold text-white">{companyName?.charAt(0) || 'C'}</span>
                        </div>}
                      <div className={isMobile ? 'text-center' : ''}>
                        <h3 className="text-lg font-semibold text-white">{companyName}</h3>
                        <p className="text-white/80 text-sm">Digital Marketing Solutions</p>
                      </div>
                    </div>
                    
                    <div className={`grid gap-3 text-sm ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                      <div className="text-white/90">
                        <span className="text-white/70">Email: </span>
                        contact@{companyName?.toLowerCase().replace(/\s+/g, '') || 'company'}.com
                      </div>
                      <div className="text-white/90">
                        <span className="text-white/70">Phone: </span>
                        (555) 123-4567
                      </div>
                      <div className="text-white/90">
                        <span className="text-white/70">Website: </span>
                        www.{companyName?.toLowerCase().replace(/\s+/g, '') || 'company'}.com
                      </div>
                      <div className="text-white/90">
                        <span className="text-white/70">Address: </span>
                        123 Business Ave, Suite 100
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
            
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
            </div>
          </section>

          {/* Footer */}
          <footer className={`bg-white border-t border-gray-100 px-6 py-4 text-sm text-gray-500 ${isMobile ? 'flex-col space-y-2' : 'flex items-center justify-between'}`}>
            <div className={isMobile ? 'text-center' : ''}>
              Created by <span className="font-medium text-gray-700">{companyName}</span>
            </div>
            <div className={`flex items-center ${isMobile ? 'justify-center space-x-4' : 'space-x-6'}`}>
              <button className="hover:text-gray-700 transition-colors">About</button>
              <button className="hover:text-gray-700 transition-colors">Support</button>
              <button className="hover:text-gray-700 transition-colors">Purchase</button>
            </div>
          </footer>
        </div>
      </div>
    </TooltipProvider>;
};
