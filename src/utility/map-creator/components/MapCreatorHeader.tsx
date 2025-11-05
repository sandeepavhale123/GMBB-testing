import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ModulesMegaMenu } from "@/multiDashboardLayout/components/ModulesMegaMenu";
import { NotificationsMegaMenu } from "@/multiDashboardLayout/components/NotificationsMegaMenu";
import { UserProfileDropdown } from "@/components/Header/UserProfileDropdown";
import { useAppSelector } from "@/hooks/useRedux";
import { useThemeLogo } from "@/hooks/useThemeLogo";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const MapCreatorHeader = () => {
  const { t } = useI18nNamespace("utility/mapCreator");
  const theme = useAppSelector((state) => state.theme);
  const logoData = useThemeLogo();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[50] w-full px-4 py-3 border-b border-border"
      style={{ backgroundColor: theme.bg_color || "hsl(var(--background))" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left section - Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img
              src={logoData.darkLogo}
              alt="Company Logo"
              className="h-8 w-auto object-contain"
            />
            <div className="border-l border-border/30 pl-3 hidden md:block">
              <h1 className="text-md font-semibold text-white mb-0 p-0">
                {t("mapCreator.title")}
              </h1>
              {/* <p className="text-sm text-white mt-0 p-0">
                {t("mapCreator.subtitle")}
              </p> */}
            </div>
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center space-x-3">
          <LanguageSwitcher />
          <ModulesMegaMenu />
          <NotificationsMegaMenu />
          <UserProfileDropdown className="rounded-sm text-slate-900 font-medium" />
        </div>
      </div>
    </header>
  );
};
