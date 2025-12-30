import React from "react";
import { WelcomeSection } from "./WelcomeSection";
import { LoginForm } from "./LoginForm";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";
import { isAllowedDomain } from "@/lib/utils";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const LoginLayout = () => {
  const { t } = useI18nNamespace("Login/loginLayout");
  // Theme loading is now handled by ThemePreloader wrapper

  return (
    <div className="min-h-screen flex">
      <WelcomeSection />

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        {/* Back to old version button */}
        {isAllowedDomain() && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              (window.location.href = "https://old.gmbbriefcase.com/login")
            }
            className="absolute top-4 right-4 bg-white text-foreground border-2 hover:bg-gray-50 rounded-sm"
          >
            <span className="hidden md:block ml-1">
              {t("backToOldVersion")}{" "}
            </span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </Button>
        )}

        <LoginForm />
      </div>
    </div>
  );
};
