import React, { useEffect, useState } from "react";
import { Plus, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfileDropdown } from "@/components/Header/UserProfileDropdown";
import { ModulesMegaMenu } from "./ModulesMegaMenu";
import { NotificationsMegaMenu } from "./NotificationsMegaMenu";
import { useThemeLogo } from "@/hooks/useThemeLogo";
import { useAppSelector } from "@/hooks/useRedux";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { FaComments, FaQuestion } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";

declare global {
  interface Window {
    $crisp: any;
  }
}
export const Header: React.FC = () => {
  const logoData = useThemeLogo();
  const theme = useAppSelector((state) => state.theme);
  const navigate = useNavigate();
  const { profileData } = useProfile();

  const getBackToOldVersionUrl = () => {
    return profileData?.dashboardType === 2
      ? "https://old.gmbbriefcase.com/login"
      : "https://old.gmbbriefcase.com/login";
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  // const { profileData } = useProfile();
  const isAdmin = profileData?.role?.toLowerCase() === "admin";

  useEffect(() => {
    if (!isAdmin) return;
    // Handle new message from Crisp
    const onMessageReceived = () => {
      setUnreadCount((c) => c + 1);
    };

    // Handle chat opened (clear unread count)
    const onChatOpened = () => {
      setUnreadCount(0);
      window.$crisp?.push(["do", "message:read"]); // tell Crisp to clear unread
    };

    // Register events
    window.$crisp?.push(["on", "message:received", onMessageReceived]);
    window.$crisp?.push(["on", "chat:opened", onChatOpened]);

    // Initialize unread count when dashboard loads
    try {
      const initial = window.$crisp?.get?.("chat:unread:count") ?? 0;
      setUnreadCount(initial);
    } catch {
      // Crisp not ready yet
    }

    // Cleanup on unmount
    return () => {
      window.$crisp?.push(["off", "message:received", onMessageReceived]);
      window.$crisp?.push(["off", "chat:opened", onChatOpened]);
    };
  }, [isAdmin]);

  // Open Crisp chat
  const openChat = () => {
    if (!chatOpen) {
      window.$crisp?.push(["do", "chat:open"]);
      setChatOpen(true);
    }
  };

  // Close Crisp chat
  const closeChat = () => {
    if (chatOpen) {
      window.$crisp.push(["do", "chat:close"]);
      setChatOpen(false);
    }
  };

  const toggleMainFab = () => {
    if (open) {
      setOpen(false);
      closeChat();
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 w-full px-4 py-3 border-b border-border"
        style={{
          backgroundColor: theme.bg_color || "hsl(var(--background))",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Section - Logo */}
          <div className="flex items-center gap-3">
            <img src={logoData.darkLogo} alt="Logo" className="h-10 w-auto" />
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-foreground hover:bg-gray-50"
              onClick={() => (window.location.href = getBackToOldVersionUrl())}
            >
              <span className="hidden md:block ml-1">Back to old version </span>
              <ExternalLink className="w-4 h-4" />
            </Button>

            <ModulesMegaMenu />

            <NotificationsMegaMenu />

            <UserProfileDropdown />
          </div>
        </div>
      </header>
      {isAdmin && (
        <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-3 z-50">
          {/* Small action buttons */}
          {open && (
            <div className="flex flex-col items-end space-y-3 mb-2">
              <button
                onClick={openChat}
                className="bg-blue-600 relative text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
              >
                <FaComments size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[10px] leading-5 text-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() =>
                  window.open("https://support.gmbbriefcase.com/help-center")
                }
                className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700"
              >
                <BiSupport size={18} />
              </button>
            </div>
          )}

          <button
            onClick={toggleMainFab}
            className="relative bg-blue-600 text-white p-3 rounded-full shadow-xl hover:bg-blue-700 transition-transform transform hover:scale-110"
          >
            {open ? <X size={18} /> : <FaQuestion size={18} />}

            {open
              ? ""
              : unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[10px] leading-5 text-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
          </button>
        </div>
      )}
    </>
  );
};
