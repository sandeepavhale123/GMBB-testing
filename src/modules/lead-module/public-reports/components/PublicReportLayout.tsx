import React from "react";
import { TopHeader } from "./TopHeader";
import { Header } from "./Header";
import { MainBody } from "./MainBody";
import { Footer } from "./Footer";

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
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopHeader />
      
      <div className="flex-1 flex flex-col w-full">
        <Header
          title={title}
          listingName={listingName}
          address={address}
          logo={logo}
          date={date}
          compareDate={compareDate}
        />

        <MainBody>{children}</MainBody>

        <Footer brandingData={brandingData} />
      </div>
    </div>
  );
};