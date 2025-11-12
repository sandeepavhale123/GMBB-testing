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
    <div className="min-h-screen bg-blue-100 flex flex-col justify-center items-center p-4">
      <main className="w-full max-w-2xl mx-auto flex flex-col items-center gap-4 py-[80px]">
        {children}
        {/* <p className="text-sm text-muted-foreground mt-8">Powered by My Agency</p> */}
      </main>
    </div>
  );
};
