
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { ThemeProvider } from '../components/ThemeProvider';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header/Header';
import { Toaster } from '../components/ui/toaster';
import { Sheet, SheetContent } from '../components/ui/sheet';
import { SettingsSubHeader } from '../components/Settings/SettingsSubHeader';
import { ManageGoogleAccountPage } from '../components/Settings/ManageGoogleAccountPage';
import { GenieSubscriptionPage } from '../components/Settings/GenieSubscriptionPage';
import { ListingManagementPage } from '../components/Settings/ListingManagementPage';

const SettingsPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('google-account');
  const [currentView, setCurrentView] = useState<'main' | 'listings'>('main');
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const handleManageListings = (accountId: string) => {
    setSelectedAccountId(accountId);
    setCurrentView('listings');
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedAccountId(null);
  };

  const renderTabContent = () => {
    if (currentView === 'listings') {
      return <ListingManagementPage onBack={handleBackToMain} />;
    }

    switch (activeTab) {
      case 'google-account':
        return <ManageGoogleAccountPage onManageListings={handleManageListings} />;
      case 'genie-subscription':
        return <GenieSubscriptionPage />;
      default:
        return <ManageGoogleAccountPage onManageListings={handleManageListings} />;
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
                activeTab="settings"
                onTabChange={() => {}}
                collapsed={false}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              />
            </SheetContent>
          </Sheet>

          {/* Desktop Sidebar */}
          <div className="hidden md:flex">
            <Sidebar
              activeTab="settings"
              onTabChange={() => {}}
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
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
              showFilters={false}
            />

            {/* Settings Sub Header - Only show on main view */}
            {currentView === 'main' && (
              <SettingsSubHeader
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            )}

            {/* Page Content */}
            <main className="flex-1 overflow-auto bg-gray-50">
              <div className="min-h-full">
                {renderTabContent()}
              </div>
            </main>
          </div>

          <Toaster />
        </div>
      </ThemeProvider>
    </Provider>
  );
};

export default SettingsPage;
