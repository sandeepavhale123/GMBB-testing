import React, { useState, useEffect } from "react";
import { Outlet, useParams, useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { loadThemeFromAPI } from "@/store/slices/themeSlice";
import { getThemeUnauthenticated } from "@/hooks/useThemeLoader";
import { applyStoredTheme } from "@/utils/themeUtils";
import { useThemeLogo } from "@/hooks/useThemeLogo";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePerformanceBrandingReport } from "@/hooks/useReports";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export const PublicReportSharedLayout: React.FC = () => {
  const { token } = useParams();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // All hooks must be called before any conditional logic
  const { data: brandingData, isLoading } = usePerformanceBrandingReport(token);
  const { lightLogo } = useThemeLogo();
  const isMobile = useIsMobile();
  
  const branding = brandingData?.data || null;

  // Load theme once for all public reports
  useEffect(() => {
    const loadTheme = async () => {
      try {
        setThemeLoaded(false);
        
        const themeResponse = await getThemeUnauthenticated();

        if (themeResponse.code === 200) {
          dispatch(loadThemeFromAPI(themeResponse.data));
        } else if (themeResponse.code === 401) {
          console.warn("Theme API requires authentication for public report, using stored theme");
          applyStoredTheme();
        }
      } catch (error) {
        console.warn("Failed to load theme on public report page:", error);
        applyStoredTheme();
      } finally {
        setThemeLoaded(true);
      }
    };

    loadTheme();
  }, [dispatch]);

  // Check for stored dark mode preference
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(storedDarkMode);
    if (storedDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Show loading state while theme is being applied
  if (!themeLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const allSidebarItems = [
    { name: "health", label: "GMB Health Report", path: "health" },
    { name: "ranking", label: "Geo Ranking Report", path: "ranking" },
    { name: "review", label: "Reviews Report", path: "review" },
    { name: "insight", label: "Insights Report", path: "insight" },
    { name: "media", label: "Media Report", path: "media" },
    { name: "post", label: "Post Performance Report", path: "post" },
  ];

  // For now, show all sidebar items - this can be filtered based on visible sections later
  const sidebarItems = allSidebarItems;

  const getCurrentReportName = () => {
    const path = location.pathname;
    return sidebarItems.find((item) => path.includes(item.name))?.name || "";
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <div
          className={`
          ${isMobile ? "fixed inset-y-0 left-0 z-50" : "relative"}
          ${isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"}
          w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out
          flex flex-col
        `}
        >
          {/* Mobile close button */}
          {isMobile && (
            <div className="flex justify-end p-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${
                      getCurrentReportName() === item.name
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }
                  `}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-card border-b border-border p-4">
            <div className="flex items-center justify-between">
              {/* Mobile menu button */}
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="h-8 w-8 p-0 mr-4"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              )}

              {/* Header content */}
              <div className="flex items-center space-x-4 flex-1">
                {/* Business logo */}
                {branding?.companyLogo && (
                  <img
                    src={branding.companyLogo}
                    alt="Business Logo"
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                )}

                {/* Business info */}
                <div className="flex-1">
                  <h1 className="text-lg font-semibold">
                    {branding?.locationName || "Business Report"}
                  </h1>
                  {branding?.address && (
                    <p className="text-sm text-muted-foreground">
                      {branding.address}
                    </p>
                  )}
                </div>

                {/* Report date */}
                {branding?.reportDate && (
                  <div className="text-sm text-muted-foreground">
                    {new Date(branding.reportDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="bg-card border-t border-border p-4">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              {lightLogo && (
                <img
                  src={lightLogo}
                  alt="Company Logo"
                  className="h-8 object-contain"
                />
              )}
              <div className="text-sm text-muted-foreground">
                <p>Get Your Local Business Report</p>
                <p>Powered by Our Platform</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </TooltipProvider>
  );
};