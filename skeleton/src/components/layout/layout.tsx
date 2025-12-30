// components/Layout.tsx
import React, { ReactNode, useState } from "react";
import { Sidebar } from "../Sidebar";
import { Header } from "../Header/Header";
import { Sheet, SheetContent } from "../ui/sheet";


interface LayoutProps {
  activeTab?: string; // sidebar active tab
  children: ReactNode;
  showFilters?: boolean; // show filters in header
}

export const Layout: React.FC<LayoutProps> = ({ activeTab = "overview", children, showFilters = false }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar
            activeTab={activeTab}
            onTabChange={() => {}}
            collapsed={false}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          activeTab={activeTab}
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
        <Header
          onToggleSidebar={() => {
            if (window.innerWidth < 768) {
              setMobileMenuOpen(true);
            } else {
              setSidebarCollapsed(!sidebarCollapsed);
            }
          }}
          showFilters={showFilters}
        />

        <main className="flex-1 p-3 pb-[100px] sm:p-4 sm:pb-[100px] md:p-6 md:pb-[100px] overflow-auto min-h-[100vh]">
          {children}
        </main>
      </div>
    </div>
  );
};
