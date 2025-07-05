import React, { useState } from "react";
import { ThemeProvider } from "../ThemeProvider";
import { Sidebar } from "../Sidebar";
import { Header } from "../Header/Header";
import { Toaster } from "../ui/toaster";
import { Sheet, SheetContent } from "../ui/sheet";
import { useLocation } from "react-router-dom";
import { ListingLoader } from "../ui/listing-loader";
import { useListingContext } from "@/context/ListingContext";

interface AppLayoutProps {
  children: React.ReactNode;
  showFilters?: boolean;
  activeTab?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  showFilters = false,
  activeTab 
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isLoading } = useListingContext();

  // Determine active tab from URL if not provided
  const getActiveTabFromUrl = () => {
    if (activeTab) return activeTab;
    
    const pathParts = location.pathname.split('/');
    const route = pathParts[1];
    
    switch (route) {
      case 'location-dashboard':
        return 'overview';
      case 'posts':
        return 'posts';
      case 'media':
        return 'media';
      case 'insights':
        return 'insights';
      case 'geo-ranking':
        return 'geo-ranking';
      case 'reviews':
        return 'reviews';
      case 'qa':
        return 'qa';
      case 'health':
        return 'health';
      case 'business-info':
        return 'business-info';
      case 'settings':
        return 'settings';
      case 'profile':
        return 'overview';
      default:
        return 'overview';
    }
  };

  const currentActiveTab = getActiveTabFromUrl();

  // Determine if filters should be shown based on route
  const shouldShowFilters = () => {
    if (showFilters !== undefined) return showFilters;
    
    const filtersEnabledRoutes = ["posts", "reviews", "geo-ranking", "media", "insights"];
    return filtersEnabledRoutes.includes(currentActiveTab);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        {/* Mobile Navigation Sheet */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar
              activeTab={currentActiveTab}
              onTabChange={() => {}}
              collapsed={false}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <Sidebar
            activeTab={currentActiveTab}
            onTabChange={() => {}}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            sidebarCollapsed ? "md:ml-16" : "md:ml-64"
          }`}
        >
          {/* Header */}
          <Header
            onToggleSidebar={() => {
              if (window.innerWidth < 768) {
                setMobileMenuOpen(true);
              } else {
                setSidebarCollapsed(!sidebarCollapsed);
              }
            }}
            showFilters={shouldShowFilters()}
          />

          {/* Page Content with Loading Overlay */}
          <main className="flex-1 overflow-auto">
            <ListingLoader isLoading={isLoading}>
              {children}
            </ListingLoader>
          </main>
        </div>

        <Toaster />
      </div>
    </ThemeProvider>
  );
};