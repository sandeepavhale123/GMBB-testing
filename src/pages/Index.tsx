
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { ThemeProvider } from '../components/ThemeProvider';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Dashboard } from '../components/Dashboard/Dashboard';
import { Toaster } from '../components/ui/toaster';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Dashboard';
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
        return 'Dashboard';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'posts':
        return (
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-border p-8 text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">Posts Management</h2>
              <p className="text-muted-foreground">Manage your Google Business Profile posts across all locations.</p>
            </div>
          </div>
        );
      case 'reviews':
        return (
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-border p-8 text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">Reviews Management</h2>
              <p className="text-muted-foreground">Monitor and respond to customer reviews.</p>
            </div>
          </div>
        );
      case 'media':
        return (
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-border p-8 text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">Media Library</h2>
              <p className="text-muted-foreground">Upload and manage photos and videos for your businesses.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-border p-8 text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">{getPageTitle(activeTab)}</h2>
              <p className="text-muted-foreground">This section is coming soon.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Provider store={store}>
      <ThemeProvider>
        <div className="min-h-screen bg-background flex w-full">
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
