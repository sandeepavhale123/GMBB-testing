import React, { lazy, Suspense, useMemo, useState } from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { ThemeProvider } from "../components/ThemeProvider";
// import { Sidebar } from "../components/Sidebar";
// import { Header } from "../components/Header/Header";
// import { ReviewsManagementPage } from "../components/Reviews/ReviewsManagementPage";
// import { ReviewsSubHeader } from "../components/Reviews/ReviewsSubHeader";
import { Toaster } from "../components/ui/toaster";
import { Sheet, SheetContent } from "../components/ui/sheet";
// import { NoListingSelected } from "../components/ui/no-listing-selected";
import { useListingContext } from "../context/ListingContext";

// 🔥 Lazy-loaded components
const Sidebar = lazy(() => import("../components/Sidebar"));
const Header = lazy(() => import("../components/Header/Header"));
const ReviewsManagementPage = lazy(
  () => import("../components/Reviews/ReviewsManagementPage")
);
const ReviewsSubHeader = lazy(
  () => import("../components/Reviews/ReviewsSubHeader")
);
const NoListingSelected = lazy(
  () => import("../components/ui/no-listing-selected")
);

const ReviewsPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { selectedListing, isInitialLoading } = useListingContext();

  // 🔥 useMemo for sidebar props
  const sidebarProps = useMemo(
    () => ({
      activeTab: "reviews",
      onTabChange: () => {},
      collapsed: sidebarCollapsed,
      onToggleCollapse: () => setSidebarCollapsed((prev) => !prev),
    }),
    [sidebarCollapsed]
  );

  // Show no listing selected state
  if (!selectedListing && !isInitialLoading) {
    return (
      <Provider store={store}>
        <ThemeProvider>
          <Suspense fallback={<div className="p-4">Loading...</div>}>
            <div className="min-h-screen bg-gray-50 flex w-full">
              {/* Mobile Navigation Sheet */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetContent side="left" className="p-0 w-64">
                  <Sidebar
                    activeTab="reviews"
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
                  activeTab="reviews"
                  onTabChange={() => {}}
                  collapsed={sidebarCollapsed}
                  onToggleCollapse={() =>
                    setSidebarCollapsed(!sidebarCollapsed)
                  }
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
                  <NoListingSelected pageType="Reviews" />
                </main>
              </div>

              {/* <Toaster /> */}
            </div>
          </Suspense>
        </ThemeProvider>
      </Provider>
    );
  }
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <div className="min-h-screen bg-gray-50 flex w-full">
            {/* Mobile Navigation Sheet */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar
                  activeTab="reviews"
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
                activeTab="reviews"
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
              <main className="flex-1 p-0 sm:p-4 md:p-6 overflow-auto">
                <ReviewsManagementPage />
              </main>
            </div>

            {/* <Toaster /> */}
          </div>
        </Suspense>
      </ThemeProvider>
    </Provider>
  );
};
export default ReviewsPage;
