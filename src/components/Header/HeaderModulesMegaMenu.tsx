import React, { useState, useRef, useEffect } from "react";
import { Grid3X3, TrendingUp, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { useListingContext } from "@/context/ListingContext";
import { useLocation, Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const baseModules = [
  {
    name: "GEO Ranking",
    description: "Track and optimize your local search rankings",
    icon: TrendingUp,
    href: "/module/geo-ranking",
  },
  {
    name: "Lead Management",
    description: "Manage and track your leads effectively.",
    icon: Users,
    href: "/module/lead",
  },
  {
    name: "Reputation",
    description: "Monitor and manage your online reputation",
    icon: Star,
    href: "#",
    comingSoon: true,
  },
];

export const HeaderModulesMegaMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { profileData } = useProfile();
  const { selectedListing } = useListingContext();

  const isModuleActive = (moduleHref: string) => {
    return location.pathname.startsWith(moduleHref);
  };

  const getFilteredModules = () => {
    const dashboardType = profileData?.dashboardType;
    
    // Only show GMB listing if dashboardType is 0 or 1
    if (dashboardType === 0 || dashboardType === 1) {
      const isInSingleListingContext = selectedListing && location.pathname.includes('/')
      
      const gmbModule = {
        name: isInSingleListingContext ? "Manage GMB Listing" : "Main Dashboard",
        description: isInSingleListingContext 
          ? "Manage this location's Google My Business listing"
          : "Manage your Google My Business listings",
        icon: Grid3X3,
        href: isInSingleListingContext && selectedListing
          ? `/location-dashboard/${selectedListing.id}`
          : "/main-dashboard",
        comingSoon: false,
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
        size="sm"
        className="hover:bg-gray-100 p-2 shrink-0"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Grid3X3 className="w-4 h-4 text-gray-600" />
      </Button>

      {isOpen && (
        <div
          ref={menuRef}
          className={cn(
            "absolute top-full mt-2 bg-background border border-border rounded-lg shadow-lg z-50",
            isMobile 
              ? "left-1/2 transform -translate-x-1/2 -ml-10 w-80 max-w-[calc(100vw-2rem)]" 
              : "right-0 w-80"
          )}
        >
          <div className={cn("p-4", isMobile && "p-3")}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-foreground">Modules</h3>
            </div>
            <div className="space-y-2">
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
                    <div className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center",
                      isActive 
                        ? "bg-primary-foreground/20" 
                        : "bg-primary/10 group-hover:bg-primary-foreground/20"
                    )}>
                      <IconComponent className={cn(
                        "w-4 h-4",
                        isActive 
                          ? "text-primary-foreground" 
                          : "text-primary group-hover:text-primary-foreground"
                      )} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{module.name}</div>
                        {module.comingSoon && (
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-900 border-0 text-[8px]"
                          >
                            Coming Soon
                          </Badge>
                        )}
                      </div>
                      <div className={cn(
                        "text-xs mt-1",
                        isActive 
                          ? "text-primary-foreground/80" 
                          : "text-muted-foreground group-hover:text-primary-foreground/80"
                      )}>
                        {module.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};