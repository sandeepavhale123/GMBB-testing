
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { ThemeProvider } from '../components/ThemeProvider';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { ProfileHeader } from '../components/Profile/ProfileHeader';
import { EditProfileForm } from '../components/Profile/EditProfileForm';
import { ChangePasswordModal } from '../components/Profile/ChangePasswordModal';
import { CurrentPlanCard } from '../components/Profile/CurrentPlanCard';
import { Toaster } from '../components/ui/toaster';
import { Sheet, SheetContent } from '../components/ui/sheet';

const Profile = () => {
  const [activeTab, setActiveTab] = useState<'edit' | 'password'>('edit');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: 'edit' | 'password') => {
    if (tab === 'password') {
      setShowPasswordModal(true);
    } else {
      setActiveTab(tab);
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
                activeTab="overview"
                onTabChange={() => {}}
                collapsed={false}
              />
            </SheetContent>
          </Sheet>

          {/* Desktop Sidebar */}
          <div className="hidden md:flex">
            <Sidebar
              activeTab="overview"
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
              title="Profile Settings"
              showFilters={false}
            />

            {/* Page Content */}
            <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Profile Header Card */}
                <ProfileHeader 
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                />
                
                {/* Current Plan Card */}
                <CurrentPlanCard />
                
                {/* Edit Profile Form */}
                <EditProfileForm />
              </div>
            </main>
          </div>

          <ChangePasswordModal 
            isOpen={showPasswordModal}
            onClose={() => setShowPasswordModal(false)}
          />
          
          <Toaster />
        </div>
      </ThemeProvider>
    </Provider>
  );
};

export default Profile;
