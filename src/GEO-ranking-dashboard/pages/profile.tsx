import React, { useState } from "react";
import { ProfileHeader } from "../../components/Profile/ProfileHeader";
import { EditProfileForm } from "../../components/Profile/EditProfileForm";
import { ChangePasswordModal } from "../../components/Profile/ChangePasswordModal";

export const Profile: React.FC = () => {
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
    <div className="max-w-6xl mx-auto space-y-6 py-10">
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

      {/* Change Password Modal */}
      {showPasswordModal && (
        <ChangePasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  );
};