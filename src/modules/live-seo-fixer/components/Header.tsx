import React from "react";
import { useAppSelector } from "@/hooks/useRedux";
import { HeaderModulesMegaMenu } from "@/components/Header/HeaderModulesMegaMenu";
import { HeaderNotificationsMegaMenu } from "@/components/Header/HeaderNotificationsMegaMenu";
import { UserProfileDropdown } from "@/components/Header/UserProfileDropdown";
import { Search } from "lucide-react";

export const Header: React.FC = () => {
  const theme = useAppSelector((state) => state.theme);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-border"
      style={{ backgroundColor: theme.bg_color || "hsl(var(--background))" }}
    >
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Search className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">SEO Fixer</h1>
        </div>

        <div className="flex items-center gap-2">
          <HeaderModulesMegaMenu />
          <HeaderNotificationsMegaMenu />
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
};
