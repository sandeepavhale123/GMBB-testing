import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  MapPin,
  FileText,
  Image,
  BarChart3,
  TrendingUp,
  Bot,
  MessageSquare,
  Building2,
  HelpCircle,
  FileBarChart,
  ExternalLink,
  ChevronRight,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useListingContext } from "@/context/ListingContext";
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedListing } = useListingContext();
  const { user, logout } = useAuthRedux();
  const { state } = useSidebar();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const menuItems = [
    {
      title: "Location Dashboard",
      icon: MapPin,
      url: "/location-dashboard",
      isActive: location.pathname.startsWith("/location-dashboard"),
    },
    {
      title: "Posts",
      icon: FileText,
      url: "/posts",
      isActive: location.pathname.startsWith("/posts"),
    },
    {
      title: "Media",
      icon: Image,
      url: "/media",
      isActive: location.pathname.startsWith("/media"),
    },
    {
      title: "Insights",
      icon: BarChart3,
      url: "/insights",
      isActive: location.pathname.startsWith("/insights"),
    },
    {
      title: "Tracking",
      icon: TrendingUp,
      hasSubmenu: true,
      submenu: [
        {
          title: "Geo Ranking",
          url: "/geo-ranking",
          isActive: location.pathname.startsWith("/geo-ranking"),
        },
        {
          title: "Keywords",
          url: "/keywords",
          isActive: location.pathname.startsWith("/keywords"),
        },
      ],
    },
    {
      title: "AI Chatbot",
      icon: Bot,
      url: "/ai-chatbot",
      isActive: location.pathname.startsWith("/ai-chatbot"),
    },
    {
      title: "Reviews",
      icon: MessageSquare,
      url: "/reviews",
      isActive: location.pathname.startsWith("/reviews"),
    },
    {
      title: "Business Info",
      icon: Building2,
      url: "/business-info",
      isActive: location.pathname.startsWith("/business-info"),
    },
    {
      title: "Q&A",
      icon: HelpCircle,
      url: "/qa",
      isActive: location.pathname.startsWith("/qa"),
    },
    {
      title: "Reports",
      icon: FileBarChart,
      url: "/reports",
      isActive: location.pathname.startsWith("/reports"),
    },
    {
      title: "Citation",
      icon: ExternalLink,
      url: "/citation",
      isActive: location.pathname.startsWith("/citation"),
    },
  ];

  // Auto-expand submenu if any of its items are active
  useEffect(() => {
    const trackingItem = menuItems.find(item => item.title === "Tracking");
    if (trackingItem?.submenu) {
      const hasActiveSubmenuItem = trackingItem.submenu.some(subItem => subItem.isActive);
      if (hasActiveSubmenuItem) {
        setOpenSubmenu("Tracking");
      }
    }
  }, [location.pathname]);

  const handleNavigation = (url: string) => {
    if (selectedListing) {
      navigate(`${url}/${selectedListing.id}`);
    } else {
      navigate(`${url}/default`);
    }
  };

  const handleSubmenuToggle = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getUserInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <MapPin className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">LocalSync</span>
            <span className="truncate text-xs">Business Management</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.hasSubmenu ? (
                    <Collapsible
                      open={openSubmenu === item.title}
                      onOpenChange={() => handleSubmenuToggle(item.title)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={item.submenu?.some(subItem => subItem.isActive)}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.submenu?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={subItem.isActive}
                              >
                                <button
                                  onClick={() => handleNavigation(subItem.url)}
                                  className="w-full"
                                >
                                  <span>{subItem.title}</span>
                                </button>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={item.isActive}
                      onClick={() => handleNavigation(item.url)}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="rounded-lg">
                      {getUserInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                  <ChevronRight className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={state === "collapsed" ? "right" : "bottom"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="rounded-lg">
                        {getUserInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.name}</span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
