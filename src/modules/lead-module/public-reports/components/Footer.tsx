import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePublicI18n } from "@/hooks/usePublicI18n";

export const namespaces = ["Lead-module-public-report/footer"];

interface BrandingData {
  company_logo?: string;
  company_name?: string;
  company_website?: string;
  company_email?: string;
  company_phone?: string;
  company_address?: string;
}

interface FooterProps {
  brandingData?: BrandingData | null;
}

export const Footer: React.FC<FooterProps> = ({ brandingData }) => {
  const { t } = usePublicI18n(namespaces);
  const isMobile = useIsMobile();

  // Check if all fields are empty except logo
  const allEmptyExceptLogo = brandingData
    ? Object.entries(brandingData)
        .filter(([key]) => key !== "company_logo")
        .every(([_, value]) => value === "")
    : true;

  if (allEmptyExceptLogo) {
    return null;
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "#1e293b" }}
    >
      <div
        className={`container mx-auto ${
          isMobile ? "px-4 py-12" : "px-6 py-20"
        }`}
      >
        <div className="grid grid-cols-1 gap-12 items-center">
          {/* Company Branding Card */}
          <div className="text-white">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 flex justify-between flex-col gap-8 lg:flex-row lg:gap-6">
              <div
                className={`flex items-center flex-col gap-2 sm:flex-row sm:gap-0 ${
                  isMobile ? "space-x-4" : "space-x-4"
                }`}
              >
                {brandingData?.company_logo ? (
                  <img
                    src={brandingData.company_logo}
                    alt="Company Logo"
                    className="w-20 h-20 rounded-lg object-cover bg-white"
                  />
                ) : (
                  <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {brandingData?.company_name?.charAt(0) ||
                        t("defaultLogoFallback")}
                    </span>
                  </div>
                )}
                <div className={isMobile ? "text-center" : ""}>
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {brandingData?.company_name}
                  </h3>
                  <div className="text-white/90">
                    {brandingData?.company_website && (
                      <a
                        href={
                          brandingData.company_website.startsWith("http")
                            ? brandingData.company_website
                            : `https://${brandingData.company_website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white hover:underline transition-colors"
                      >
                        {brandingData.company_website}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`grid gap-2 text-sm grid-cols-1`}
                style={{ maxWidth: 600 }}
              >
                <div className="text-white/90">
                  <span className="text-white/70">{t("emailLabel")}: </span>
                  {brandingData?.company_email}
                </div>
                <div className="text-white/90">
                  <span className="text-white/70">{t("phoneLabel")}: </span>
                  {brandingData?.company_phone}
                </div>
                <div className="text-white/90 break-all">
                  <span className="text-white/70">{t("addressLabel")}: </span>
                  {brandingData?.company_address}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};
