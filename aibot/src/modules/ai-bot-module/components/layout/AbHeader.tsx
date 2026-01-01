import React, { useState } from "react";
import { useAppSelector } from "@/hooks/useRedux";
import { useThemeLogo } from "@/hooks/useThemeLogo";
import { NotificationsMegaMenu } from "@/multiDashboardLayout/components/NotificationsMegaMenu";
import { UserProfileDropdown } from "@/components/Header/UserProfileDropdown";
import { ModulesMegaMenu } from "@/multiDashboardLayout/components/ModulesMegaMenu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AbWorkspaceSwitcher } from "../workspace/AbWorkspaceSwitcher";
import { AbCreateWorkspaceDialog } from "../workspace/AbCreateWorkspaceDialog";

export const AbHeader: React.FC = () => {
  const theme = useAppSelector((state) => state.theme);
  const logoData = useThemeLogo();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[50] w-full px-4 py-3 border-b border-border"
        style={{ backgroundColor: theme.bg_color || "hsl(var(--background))" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left section - Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img src={logoData.darkLogo} alt="Company Logo" className="h-8 w-auto object-contain" />
              <div className="border-l border-border/30 pl-3 hidden md:block">
                <h1 className="text-md text-white font-semibold text-foreground mb-0 p-0">AI Bot Builder</h1>
                <p className="text-sm text-muted-foreground mt-0 p-0">Create and manage AI chatbots</p>
              </div>
            </div>
          </div>

          {/* Right section - Actions */}
          <div className="flex items-center space-x-3">
            <AbWorkspaceSwitcher onCreateClick={() => setCreateDialogOpen(true)} />
            <LanguageSwitcher />
            <ModulesMegaMenu />
            <NotificationsMegaMenu />
            <UserProfileDropdown className="rounded-sm text-slate-900 font-medium" />
          </div>
        </div>
      </header>

      <AbCreateWorkspaceDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </>
  );
};
