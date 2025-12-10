import React, { useState, useRef, useEffect } from "react";
import {
  Grid3X3,
  TrendingUp,
  Users,
  Star,
  Search,
  Link as LinkIcon,
  Coins,
  Map,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { UtmTrackingBuilderModal } from "@/components/Utils/UtmTrackingBuilderModal";
import { BuyCreditsModal } from "@/components/credits_modal/BuyCreditsModal";
import { profileService } from "@/services/profileService";
import { useLocation, Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
export const ModulesMegaMenu: React.FC = () => {
  const { t } = useI18nNamespace("MultidashboardComponent/modulesMegaMenu");
  const modules = [
    {
      name: t("modules.geoRanking.name"),
      description: t("modules.geoRanking.description"),
      icon: TrendingUp,
      href: "/module/geo-ranking",
    },
    {
      name: t("modules.leadManagement.name"),
      description: t("modules.leadManagement.description"),
      icon: Users,
      href: "/module/lead",
    },
    {
      name: t("modules.seo.name"),
      description: t("modules.seo.description"),
      icon: Search,
      href: "/module/live-seo-fixer",
      beta: true,
    },
     {
      name: t("modules.socialPoster.name"),
      description: t("modules.socialPoster.description"),
      icon: Share2,
      href: "/social-poster",
    },
    // {
    //   name: t("modules.reputation.name"),
    //   description: t("modules.reputation.description"),
    //   icon: Star,
    //   href: "/module/reputation",
    //   beta: true,
    // },
    // {
    //   name: "Feedback & Review Generator",
    //   description: "Collect feedback and automatically generate positive reviews.", 
    //   icon: Star,
    //   href: "/module/reputation/v1/dashboard",
    //   // beta: true,
    // },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [dashboardType, setDashboardType] = useState<number | null>(null);
  const [isUtmModalOpen, setIsUtmModalOpen] = useState(false);
  const [isBuyCreditsModalOpen, setIsBuyCreditsModalOpen] = useState(false);
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

  // Hide mega menu for dashboardType 2 users
  if (dashboardType === 2) {
    return null;
  }

  const getFilteredModules = () => {
    const baseModules = modules.filter(
      (module) => module.name !== "Manage GMB listing"
    );

    // Only show GMB listing if dashboardType is 0 or 1
    if (dashboardType === 0 || dashboardType === 1) {
      const gmbModule = {
        name: t("modules.manageGmb.name"),
        description: t("modules.manageGmb.description"),
        icon: Grid3X3,
        href:
          dashboardType === 0 ? "/location-dashboard/id" : "/main-dashboard",
        comingSoon: false,
        beta: false,
      };
      return [gmbModule, ...baseModules];
    }
    return baseModules;
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        name="btn-mega-menu"
        className="text-white hover:text-black"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Grid3X3 className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div
          ref={menuRef}
          className={cn(
            "absolute top-full mt-2 bg-background border border-border rounded-lg shadow-lg z-[99999]",
            isMobile
              ? "left-1/2 transform -translate-x-1/2 -ml-10 w-80 max-w-[calc(100vw-2rem)]"
              : "right-0 w-[600px]"
          )}
        >
          <ScrollArea 
            className={cn(
              "w-full",
              isMobile && "h-[70vh] max-h-[70vh]"
            )}
          >
            <div
              className={cn("p-4 pr-3", isMobile && "p-3 pr-2")}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-foreground">
                  {t("title")}
                </h3>
              </div>
              <div
                className={cn(isMobile ? "space-y-2" : "grid grid-cols-2 gap-2")}
              >
                {getFilteredModules().map((module) => {
                const IconComponent = module.icon;
                const isActive = isModuleActive(module.href);
                return (
                  <Link
                    key={module.name}
                    to={module.href}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-md transition-colors group",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-primary hover:text-primary-foreground"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <div
                      className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center",
                        isActive
                          ? "bg-primary-foreground/20"
                          : "bg-primary/10 group-hover:bg-primary-foreground/20"
                      )}
                    >
                      <IconComponent
                        className={cn(
                          "w-4 h-4",
                          isActive
                            ? "text-primary-foreground"
                            : "text-primary group-hover:text-primary-foreground"
                        )}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{module.name}</div>
                        {'comingSoon' in module && module.comingSoon && (
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-900 border-0 text-[8px]"
                          >
                            {t("comingSoon")}
                          </Badge>
                        )}
                        {'beta' in module && module.beta && (
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white border-0 text-[8px]"
                          >
                            {t("beta")}
                          </Badge>
                        )}
                      </div>
                      <div
                        className={cn(
                          "text-xs mt-1",
                          isActive
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground group-hover:text-primary-foreground/80"
                        )}
                      >
                        {module.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <Separator className="my-3" />

            <div className="space-y-1">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">
                {t("utilities.title")}
              </h4>
              <div
                className={cn(
                  isMobile ? "space-y-1" : "grid grid-cols-2 gap-2"
                )}
              >
                <Link
                  to="/utility/map-creator"
                  onClick={() => setIsOpen(false)}
                  className="flex items-start gap-3 p-3 rounded-md transition-colors group hover:bg-primary hover:text-primary-foreground w-full"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center bg-primary/10 group-hover:bg-primary-foreground/20">
                    <Map className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="text-sm font-medium">
                      {t("utilities.mapCreator.name")}
                    </div>
                    <div className="text-xs mt-1 text-muted-foreground group-hover:text-primary-foreground/80">
                      {t("utilities.mapCreator.description")}
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() => {
                    setIsUtmModalOpen(true);
                    setIsOpen(false);
                  }}
                  className="flex items-start gap-3 p-3 rounded-md transition-colors group hover:bg-primary hover:text-primary-foreground w-full"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center bg-primary/10 group-hover:bg-primary-foreground/20">
                    <LinkIcon className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="text-sm font-medium">
                      {t("utilities.utmBuilder.name")}
                    </div>
                    <div className="text-xs mt-1 text-muted-foreground group-hover:text-primary-foreground/80">
                      {t("utilities.utmBuilder.description")}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsBuyCreditsModalOpen(true);
                    setIsOpen(false);
                  }}
                  className="flex items-start gap-3 p-3 rounded-md transition-colors group hover:bg-primary hover:text-primary-foreground w-full"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center bg-primary/10 group-hover:bg-primary-foreground/20">
                    <Coins className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="text-sm font-medium">
                      {t("utilities.buyCredits.name")}
                    </div>
                    <div className="text-xs mt-1 text-muted-foreground group-hover:text-primary-foreground/80">
                      {t("utilities.buyCredits.description")}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
          </ScrollArea>
        </div>
      )}

      <UtmTrackingBuilderModal
        isOpen={isUtmModalOpen}
        onClose={() => setIsUtmModalOpen(false)}
      />
      <BuyCreditsModal
        open={isBuyCreditsModalOpen}
        onOpenChange={setIsBuyCreditsModalOpen}
      />
    </div>
  );
};
