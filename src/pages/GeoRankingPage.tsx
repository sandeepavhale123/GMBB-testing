import React, { Suspense, useState } from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { ThemeProvider } from "../components/ThemeProvider";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header/Header";
// import { GeoRankingPage as GeoRanking } from "../components/GeoRanking/GeoRankingPage";
import { Toaster } from "../components/ui/toaster";
import { Sheet, SheetContent } from "../components/ui/sheet";
import { NoListingSelected } from "../components/ui/no-listing-selected";
import { useListingContext } from "../context/ListingContext";

//  Lazy Import Utility
import { lazyImport } from "@/utils/lazyImport";
import { ListingLoader } from "@/components/ui/listing-loader";

// Lazy-loaded inner GeoRanking Page
const GeoRanking = lazyImport(() =>
  import("../components/GeoRanking/GeoRankingPage").then((m) => ({
    default: m.GeoRankingPage,
  }))
);
const GeoRankingPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { selectedListing, isInitialLoading } = useListingContext();

  const renderLayout = (children: React.ReactNode) => (
    <Provider store={store}>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 flex w-full">
          {/* Mobile Navigation Sheet */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar
                activeTab="geo-ranking"
                onTabChange={() => {}}
                collapsed={false}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              />
            </SheetContent>
          </Sheet>

          {/* Desktop Sidebar */}
          <div className="hidden md:flex">
            <Sidebar
              activeTab="geo-ranking"
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
          </div>

          {/* Page Content */}
          <main className="flex-1 p-3 pb-[100px] sm:p-4 sm:pb-[100px] md:p-6 md:pb-[100px] overflow-auto">
            {children}
          </main>
        </div>
      </ThemeProvider>
    </Provider>
  );
  // Show no listing selected state
  // if (!selectedListing && !isInitialLoading) {
  //   return (
  //     <Provider store={store}>
  //       <ThemeProvider>
  //         <div className="min-h-screen bg-gray-50 flex w-full">
  //           {/* Mobile Navigation Sheet */}
  //           <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
  //             <SheetContent side="left" className="p-0 w-64">
  //               <Sidebar
  //                 activeTab="geo-ranking"
  //                 onTabChange={() => {}}
  //                 collapsed={false}
  //                 onToggleCollapse={() =>
  //                   setSidebarCollapsed(!sidebarCollapsed)
  //                 }
  //               />
  //             </SheetContent>
  //           </Sheet>

  //           {/* Desktop Sidebar */}
  //           <div className="hidden md:flex">
  //             <Sidebar
  //               activeTab="geo-ranking"
  //               onTabChange={() => {}}
  //               collapsed={sidebarCollapsed}
  //               onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
  //             />
  //           </div>

  //           {/* Main Content */}
  //           <div
  //             className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
  //               sidebarCollapsed ? "md:ml-16" : "md:ml-64"
  //             }`}
  //           >
  //             {/* Header */}
  //             <Header
  //               onToggleSidebar={() => {
  //                 if (window.innerWidth < 768) {
  //                   setMobileMenuOpen(true);
  //                 } else {
  //                   setSidebarCollapsed(!sidebarCollapsed);
  //                 }
  //               }}
  //               showFilters={true}
  //             />

  //             {/* Page Content */}
  //             <main className="flex-1 p-3 pb-[100px] sm:p-4 sm:pb-[100px] md:p-6 md:pb-[100px] overflow-auto">
  //               <NoListingSelected pageType="GEO Ranking" />
  //             </main>
  //           </div>

  //           {/* <Toaster /> */}
  //         </div>
  //       </ThemeProvider>
  //     </Provider>
  //   );
  // }

  // return (
  //   <Provider store={store}>
  //     <ThemeProvider>
  //       <div className="min-h-screen bg-gray-50 flex w-full">
  //         {/* Mobile Navigation Sheet */}
  //         <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
  //           <SheetContent side="left" className="p-0 w-64">
  //             <Sidebar
  //               activeTab="geo-ranking"
  //               onTabChange={() => {}}
  //               collapsed={false}
  //               onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
  //             />
  //           </SheetContent>
  //         </Sheet>

  //         {/* Desktop Sidebar */}
  //         <div className="hidden md:flex">
  //           <Sidebar
  //             activeTab="geo-ranking"
  //             onTabChange={() => {}}
  //             collapsed={sidebarCollapsed}
  //             onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
  //           />
  //         </div>

  //         {/* Main Content */}
  //         <div
  //           className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
  //             sidebarCollapsed ? "md:ml-16" : "md:ml-64"
  //           }`}
  //         >
  //           {/* Header */}
  //           <Header
  //             onToggleSidebar={() => {
  //               if (window.innerWidth < 768) {
  //                 setMobileMenuOpen(true);
  //               } else {
  //                 setSidebarCollapsed(!sidebarCollapsed);
  //               }
  //             }}
  //             showFilters={true}
  //           />

  //           {/* Page Content */}
  //           <main className="flex-1 p-3 pb-[100px] sm:p-4 sm:pb-[100px] md:p-6 md:pb-[100px] overflow-auto">
  //             <GeoRanking />
  //           </main>
  //         </div>

  //         {/* <Toaster /> */}
  //       </div>
  //     </ThemeProvider>
  //   </Provider>
  // );

  if (!selectedListing && !isInitialLoading) {
    return renderLayout(<NoListingSelected pageType="GEO Ranking" />);
  }

  return renderLayout(
    <Suspense fallback={<ListingLoader isLoading={true} children={""} />}>
      <GeoRanking />
    </Suspense>
  );
};

export default GeoRankingPage;
