
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { ThemeProvider } from '../components/ThemeProvider';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Dashboard } from '../components/Dashboard/Dashboard';
import { PostsPage } from '../components/Posts/PostsPage';
import { ReviewComponent } from '../components/Dashboard/ReviewComponent';
import { Toaster } from '../components/ui/toaster';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'overview':
        return 'Overview';
      case 'posts':
        return 'Posts Management';
      case 'reviews':
        return 'Reviews Management';
      case 'media':
        return 'Media Library';
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
      case 'reviews':
        return <ReviewComponent />;
      case 'media':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Media Library</h2>
              <p className="text-gray-600">Upload and manage photos and videos for your businesses.</p>
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
          {/* Sidebar */}
          <Sidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            collapsed={sidebarCollapsed}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <Header
              onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={getPageTitle(activeTab)}
              showFilters={['posts', 'reviews', 'media'].includes(activeTab)}
            />

            {/* Page Content */}
            <main className="flex-1 p-6 overflow-auto">
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
