import React, { useState , Suspense} from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { ThemeProvider } from "../components/ThemeProvider";
import ReportsComponent from "../components/Reports/ReportsPage";
import { Toaster } from "../components/ui/toaster";
import { Sheet, SheetContent } from "../components/ui/sheet";
import { NoListingSelected } from "../components/ui/no-listing-selected";
import { useListingContext } from "../context/ListingContext";

import { Layout } from "@/components/layout/layout";
const Reports = React.lazy(()=>import('@/multiDashboardLayout/pages/Reports'))
const BulkReportPage = () => {
  // const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { selectedListing, isInitialLoading } = useListingContext();

  return (
    <Provider store={store}>
      <ThemeProvider>
        <Layout activeTab="reports">
          {/* Show no listing selected */}
          {!selectedListing && !isInitialLoading ? (
            <NoListingSelected pageType="Reports" />
          ) : (
            <Suspense fallback={<div>Loading...</div>}>
              <Reports isSingleListingDashboard={true} />
            </Suspense>
          )}
        </Layout>
      </ThemeProvider>
    </Provider>
  );
};

export default BulkReportPage;
