import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from "./Header";
import { MainBody } from "./MainBody";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";

interface PublicReportLayoutProps {
  children: React.ReactNode;
  title: string;
  listingName: string;
  address: string;
  logo: string;
  date: string;
  compareDate?: string;
  brandingData?: {
    company_logo?: string;
    company_name?: string;
    company_website?: string;
    company_email?: string;
    company_phone?: string;
    company_address?: string;
  } | null;
}

export const PublicReportLayout: React.FC<PublicReportLayoutProps> = ({
  children,
  title,
  listingName,
  address,
  logo,
  date,
  compareDate,
  brandingData,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-white flex relative">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        brandingData={brandingData}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 w-svw ${
          isMobile ? "ml-0" : "ml-16 sm:ml-16 lg:ml-24"
        }`}
      >
        <Header
          title={title}
          listingName={listingName}
          address={address}
          logo={logo}
          date={date}
          compareDate={compareDate}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <MainBody>{children}</MainBody>

        <Footer brandingData={brandingData} />
      </div>
    </div>
  );
};