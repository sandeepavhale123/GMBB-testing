
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { ThemeProvider } from '../components/ThemeProvider';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Toaster } from '../components/ui/toaster';
import { Sheet, SheetContent } from '../components/ui/sheet';

const NotificationsPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 flex w-full">
          {/* Mobile Navigation Sheet */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar
                activeTab="notifications"
                onTabChange={() => {}}
                collapsed={false}
              />
            </SheetContent>
          </Sheet>

          {/* Desktop Sidebar */}
          <div className="hidden md:flex">
            <Sidebar
              activeTab="notifications"
              onTabChange={() => {}}
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
              title="Notifications"
              showFilters={false}
            />

            {/* Page Content */}
            <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Notifications</h2>
                  <p className="text-gray-600">This section is coming soon.</p>
                </div>
              </div>
            </main>
          </div>

          <Toaster />
        </div>
      </ThemeProvider>
    </Provider>
  );
};

export default NotificationsPage;
