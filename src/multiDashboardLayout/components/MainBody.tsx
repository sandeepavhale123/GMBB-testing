
import React from 'react';
import { useProfile } from '@/hooks/useProfile';

interface MainBodyProps {
  children: React.ReactNode;
}

export const MainBody: React.FC<MainBodyProps> = ({
  children
}) => {
  const { profileData } = useProfile();
  
  const shouldHideSubNavbar = () => {
    const userRole = profileData?.role?.toLowerCase();
    return userRole === 'staff' || userRole === 'client';
  };

  return (
    <main className={`flex-1 min-h-[90vh] w-full bg-white ${shouldHideSubNavbar() ? 'pt-16' : 'pt-32'}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </div>
    </main>
  );
};
