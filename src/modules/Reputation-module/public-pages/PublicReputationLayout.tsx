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
    <div className="min-h-screen flex flex-col bg-background grid grid-cols-1  lg:grid-cols-2 p-4 h-[100vh]">
      <div className="bg-dark-100  rounded-md max-h-100 flex items-center hidden lg:block " style={{background:"linear-gradient(to bottom right, #6313f5, #7d15c3)"}}>
       <img src="/lovable-uploads/bg-img/review-illustration.png" className="mx-auto" alt="" style={{width:"90%"}} />
      </div>
      <main className="flex-1 p-4 flex justify-center items-center h-100">
        <div className="w-[80%] mx-auto border-0 ">{children}</div>
      </main>
    </div>
  );
};
