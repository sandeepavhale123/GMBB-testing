import React, { useState } from "react";
import { ProfileHeader } from "../components/Profile/ProfileHeader";
import { EditProfileForm } from "../components/Profile/EditProfileForm";
import { ChangePasswordModal } from "../components/Profile/ChangePasswordModal";
import { CurrentPlanCard } from "../components/Profile/CurrentPlanCard";

const Profile = () => {
  const [activeTab, setActiveTab] = useState<"edit" | "password">("edit");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleTabChange = (tab: "edit" | "password") => {
    if (tab === "password") {
      setShowPasswordModal(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Title and Subtext */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage your account information, security settings, and subscription preferences.
          </p>
        </div>

        {/* Profile Header Card */}
        <ProfileHeader
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Current Plan Card */}
        <CurrentPlanCard />

        {/* Edit Profile Form */}
        <EditProfileForm />
      </div>

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default Profile;