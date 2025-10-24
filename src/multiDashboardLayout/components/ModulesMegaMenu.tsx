import React, { useState, useRef, useEffect } from "react";
import { Grid3X3, TrendingUp, Users, Star, Search, Link, Store, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { profileService } from "@/services/profileService";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { UtmTrackingBuilderModal } from "@/components/Utils/UtmTrackingBuilderModal";
import { Separator } from "@/components/ui/separator";

export const ModulesMegaMenu: React.FC = () => {
  const {
    t
  } = useI18nNamespace("MultidashboardComponent/modulesMegaMenu");
  const modules = [
  {
    name: t("modules.geoRanking.name"),
    icon: Globe,
    bgColor: "#E8F5E9",
    iconColor: "#388E3C",
    href: "/module/geo-ranking"
  }, {
    name: t("modules.leadManagement.name"),
    icon: Users,
    bgColor: "#E3F2FD",
    iconColor: "#1976D2",
    href: "/module/lead"
  }, {
    name: "SEO Fixer",
    icon: Search,
    bgColor: "#FFF9C4",
    iconColor: "#F57F17",
    href: "/module/live-seo-fixer",
    beta: true
  }, {
    name: t("modules.reputation.name"),
    icon: Star,
    bgColor: "#FFE0B2",
    iconColor: "#E65100",
    href: "#",
    comingSoon: true
  }];
  const [isOpen, setIsOpen] = useState(false);
  const [isUtmModalOpen, setIsUtmModalOpen] = useState(false);
  const [dashboardType, setDashboardType] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const isMobile = useIsMobile();
  const isModuleActive = (moduleHref: string) => {
    return location.pathname.startsWith(moduleHref);
  };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await profileService.getUserProfile();
        setDashboardType(profile.dashboardType);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    fetchProfile();
  }, []);
  const getFilteredModules = () => {
    const baseModules = modules.filter(module => module.name !== "Manage GMB listing");

    // Only show GMB listing if dashboardType is 0 or 1
    if (dashboardType === 0 || dashboardType === 1) {
      const gmbModule = {
        name: t("modules.manageGmb.name"),
        icon: Store,
        bgColor: "#E3F2FD",
        iconColor: "#1976D2",
        href: dashboardType === 0 ? "/location-dashboard/id" : "/main-dashboard",
        comingSoon: false,
        beta: false
      };
      return [gmbModule, ...baseModules];
    }
    return baseModules;
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && buttonRef.current && !menuRef.current.contains(event.target as Node) && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return <div className="relative">
      <Button ref={buttonRef} variant="ghost" size="icon" className="text-white hover:text-black" onClick={() => setIsOpen(!isOpen)}>
        <Grid3X3 className="w-4 h-4" />
      </Button>

      {isOpen && <div ref={menuRef} className={cn("absolute top-full mt-2 bg-background border border-border rounded-lg shadow-lg z-50", isMobile ? "left-1/2 transform -translate-x-1/2 -ml-10 w-80 max-w-[calc(100vw-2rem)]" : "right-0 w-[600px]")}>
          <div className={cn("p-4", isMobile && "p-3")}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-foreground">
                {t("title")}
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {getFilteredModules().map(module => {
            const IconComponent = module.icon;
            const isActive = isModuleActive(module.href);
            return <RouterLink 
                    key={module.name} 
                    to={module.href} 
                    className={cn(
                      "relative flex flex-col items-center p-4 rounded-lg border transition-colors group",
                      isActive 
                        ? "border-primary bg-primary/5" 
                        : "border-border bg-card hover:bg-accent hover:border-accent"
                    )} 
                    onClick={() => setIsOpen(false)}
                  >
                    <div 
                      className="w-16 h-16 rounded-lg flex items-center justify-center mb-3" 
                      style={{ backgroundColor: module.bgColor }}
                    >
                      <IconComponent 
                        className="w-8 h-8" 
                        style={{ color: module.iconColor }} 
                      />
                    </div>
                    <div className="text-sm font-medium text-center text-foreground">
                      {module.name}
                    </div>
                    {module.comingSoon && (
                      <Badge 
                        variant="secondary" 
                        className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-900 border-0 text-[8px] px-1.5 py-0.5"
                      >
                        {t("comingSoon")}
                      </Badge>
                    )}
                    {module.beta && (
                      <Badge 
                        variant="secondary" 
                        className="absolute top-2 right-2 bg-gradient-to-r from-blue-400 to-indigo-500 text-white border-0 text-[8px] px-1.5 py-0.5"
                      >
                        Beta
                      </Badge>
                    )}
                  </RouterLink>;
          })}
            </div>

            <Separator className="my-4" />

            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">
                {t("utilities.title")}
              </h4>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsUtmModalOpen(true);
                }}
                className="flex flex-col items-center p-4 rounded-lg border border-border bg-card hover:bg-accent hover:border-accent transition-colors group w-full"
              >
                <div 
                  className="w-16 h-16 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: "#F3E5F5" }}
                >
                  <Link className="w-8 h-8" style={{ color: "#7B1FA2" }} />
                </div>
                <div className="text-sm font-medium text-center text-foreground">
                  {t("utilities.utmBuilder.name")}
                </div>
              </button>
            </div>
          </div>
        </div>}

      <UtmTrackingBuilderModal 
        isOpen={isUtmModalOpen} 
        onClose={() => setIsUtmModalOpen(false)} 
      />
    </div>;
};