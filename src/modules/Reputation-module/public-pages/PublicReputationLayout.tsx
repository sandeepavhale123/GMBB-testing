import React from "react";
import { useAppSelector } from "@/hooks/useRedux";
import { useThemeLogo } from "@/hooks/useThemeLogo";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface PublicReputationLayoutProps {
  children: React.ReactNode;
}

export const PublicReputationLayout: React.FC<PublicReputationLayoutProps> = ({ children }) => {
  const { t } = useI18nNamespace("MultidashboardPages/publicMultiDashboardLayout");
  const theme = useAppSelector((state) => state.theme);
  const logoData = useThemeLogo();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header
        className="w-full px-4 py-3 border-b border-border"
        style={{
          backgroundColor: theme.bg_color || "hsl(var(--background))",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img
            src={logoData.darkLogo}
            alt={t("alt.logo")}
            className="h-10 w-auto"
          />
          <div className="flex gap-4 items-center">
            <LanguageSwitcher />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoginClick}
            >
              {t("header.login")}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          {/* Footer content */}
        </div>
      </footer>
    </div>
  );
};
