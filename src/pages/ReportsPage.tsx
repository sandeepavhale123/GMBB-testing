import React, { useEffect, useState, Suspense } from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { ThemeProvider } from "../components/ThemeProvider";
import { NoListingSelected } from "../components/ui/no-listing-selected";
import { useListingContext } from "../context/ListingContext";
import { useParams } from "react-router-dom";
const ReportsComponent = React.lazy(() => import("../components/Reports/ReportsPage"));
import { Layout } from "@/components/layout/layout";

const ReportsPage = () => {
  const { listingId } = useParams();
  const {
    listings,
    selectedListing,
    isInitialLoading,
    initializeSelectedListing,
  } = useListingContext();

  // Initialize selected listing if route has listingId
  useEffect(() => {
    if (listingId && listings.length > 0 && !selectedListing) {
      initializeSelectedListing(listingId);
    }
  }, [listingId, listings, selectedListing, initializeSelectedListing]);



  return (
    <Provider store={store}>
      <ThemeProvider>
        <Layout activeTab="reports">
          {!selectedListing && !isInitialLoading ? (
            <NoListingSelected pageType="Reports" />
          ) : (
            <Suspense fallback={<div>Loading Insights...</div>}>
              <ReportsComponent />
            </Suspense>
          )}
        </Layout>
      </ThemeProvider>
    </Provider>
  );
};

export default ReportsPage;
