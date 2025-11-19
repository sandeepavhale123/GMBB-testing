import React, { Suspense, useState } from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { ThemeProvider } from "../components/ThemeProvider";
// import { Sidebar } from "../components/Sidebar";
// import { Header } from "../components/Header/Header";
// import { PostsPage as Posts } from "../components/Posts/PostsPage";
import { Toaster } from "../components/ui/toaster";
import { Sheet, SheetContent } from "../components/ui/sheet";
// import { NoListingSelected } from "../components/ui/no-listing-selected";
import { useListingContext } from "../context/ListingContext";

// ----------------------
// LAZY LOADED COMPONENTS
// ----------------------
const Sidebar = React.lazy(() =>
  import("../components/Sidebar").then((m) => ({ default: m.Sidebar }))
);

const Header = React.lazy(() =>
  import("../components/Header/Header").then((m) => ({ default: m.Header }))
);

const Posts = React.lazy(() =>
  import("../components/Posts/PostsPage").then((m) => ({
    default: m.PostsPage,
  }))
);

const NoListingSelected = React.lazy(() =>
  import("../components/ui/no-listing-selected").then((m) => ({
    default: m.NoListingSelected,
  }))
);

const SheetModule = React.lazy(() =>
  import("../components/ui/sheet").then((m) => ({
    default: m.Sheet,
    SheetContent: m.SheetContent,
  }))
);

// --------------
// FALLBACK UI
// --------------
const LoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center p-6">
    <div className="text-gray-500">Loading...</div>
  </div>
);

const PostsPage = () => {
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
            <Suspense fallback={null}>
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetContent side="left" className="p-0 w-64">
                  <Sidebar
                    activeTab="posts"
                    onTabChange={() => {}}
                    collapsed={false}
                    onToggleCollapse={() =>
                      setSidebarCollapsed(!sidebarCollapsed)
                    }
                    onNavigate={() => setMobileMenuOpen(false)}
                  />
                </SheetContent>
              </Sheet>
            </Suspense>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex">
              <Suspense fallback={<LoadingFallback />}>
                <Sidebar
                  activeTab="posts"
                  onTabChange={() => {}}
                  collapsed={sidebarCollapsed}
                  onToggleCollapse={() =>
                    setSidebarCollapsed(!sidebarCollapsed)
                  }
                />
              </Suspense>
            </div>

            {/* Main Content */}
            <div
              className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
                sidebarCollapsed ? "md:ml-16" : "md:ml-64"
              }`}
            >
              {/* Header */}
              <Suspense fallback={<LoadingFallback />}>
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
              </Suspense>

              {/* Page Content */}
              <main className="flex-1 p-3 pb-[100px] sm:p-4 sm:pb-[100px] md:p-6 md:pb-[100px] overflow-auto">
                <NoListingSelected pageType="Posts" />
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
          <Suspense fallback={null}>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar
                  activeTab="posts"
                  onTabChange={() => {}}
                  collapsed={false}
                  onToggleCollapse={() =>
                    setSidebarCollapsed(!sidebarCollapsed)
                  }
                  onNavigate={() => setMobileMenuOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </Suspense>

          {/* Desktop Sidebar */}
          <div className="hidden md:flex">
            <Suspense fallback={<LoadingFallback />}>
              <Sidebar
                activeTab="posts"
                onTabChange={() => {}}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              />
            </Suspense>
          </div>

          {/* Main Content */}
          <div
            className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
              sidebarCollapsed ? "md:ml-16" : "md:ml-64"
            }`}
          >
            {/* Header */}
            <Suspense fallback={<LoadingFallback />}>
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
            </Suspense>

            {/* Page Content */}
            <main className="flex-1 p-3 pb-[100px] sm:p-4 sm:pb-[100px] md:p-6 md:pb-[100px] overflow-auto">
              <Suspense fallback={<LoadingFallback />}>
                <Posts />
              </Suspense>
            </main>
          </div>

          {/* <Toaster /> */}
        </div>
      </ThemeProvider>
    </Provider>
  );
};

export default PostsPage;
