import React, { useEffect, useMemo, useRef, useState } from "react";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, LogIn } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useNotifications } from "@/context/NotificationContext";
import { NotificationCard } from "./NotificationCard";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/hooks/useRedux";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const NotificationDrawer: React.FC = () => {
  const {
    notifications,
    isDrawerOpen,
    searchQuery,
    setSearchQuery,
    isLoading,
    hasMore,
    loadNextPage,
    resetNotifications,
    fetchNotifications,
  } = useNotifications();

  const { t } = useI18nNamespace("Notifications/notificationDrawer");
  const [showSearch, setShowSearch] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [newIds, setNewIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  // Authentication state
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!accessToken && !!user;
  
  // CLOSE drawer → hide search & clear query
  useEffect(() => {
    if (!isDrawerOpen) {
      setShowSearch(false);
      setSearchQuery("");
    }
  }, [isDrawerOpen, setSearchQuery]);

  // Turn HTML into plain text for searching
  const stripHtml = (html?: string): string => {
    if (!html) return "";
    // Use DOMParser when available for better fidelity
    if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      return (doc.body.textContent || "").trim();
    }
    // Fallback (SSR or weird environments)
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const normalize = (s: string) => s.toLowerCase();

  const filteredNotifications = useMemo(() => {
    const q = normalize(searchQuery.trim());
    if (!q) return notifications;

    return notifications.filter((n) => {
      const title = n.title ?? "";
      const category = n.category ?? "";
      const date = n.date ?? "";
      const htmlText = n.textContent ?? "";

      const searchable = `${title} ${category} ${date} ${stripHtml(
        htmlText
      )}`.toLowerCase();

      return searchable.includes(q);
    });
  }, [notifications, searchQuery]);

  const toggleSearch = () => {
    setShowSearch((prev) => {
      if (prev && searchQuery === "") {
        // only clear search if input is empty
        setSearchQuery("");
      }
      return !prev;
    });
  };

  const handleScroll = () => {
    if (!containerRef.current || isLoading || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 100) loadNextPage();
  };

  const SkeletonCard = () => (
    <div className="border rounded-lg p-4 space-y-2 animate-pulse bg-gray-100">
      <div className="flex justify-between">
        <div className="h-4 w-24 bg-gray-300 rounded"></div>
        <div className="h-4 w-12 bg-gray-300 rounded"></div>
      </div>
      <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
      <div className="h-4 w-full bg-gray-200 rounded"></div>
      <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
      <div className="h-24 bg-gray-300 rounded"></div>
    </div>
  );

  return (
    <SheetContent
      side="right"
      className={`flex flex-col w-full sm:w-[400px] p-0 ${
        pathname.startsWith("/module/geo-ranking") ? "z-[500]" : "z-[52]"
      }`}
    >
      <SheetHeader className="border-b border-border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <SheetTitle className="text-lg font-semibold">
            {t("title")}
          </SheetTitle>
          {isAuthenticated && (
            <div className="flex items-center gap-2 relative top-[-7px] right-5">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSearch}
                className={cn(
                  "h-8 w-8 p-0",
                  showSearch && "bg-accent text-accent-foreground"
                )}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {showSearch && isAuthenticated && (
          <div className="animate-fade-in">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="h-9 text-sm"
              autoFocus
            />
          </div>
        )}
      </SheetHeader>

      <div
        className={cn(
          "flex-1 overflow-y-auto p-4 space-y-4",
          isModalOpen && "pointer-events-none"
        )}
        ref={containerRef}
        onScroll={handleScroll}
        style={{ overflow: isModalOpen ? "hidden" : "auto" }}
      >
        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center h-32 text-center space-y-3">
            <LogIn className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground font-medium">
                Login Required
              </p>
              <p className="text-sm text-muted-foreground">
                Please log in to view your notifications
              </p>
            </div>
          </div>
        ) : filteredNotifications.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <p className="text-muted-foreground">
              {searchQuery ? t("noSearchResults") : t("noNotifications")}
            </p>
          </div>
        ) : (
          <>
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "transition-all duration-700",
                  newIds.includes(notification.id)
                    ? "opacity-0 translate-y-4 animate-fade-in-up"
                    : "opacity-100 translate-y-0"
                )}
              >
                <NotificationCard
                  notification={notification}
                  onModalOpen={() => setIsModalOpen(true)}
                  onModalClose={() => setIsModalOpen(false)}
                />
              </div>
            ))}

            {isLoading &&
              Array.from({ length: 3 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
          </>
        )}
      </div>
    </SheetContent>
  );
};
