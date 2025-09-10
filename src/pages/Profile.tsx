import React, { useEffect, useState } from "react";
import { ThemeProvider } from "../components/ThemeProvider";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header/Header";
import { ProfileHeader } from "../components/Profile/ProfileHeader";
import { EditProfileForm } from "../components/Profile/EditProfileForm";
import { ChangePasswordModal } from "../components/Profile/ChangePasswordModal";
import { Sheet, SheetContent } from "../components/ui/sheet";
import { useListingContext } from "@/context/ListingContext";
import { useParams } from "react-router-dom";

const Profile = () => {
  const [activeTab, setActiveTab] = useState<"edit" | "password">("edit");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { listingId } = useParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { listings, selectedListing, initializeSelectedListing } =
    useListingContext();

  useEffect(() => {
    if (listingId && listings.length > 0 && !selectedListing) {
      // console.log(
      //   "📍 SettingsPage: Triggering initializeSelectedListing for listingId:",
      //   listingId
      // );
      initializeSelectedListing(listingId);
    }
  }, [listingId, listings, selectedListing, initializeSelectedListing]);

  const handleTabChange = (tab: "edit" | "password") => {
    if (tab === "password") {
      setShowPasswordModal(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        {/* Mobile Navigation Sheet */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar
              activeTab="overview"
              onTabChange={() => {}}
              collapsed={false}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <Sidebar
            activeTab="overview"
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
          <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Page Title and Subtext */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Profile Settings
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Manage your account information, security settings, and
                  subscription preferences.
                </p>
              </div>

              {/* Profile Header Card */}
              <ProfileHeader
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />

              {/* Edit Profile Form */}
              <EditProfileForm />
            </div>
          </main>
        </div>

        {showPasswordModal && (
          <ChangePasswordModal
            isOpen={showPasswordModal}
            onClose={() => setShowPasswordModal(false)}
          />
        )}

        
      </div>
    </ThemeProvider>
  );
};

export default Profile;
