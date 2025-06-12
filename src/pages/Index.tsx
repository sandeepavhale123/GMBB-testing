import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { ThemeProvider } from '../components/ThemeProvider';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Dashboard } from '../components/Dashboard/Dashboard';
import { PostsPage } from '../components/Posts/PostsPage';
import { Toaster } from '../components/ui/toaster';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { Button } from '../components/ui/button';
import { Menu } from 'lucide-react';
import { GeoRankingPage } from '../components/GeoRanking/GeoRankingPage';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'overview':
        return 'Overview';
      case 'posts':
        return 'Posts Management';
      case 'geo-ranking':
        return 'GEO Ranking';
      case 'reviews':
        return 'Reviews Management';
      case 'analytics':
        return 'Analytics';
      case 'businesses':
        return 'Business Locations';
      case 'team':
        return 'Team Management';
      case 'notifications':
        return 'Notifications';
      case 'settings':
        return 'Settings';
      default:
        return 'Overview';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Dashboard />;
      case 'posts':
        return <PostsPage />;
      case 'geo-ranking':
        return <GeoRankingPage />;
      case 'reviews':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Reviews Management</h2>
              <p className="text-gray-600">Monitor and respond to customer reviews.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{getPageTitle(activeTab)}</h2>
              <p className="text-gray-600">This section is coming soon.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Provider store={store}>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 flex w-full">
          {/* Mobile Navigation Sheet */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar
                activeTab={activeTab}
                onTabChange={(tab) => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
                collapsed={false}
              />
            </SheetContent>
          </Sheet>

          {/* Desktop Sidebar */}
          <div className="hidden md:flex">
            <Sidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              collapsed={sidebarCollapsed}
            />
          </div>

          {/* Main Content */}
          <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
          }`}>
            {/* Header */}
            <Header
              onToggleSidebar={() => {
                if (window.innerWidth < 768) {
                  setMobileMenuOpen(true);
                } else {
                  setSidebarCollapsed(!sidebarCollapsed);
                }
              }}
              title={getPageTitle(activeTab)}
              showFilters={['posts', 'reviews', 'geo-ranking'].includes(activeTab)}
            />

            {/* Page Content */}
            <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
              {renderContent()}
            </main>
          </div>

          <Toaster />
        </div>
      </ThemeProvider>
    </Provider>
  );
};

export default Index;
