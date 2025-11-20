import React from "react";
import { useProfile } from "@/hooks/useProfile";

interface MainBodyProps {
  children: React.ReactNode;
}

export const MainBody: React.FC<MainBodyProps> = ({ children }) => {
  const { profileData, isLoading } = useProfile();

  const shouldHideSubNavbar = () => {
    // Hide while loading to prevent layout shift
    if (isLoading) return true;

    const userRole = profileData?.role?.toLowerCase();
    return userRole === "staff" || userRole === "client";
  };

  return (
    <main
      className={`flex-1 min-h-[90vh] w-full bg-white ${
        shouldHideSubNavbar() ? "pt-16" : "pt-32 lg:pt-32 pb-[100px] md:pb-[100px]  lg:pb-[100px]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-6">{children}</div>
    </main>
  );
};
