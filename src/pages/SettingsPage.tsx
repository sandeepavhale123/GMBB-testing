<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { useParams, useLocation, Navigate } from "react-router-dom";
import { store } from "../store/store";
import { ThemeProvider } from "../components/ThemeProvider";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header/Header";
import { Toaster } from "../components/ui/toaster";
import { Sheet, SheetContent } from "../components/ui/sheet";
import { SettingsSubHeader } from "../components/Settings/SettingsSubHeader";
import { ManageGoogleAccountPage } from "../components/Settings/ManageGoogleAccountPage";
import { SubscriptionPage } from "../components/Settings/SubscriptionPage";
import { GenieSubscriptionPage } from "../components/Settings/GenieSubscriptionPage";
import { ListingManagementPage } from "../components/Settings/ListingManagementPage";
import { useListingContext } from "@/context/ListingContext";
=======

import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { useParams, useLocation, Navigate } from 'react-router-dom';
import { store } from '../store/store';
import { ThemeProvider } from '../components/ThemeProvider';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header/Header';
import { Toaster } from '../components/ui/toaster';
import { Sheet, SheetContent } from '../components/ui/sheet';
import { SettingsSubHeader } from '../components/Settings/SettingsSubHeader';
import { ManageGoogleAccountPage } from '../components/Settings/ManageGoogleAccountPage';
import { SubscriptionPage } from '../components/Settings/SubscriptionPage';

import { ListingManagementPage } from '../components/Settings/ListingManagementPage';
import { IntegrationsPage } from '../components/Settings/IntegrationsPage';

const SettingsPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    if (path.includes('/integrations')) {
      return 'integrations';
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
      case 'integrations':
        return <IntegrationsPage />;
      default:
        return <ManageGoogleAccountPage />;
    }
  };

  return (
    <Provider store={store}>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 flex w-full">
          {/* Mobile Navigation Sheet */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar
                activeTab="settings"
                onTabChange={() => {}}
                collapsed={false}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              />
            </SheetContent>
          </Sheet>

          {/* Desktop Sidebar */}
          <div className="hidden md:flex">
            <Sidebar
              activeTab="settings"
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

            {/* Settings Sub Header - Only show on main view */}
            {currentView === "main" && (
              <SettingsSubHeader activeTab={activeTab} />
            )}

            {/* Page Content */}
            <main className="flex-1 overflow-auto bg-gray-50">
              <div className="min-h-full">{renderTabContent()}</div>
            </main>
          </div>

          <Toaster />
        </div>
      </ThemeProvider>
    </Provider>
  );
};

export default SettingsPage;
