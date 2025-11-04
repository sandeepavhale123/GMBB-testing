import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ModulesMegaMenu } from "@/multiDashboardLayout/components/ModulesMegaMenu";
import { NotificationsMegaMenu } from "@/multiDashboardLayout/components/NotificationsMegaMenu";
import { UserProfileDropdown } from "@/components/Header/UserProfileDropdown";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const MapCreatorHeader = () => {
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Left: Logo and Title */}
        <div className="flex items-center gap-4">
          <Link to="/main-dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">MC</span>
            </div>
            <span className="hidden md:inline-block font-semibold text-lg">
              Map Creator
            </span>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <ModulesMegaMenu />
            <NotificationsMegaMenu />
            <UserProfileDropdown className="rounded-sm text-slate-900 font-medium" />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-4 mt-8">
                  <LanguageSwitcher />
                  <ModulesMegaMenu />
                  <NotificationsMegaMenu />
                  <UserProfileDropdown className="rounded-sm text-slate-900 font-medium" />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
