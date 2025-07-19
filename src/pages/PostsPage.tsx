import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { ThemeProvider } from '../components/ThemeProvider';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header/Header';
import { PostsPage as Posts } from '../components/Posts/PostsPage';
import { Toaster } from '../components/ui/toaster';
import { Sheet, SheetContent } from '../components/ui/sheet';
import { NoListingSelected } from '../components/ui/no-listing-selected';
import { useListingContext } from '../context/ListingContext';

const PostsPage = () => {
  const { listingId } = useParams<{ listingId?: string }>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { selectedListing, isInitialLoading, listings } = useListingContext();

  // Check if we have a valid listing
  const hasValidListing = () => {
    // If we have a selected listing, that's valid
    if (selectedListing) return true;
    
    // If we have a URL listing ID that exists in user's listings, that's valid
    if (listingId && listingId !== 'default') {
      return listings.some(listing => listing.id === listingId);
    }
    
    return false;
  };

  // Show no listing selected state
  if (!hasValidListing() && !isInitialLoading) {
    return (
      <Provider store={store}>
        <ThemeProvider>
          <div className="min-h-screen bg-gray-50 flex w-full">
            {/* Mobile Navigation Sheet */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar
                  activeTab="posts"
                  onTabChange={() => {}}
                  collapsed={false}
                  onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
              </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex">
              <Sidebar
                activeTab="posts"
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
                showFilters={true}
              />

              {/* Page Content */}
              <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
                <NoListingSelected pageType="Posts" />
              </main>
            </div>

            <Toaster />
          </div>
        </ThemeProvider>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 flex w-full">
          {/* Mobile Navigation Sheet */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar
                activeTab="posts"
                onTabChange={() => {}}
                collapsed={false}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              />
            </SheetContent>
          </Sheet>

          {/* Desktop Sidebar */}
          <div className="hidden md:flex">
            <Sidebar
              activeTab="posts"
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
              showFilters={true}
            />

            {/* Page Content */}
            <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
              <Posts />
            </main>
          </div>

          <Toaster />
        </div>
      </ThemeProvider>
    </Provider>
  );
};

export default PostsPage;
