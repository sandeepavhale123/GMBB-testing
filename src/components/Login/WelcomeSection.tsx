import React from "react";
import { useThemeLogo } from "@/hooks/useThemeLogo";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const WelcomeSection = () => {
  const { lightLogo } = useThemeLogo();
  const { t } = useI18nNamespace("Login/welcomeSection");
  return (
    <div
      className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom right, hsl(var(--primary-gradient-from)), hsl(var(--primary-gradient-via)), hsl(262 83% 58%))",
      }}
    >
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-lg backdrop-blur-sm"></div>
      <div className="absolute top-40 right-32 w-24 h-24 bg-white/10 rounded-full backdrop-blur-sm"></div>
      <div className="absolute bottom-32 left-32 w-20 h-20 bg-white/10 rounded backdrop-blur-sm"></div>
      <div className="absolute bottom-20 right-20 w-16 h-16 bg-white/10 rounded-lg backdrop-blur-sm"></div>

      {/* Logo */}
      <div className="absolute top-8 left-8">
        <div className="bg-white rounded-lg flex items-center justify-center shadow-lg p-2">
          <img
            src={lightLogo}
            alt="GMB Briefcase Logo"
            style={{
              maxHeight: "60px",
              height: "auto",
              width: "auto",
              maxWidth: "130px",
            }}
          />
        </div>
      </div>

      {/* Welcome Text */}
      <div className="flex flex-col justify-center items-center px-16 z-10">
        <img
          style={{
            height: "auto",
            width: "90%",
            maxWidth: "250px",
            marginBottom: "30px",
          }}
          src="/lovable-uploads/1925fff2-0bb1-4c0c-a281-a1a23bc5622b.png"
        />
        <h1 className="text-4xl font-bold text-white mb-4 text-center">
          {t("welcomeSection.heading")}
        </h1>
        <p className="text-md text-blue-100 text-center">
          {t("welcomeSection.description")}
        </p>
      </div>
    </div>
  );
};
