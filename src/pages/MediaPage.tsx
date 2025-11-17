import React, { Suspense, useState } from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { ThemeProvider } from "../components/ThemeProvider";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header/Header";
// import { MediaPage as Media } from "../components/Media/MediaPage";
// import MediaErrorBoundary from "../components/Media/MediaErrorBoundary";
// import { Toaster } from "../components/ui/toaster";
import { Sheet, SheetContent } from "../components/ui/sheet";
import { NoListingSelected } from "../components/ui/no-listing-selected";
import { useListingContext } from "../context/ListingContext";

import { lazyImport } from "@/utils/lazyImport";

// Lazy-loaded components
const Media = lazyImport(() =>
  import("../components/Media/MediaPage").then((m) => ({
    default: m.MediaPage,
  }))
);

const MediaErrorBoundary = lazyImport(() =>
  import("../components/Media/MediaErrorBoundary").then((m) => ({
    default: m.default,
  }))
);

const MediaPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { selectedListing, isInitialLoading } = useListingContext();

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
                  activeTab="media"
                  onTabChange={() => {}}
                  collapsed={false}
                  onToggleCollapse={() =>
                    setSidebarCollapsed(!sidebarCollapsed)
                  }
                />
              </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex">
              <Sidebar
                activeTab="media"
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
                showFilters={true}
              />

              {/* Page Content */}
              <main className="flex-1 p-3 pb-[100px] sm:p-4 sm:pb-[100px] md:p-6 md:pb-[100px] overflow-auto">
                <NoListingSelected pageType="Media" />
              </main>
            </div>

            {/* <Toaster /> */}
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
                activeTab="media"
                onTabChange={() => {}}
                collapsed={false}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              />
            </SheetContent>
          </Sheet>

          {/* Desktop Sidebar */}
          <div className="hidden md:flex">
            <Sidebar
              activeTab="media"
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
              showFilters={true}
            />

            {/* Page Content */}
            <main className="flex-1 p-3 pb-[100px] sm:p-4 sm:pb-[100px] md:p-6 md:pb-[100px] overflow-auto">
              <Suspense fallback={<div>Loading Media...</div>}>
                <MediaErrorBoundary>
                  <Media />
                </MediaErrorBoundary>
              </Suspense>
            </main>
          </div>

          {/* <Toaster /> */}
        </div>
      </ThemeProvider>
    </Provider>
  );
};

export default MediaPage;
