import React, { Suspense, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { ThemeProvider } from "../components/ThemeProvider";
// import { Sidebar } from "../components/Sidebar";
// import { Header } from "../components/Header/Header";
// import { AIChatbotContent } from "../components/AIChatbot/AIChatbotContent";
import { Toaster } from "../components/ui/toaster";
import { Sheet, SheetContent } from "../components/ui/sheet";

import { lazyImport } from "@/utils/lazyImport";

// Lazy-loaded components
const Sidebar = lazyImport(() =>
  import("../components/Sidebar").then((mod) => ({ default: mod.Sidebar }))
);
const Header = lazyImport(() =>
  import("../components/Header/Header").then((mod) => ({ default: mod.Header }))
);
const AIChatbotContent = lazyImport(() =>
  import("../components/AIChatbot/AIChatbotContent").then((mod) => ({
    default: mod.AIChatbotContent,
  }))
);

const AIChatbotPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { listingId } = useParams();
  const [searchParams] = useSearchParams();

  // Extract keyword information from URL parameters.
  const keyword = searchParams.get("keyword") || "";
  const keywordId = searchParams.get("keywordId") || "";

  return (
    <Provider store={store}>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 flex w-full">
          {/* Mobile Navigation Sheet */}
          <Suspense fallback={<div>Loading Sidebar...</div>}>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar
                  activeTab="ai-chatbot"
                  onTabChange={() => {}}
                  collapsed={false}
                  onToggleCollapse={() =>
                    setSidebarCollapsed(!sidebarCollapsed)
                  }
                />
              </SheetContent>
            </Sheet>
          </Suspense>

          {/* Desktop Sidebar */}
          <div className="hidden md:flex">
            <Suspense fallback={<div>Loading Sidebar...</div>}>
              <Sidebar
                activeTab="ai-chatbot"
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
            <Suspense fallback={<div>Loading Header...</div>}>
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
            </Suspense>

            {/* Page Content */}
            <main className="flex-1 p-3 pb-[100px] sm:p-4 sm:pb-[100px] md:p-6 md:pb-[100px] overflow-auto">
              <Suspense fallback={<div>Loading AI Chatbot...</div>}>
                <AIChatbotContent keyword={keyword} keywordId={keywordId} />
              </Suspense>
            </main>
          </div>

          {/* <Toaster /> */}
        </div>
      </ThemeProvider>
    </Provider>
  );
};

export default AIChatbotPage;
