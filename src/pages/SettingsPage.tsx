import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { useParams, useLocation, Navigate } from "react-router-dom";
import { store } from "../store/store";
import { SettingsSubHeader } from "../components/Settings/SettingsSubHeader";
import { ManageGoogleAccountPage } from "../components/Settings/ManageGoogleAccountPage";
import { SubscriptionPage } from "../components/Settings/SubscriptionPage";
import { GenieSubscriptionPage } from "../components/Settings/GenieSubscriptionPage";
import { ListingManagementPage } from "../components/Settings/ListingManagementPage";
import { IntegrationsPage } from "../components/Settings/IntegrationsPage";
import { useListingContext } from "@/context/ListingContext";

const SettingsPage = () => {
  const { accountId } = useParams();
  const location = useLocation();
  const { listingId } = useParams();
  const { listings, selectedListing, initializeSelectedListing } =
    useListingContext();

  // Initialize selected listing if route has listingId
  useEffect(() => {
    if (listingId && listings.length > 0 && !selectedListing) {
      console.log(
        "📍 SettingsPage: Triggering initializeSelectedListing for listingId:",
        listingId
      );
      initializeSelectedListing(listingId);
    }
  }, [listingId, listings, selectedListing, initializeSelectedListing]);

  // Determine current view from route
  const getCurrentView = () => {
    const path = location.pathname;
    if (path.includes("/listings/")) {
      return "listings";
    }
    return "main";
  };

  // Get active tab from route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("/subscription")) {
      return "subscription";
    }
    if (path.includes("/integrations")) {
      return "integrations";
    }
    if (path.includes("/google-account")) {
      return "google-account";
    }
    return "google-account"; // default
  };

  // Redirect base /settings to /settings/google-account
  if (location.pathname === "/settings") {
    return <Navigate to="/settings/google-account" replace />;
  }

  const currentView = getCurrentView();
  const activeTab = getActiveTab();

  const renderTabContent = () => {
    if (currentView === "listings" && accountId) {
      return <ListingManagementPage accountId={accountId} />;
    }

    switch (activeTab) {
      case "google-account":
        return <ManageGoogleAccountPage />;
      case "subscription":
        return <SubscriptionPage />;
      case "integrations":
        return <IntegrationsPage />;
      default:
        return <ManageGoogleAccountPage />;
    }
  };

  return (
    <Provider store={store}>
      <div>
        {/* Settings Sub Header - Only show on main view */}
        {currentView === "main" && (
          <SettingsSubHeader activeTab={activeTab} />
        )}

        {/* Page Content */}
        <div className="bg-gray-50 min-h-full">
          {renderTabContent()}
        </div>
      </div>
    </Provider>
  );
};

export default SettingsPage;