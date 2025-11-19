import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/context/NotificationContext";
import { Sheet } from "@/components/ui/sheet";
import { NotificationDrawer } from "@/components/Notifications/NotificationDrawer";

export const HeaderNotificationsMegaMenu: React.FC = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { unreadCount, openDrawer, closeDrawer } = useNotifications();

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-gray-100 p-2 shrink-0 relative"
        onClick={() => {
          setIsSheetOpen(true);
          openDrawer();
        }}
      >
        <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 flex items-center justify-center text-[10px] font-bold text-white bg-destructive rounded-full">
            {unreadCount}
          </div>
        )}
      </Button>

      <Sheet
        open={isSheetOpen}
        onOpenChange={(open) => {
          setIsSheetOpen(open);
          if (!open) {
            closeDrawer();
          }
        }}
      >
        <NotificationDrawer />
      </Sheet>
    </div>
  );
};