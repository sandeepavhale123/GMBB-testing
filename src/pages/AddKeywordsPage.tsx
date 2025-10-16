import React from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { ThemeProvider } from "../components/ThemeProvider";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header/Header";
import { AddKeywordsPage as AddKeywords } from "../components/Keywords/AddKeywordsPage";
import { Toaster } from "../components/ui/toaster";
import { Sheet, SheetContent } from "../components/ui/sheet";
import { NoListingSelected } from "../components/ui/no-listing-selected";
import { useListingContext } from "../context/ListingContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { addSearchKeyword } from "../api/geoRankingApi";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

const AddKeywordsPage = () => {
  const { t } = useI18nNamespace("pages/addKeywordsPage");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAddingKeywords, setIsAddingKeywords] = useState(false);
  const { selectedListing, isInitialLoading } = useListingContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddKeywords = async (keywords: string[], settings: any) => {
    if (!selectedListing?.id) {
      toast({
        title: t("addKeywordsPage.toast.errorTitle"),
        description: t("addKeywordsPage.toast.noListing"),
        variant: "destructive",
      });
      return;
    }

    setIsAddingKeywords(true);
    try {
      const response = await addSearchKeyword({
        listingId: Number(selectedListing.id),
        keywords,
        language: settings.language,
        distanceValue: settings.distanceValue,
        gridSize: settings.gridSize,
      });

      if (response.code === 200) {
        toast({
          title: t("addKeywordsPage.toast.keywordsAddedTitle"),
          description:
            response.message ||
            t("addKeywordsPage.toast.keywordsAddedDescription", {
              count: keywords.length,
            }),
          // `Successfully added ${keywords.length} keyword(s) to queue.`,
        });

        // Navigate to keywords page
        navigate(`/keywords/${selectedListing.id}`);
      } else {
        throw new Error(
          response.message || t("addKeywordsPage.toast.keywordsAddFailed")
        );
      }
    } catch (error) {
      console.error("Error adding keywords:", error);
      toast({
        title: t("addKeywordsPage.toast.errorTitle"),
        description: error.response.data.message,
        variant: "destructive",
      });
    } finally {
      setIsAddingKeywords(false);
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
                  onToggleCollapse={() =>
                    setSidebarCollapsed(!sidebarCollapsed)
                  }
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
                showFilters={false}
              />

              {/* Page Content */}
              <main className="flex-1 p-3 pb-[100px] sm:p-4 sm:pb-[100px] md:p-6 md:pb-[100px] overflow-auto">
                <NoListingSelected pageType="Add Keywords" />
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
              showFilters={false}
            />

            {/* Page Content */}
            <main className="flex-1 overflow-auto">
              <AddKeywords
                onAddKeywords={handleAddKeywords}
                isLoading={isAddingKeywords}
              />
            </main>
          </div>
        </div>
        {/* <Toaster /> */}
      </ThemeProvider>
    </Provider>
  );
};

export default AddKeywordsPage;
