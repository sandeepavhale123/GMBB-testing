import React, { useState, useRef, useEffect } from "react";
import { Bell, ArrowRight ,Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/context/NotificationContext";
import { Sheet } from "@/components/ui/sheet";
import { NotificationDrawer } from "@/components/Notifications/NotificationDrawer";

export const NotificationsMegaMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  // const { openDrawer, unreadCount } = useNotifications();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Check if NotificationProvider is available
  let unreadCount = 0;
  let openDrawer = () => {};
  let closeDrawer = () => {};

  try {
    const notifications = useNotifications();
    unreadCount = notifications.unreadCount;
    openDrawer = notifications.openDrawer;
    closeDrawer = notifications.closeDrawer;
  } catch (error) {
    // NotificationProvider not available, use defaults
  }

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       menuRef.current &&
  //       buttonRef.current &&
  //       !menuRef.current.contains(event.target as Node) &&
  //       !buttonRef.current.contains(event.target as Node)
  //     ) {
  //       setIsOpen(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  // const handleViewAllFeatures = () => {
  //   setIsOpen(false);
  //   window.open(
  //     "https://docs.google.com/spreadsheets/d/19_eBpk-PvKqU9Q_vn83GfYLBZT3zsIM2IBJPU-uTdNQ/edit?gid=0#gid=0",
  //     "_blank"
  //   );
  // };

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        className="text-white hover:text-black relative"
        onClick={() => {
          setIsSheetOpen(true);
          openDrawer();
        }}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 ? (
           <div className="absolute -top-[-3px] -right-[-7px]  h-3 w-3  flex items-center justify-center text-[8px] font-bold text-white bg-destructive rounded-full">
            {unreadCount}
          </div>
        ) : (
          <div className="absolute -top-[-3px] -right-[-7px]  h-3 w-3  flex items-center justify-center text-[10px] font-bold text-white bg-destructive rounded-full">
             <div className="h-1 w-1 rounded-lg bg-white"></div>
          </div>
        )}
      </Button>

      {/* {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50"
        >
          <div className="p-4">
            <div className="mb-3">
              <h3 className="text-sm font-medium text-foreground mb-2">
                Feature List
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Explore the application's features – including what's already
                available, what's coming soon, and what's being deprecated.
              </p>
            </div>

            <Button
              onClick={handleViewAllFeatures}
              className="w-full justify-between bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <span>View All Features</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openDrawer}
              className="w-full justify-between bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Notifications
            </Button>
          </div>
        </div>
      )} */}
      {/* Drawer */}
      <Sheet
        open={isSheetOpen}
        onOpenChange={(open) => {
          setIsSheetOpen(open);
          if (!open) {
            // ✅ also reset context drawer + search
            closeDrawer();
          }
        }}
      >
        <NotificationDrawer />
      </Sheet>
    </div>
  );
};
