import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { ThemeProvider } from '../components/ThemeProvider';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header/Header';
import { AddKeywordsPage as AddKeywords } from '../components/Keywords/AddKeywordsPage';
import { Toaster } from '../components/ui/toaster';
import { Sheet, SheetContent } from '../components/ui/sheet';
import { NoListingSelected } from '../components/ui/no-listing-selected';
import { useListingContext } from '../context/ListingContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

const AddKeywordsPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { selectedListing, isInitialLoading } = useListingContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddKeywords = async (keywords: string[]) => {
    try {
      // TODO: Implement API call to add keywords
      console.log('Adding keywords:', keywords);
      
      toast({
        title: "Keywords Added",
        description: `Successfully added ${keywords.length} keyword(s) for ranking check.`,
      });

      // Navigate back to keywords page
      navigate(`/keywords/${selectedListing?.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add keywords. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show no listing selected state
  if (!selectedListing && !isInitialLoading) {
    return (
      <Provider store={store}>
        <ThemeProvider>
          <div className="min-h-screen bg-gray-50 flex w-full">
            {/* Mobile Navigation Sheet */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar
                  activeTab="keywords"
                  onTabChange={() => {}}
                  collapsed={false}
                  onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
              </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex">
              <Sidebar
                activeTab="keywords"
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

              {/* Page Content */}
              <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
                <NoListingSelected pageType="Add Keywords" />
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
        <AddKeywords onAddKeywords={handleAddKeywords} />
        <Toaster />
      </ThemeProvider>
    </Provider>
  );
};

export default AddKeywordsPage;