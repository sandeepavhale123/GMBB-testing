import React, { useState, useRef, useEffect } from "react";
import { Grid3X3, TrendingUp, Users, Star, Search, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { useListingContext } from "@/context/ListingContext";
import { useLocation, Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { UtmTrackingBuilderModal } from "@/components/Utils/UtmTrackingBuilderModal";
import { Separator } from "@/components/ui/separator";

export const HeaderModulesMegaMenu: React.FC = () => {
  const {
    t
  } = useI18nNamespace("Header/headerModulesMegaMenu");
  const [isOpen, setIsOpen] = useState(false);
  const [isUtmModalOpen, setIsUtmModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const isMobile = useIsMobile();
  const {
    profileData
  } = useProfile();
  const {
    selectedListing
  } = useListingContext();
  const baseModules = [{
    name: t("modulesMenu.geoRanking.name"),
    description: t("modulesMenu.geoRanking.description"),
    icon: TrendingUp,
    href: "/module/geo-ranking"
  }, {
    name: t("modulesMenu.leadManagement.name"),
    description: t("modulesMenu.leadManagement.description"),
    icon: Users,
    href: "/module/lead"
  }, {
    name: "SEO Fixer",
    description: "Automatically detect and fix SEO issues on websites",
    icon: Search,
    href: "/module/live-seo-fixer",
    beta: true
  }, {
    name: t("modulesMenu.reputation.name"),
    description: t("modulesMenu.reputation.description"),
    icon: Star,
    href: "#",
    comingSoon: true
  }];
  const isModuleActive = (moduleHref: string) => {
    return location.pathname.startsWith(moduleHref);
  };
  const getFilteredModules = () => {
    const dashboardType = profileData?.dashboardType;

    // Only show GMB listing if dashboardType is 0 or 1
    if (dashboardType === 0 || dashboardType === 1) {
      const isInSingleListingContext = selectedListing && location.pathname.includes("/");
      const gmbModule = {
        name: isInSingleListingContext ? t("modulesMenu.gmbListing.single.name") : t("modulesMenu.gmbListing.multiple.name"),
        description: isInSingleListingContext ? t("modulesMenu.gmbListing.single.description") : t("modulesMenu.gmbListing.multiple.description"),
        icon: Grid3X3,
        href: isInSingleListingContext && selectedListing ? `/location-dashboard/${selectedListing.id}` : "/main-dashboard",
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
      <Button ref={buttonRef} variant="ghost" size="sm" className="hover:bg-gray-100 p-2 shrink-0" onClick={() => setIsOpen(!isOpen)}>
        <Grid3X3 className="w-4 h-4 text-gray-600" />
      </Button>

      {isOpen && <div ref={menuRef} className={cn("absolute top-full mt-2 bg-background border border-border rounded-lg shadow-lg z-50", isMobile ? "left-1/2 transform -translate-x-1/2 -ml-10 w-80 max-w-[calc(100vw-2rem)]" : "right-0 w-80")}>
          <div className={cn("p-4", isMobile && "p-3")}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-foreground">
                {t("modulesMenu.title")}
              </h3>
            </div>
            <div className="space-y-2">
              {getFilteredModules().map(module => {
            const IconComponent = module.icon;
            const isActive = isModuleActive(module.href);
            return <Link key={module.name} to={module.href} className={cn("flex items-start gap-3 p-3 rounded-md transition-colors group", isActive ? "bg-primary text-primary-foreground" : "hover:bg-primary hover:text-primary-foreground")} onClick={() => setIsOpen(false)}>
                    <div className={cn("flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center", isActive ? "bg-primary-foreground/20" : "bg-primary/10 group-hover:bg-primary-foreground/20")}>
                      <IconComponent className={cn("w-4 h-4", isActive ? "text-primary-foreground" : "text-primary group-hover:text-primary-foreground")} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{module.name}</div>
                        {module.comingSoon && <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-900 border-0 text-[8px]">
                            {t("modulesMenu.comingSoon")}
                          </Badge>}
                        {module.beta && <Badge variant="secondary" className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white border-0 text-[8px]">
                            Beta
                          </Badge>}
                      </div>
                      <div className={cn("text-xs mt-1", isActive ? "text-primary-foreground/80" : "text-muted-foreground group-hover:text-primary-foreground/80")}>
                        {module.description}
                      </div>
                    </div>
                  </Link>;
          })}
            </div>

            <Separator className="my-3" />

            <div className="space-y-1">
              <h4 className="text-xs font-medium text-muted-foreground mb-2 px-3">
                {t("modulesMenu.utilities.title")}
              </h4>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsUtmModalOpen(true);
                }}
                className="w-full flex items-start gap-3 p-3 rounded-md transition-colors group hover:bg-secondary"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center bg-purple-100 group-hover:bg-purple-200">
                  <LinkIcon className="w-4 h-4 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <div className="text-sm font-medium text-foreground">
                    {t("modulesMenu.utilities.utmBuilder.name")}
                  </div>
                  <div className="text-xs mt-1 text-muted-foreground">
                    {t("modulesMenu.utilities.utmBuilder.description")}
                  </div>
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