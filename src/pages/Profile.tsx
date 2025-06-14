
import React, { useState } from 'react';
import { ProfileHeader } from '../components/Profile/ProfileHeader';
import { EditProfileForm } from '../components/Profile/EditProfileForm';
import { ChangePasswordModal } from '../components/Profile/ChangePasswordModal';

const Profile = () => {
  const [activeTab, setActiveTab] = useState<'edit' | 'password'>('edit');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleTabChange = (tab: 'edit' | 'password') => {
    if (tab === 'password') {
      setShowPasswordModal(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
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
