import React from "react";
import { MapPin } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  title: string;
  listingName: string;
  address: string;
  logo: string;
  date: string;
  compareDate?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  listingName,
  address,
  logo,
  date,
  compareDate,
}) => {
  const isMobile = useIsMobile();

  return (
    <header
      className={`text-white z-10 relative h-[350px] md:h-[300px] lg:h-[250px]`}
      style={{
        background: `linear-gradient(135deg, hsl(var(--primary-gradient-from)), hsl(var(--primary-gradient-via)), hsl(var(--primary-gradient-from) / 0.8))`,
      }}
    >
      
      {compareDate && (
        <div className="absolute right-1 top-2 bg-black rounded-2xl px-3 py-2">
          <p className={`text-white text-[10px]`}>{compareDate}</p>
        </div>
      )}

      {/* <h2
        className="text-xl sm:text-2xl lg:text-3xl font-bold text-white"
        style={{
          marginTop: isMobile ? "60px" : "40px",
          textAlign: "center",
        }}
      >
        {title}
      </h2> */}
      
      <div
        className={`container mx-auto flex items-center justify-between px-4 md:px-8 ${
          isMobile ? "flex-col space-y-4" : ""
        }`}
        style={{
          paddingTop: "20px",
          paddingBottom: "50px",
        }}
      >
        {/* Left: Business Branding */}
        <div className={`flex items-center space-x-4`}>
          {logo ? (
            <img
              src={logo}
              alt="Business Logo"
              className={`rounded-lg object-cover ${
                isMobile ? "w-12 h-12" : "w-16 h-16"
              }`}
            />
          ) : (
            <div
              className={`bg-white rounded-lg flex items-center justify-center ${
                isMobile ? "w-12 h-12" : "w-16 h-16"
              }`}
            >
              <MapPin
                className={`text-gray-900 ${
                  isMobile ? "w-6 h-6" : "w-8 h-8"
                }`}
              />
            </div>
          )}
          <div className={`flex flex-col ${isMobile ? "space-y-1" : ""}`}>
            <h1
              className={`font-bold text-white ${
                isMobile ? "text-base" : "text-2xl"
              }`}
            >
              {listingName}
            </h1>
            <p
              className={`text-white ${
                isMobile
                  ? "text-xs leading-tight max-w-[280px]"
                  : "text-sm"
              }`}
            >
              {address}
            </p>
          </div>
        </div>

        {/* Center: Report Title - Hidden on mobile as it's already in the header */}
        {!isMobile && <div className="flex-1 text-center"></div>}

        {/* Right: Report Date */}
        <div
          className={`${compareDate ? "min-w-56" : ""} ${
            isMobile ? "text-center" : "text-right"
          }`}
        >
          <p className="text-sm text-white">Report Date</p>
          <p
            className={`text-white min-w-max ${
              isMobile ? "text-base" : "text-lg"
            }`}
          >
            {date}
          </p>
        </div>
      </div>
    </header>
  );
};