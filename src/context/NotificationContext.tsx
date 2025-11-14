import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { getNotifications } from "@/api/notificationApi";
import { useAppSelector } from "@/hooks/useRedux";
import { shouldSkipProfileAPI } from "@/utils/routeUtils";

export interface Notification {
  id: string;
  title: string;
  category?: string;
  date: string;
  read?: boolean;
  textContent?: string; // plain HTML/text
  images?: { url: string; alt?: string }[];
  videos?: string[]; // iframe URLs or raw iframe HTML
  notificationUrl?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: (open: boolean) => void;
  markAsRead: (id: string) => void;
  unreadCount: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  loadNextPage: () => void;
  resetNotifications: () => void;
  isLoading: boolean;
  hasMore: boolean;
  fetchNotifications: (pageToLoad: number) => Promise<Notification[]>;
}

// const parseNotificationHTML = (html: string) => {
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(html, "text/html");

//   // Extract only text content
//   const paragraphs = Array.from(doc.querySelectorAll("p, h1, h2, h3, h4, h5"))
//     .map((el) => el.outerHTML)
//     .join("");

//   let textContent = paragraphs;

//   let firstImage: { url: string; alt?: string } | null = null;
//   let firstVideo: string | null = null;

//   // Walk through elements in DOM order
//   const walker = doc.body.querySelectorAll("img, iframe, a, video");

//   for (const el of walker) {
//     if (firstImage || firstVideo) break; // we already found first media

//     if (el.tagName.toLowerCase() === "img") {
//       firstImage = {
//         url: (el as HTMLImageElement).src,
//         alt: (el as HTMLImageElement).alt || "",
//       };
//       continue;
//     }

//     if (el.tagName.toLowerCase() === "iframe") {
//       const src = (el as HTMLIFrameElement).src;
//       if (src) {
//         firstVideo = `
//           <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
//             <iframe
//               src="${src}"
//               frameborder="0"
//               allow="autoplay; fullscreen"
//               allowfullscreen
//               style="position:absolute;top:0;left:0;width:100%;height:100%;">
//             </iframe>
//           </div>`;
//       }
//       continue;
//     }

//     if (el.tagName.toLowerCase() === "a") {
//       const href = (el as HTMLAnchorElement).href;

//       // Loom
//       const loomMatch = href.match(
//         /https:\/\/www\.loom\.com\/share\/([a-zA-Z0-9]+)/
//       );
//       if (loomMatch) {
//         const src = `https://www.loom.com/embed/${loomMatch[1]}`;
//         firstVideo = `
//           <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
//             <iframe
//               src="${src}"
//               frameborder="0"
//               allow="autoplay; fullscreen"
//               allowfullscreen
//               style="position:absolute;top:0;left:0;width:100%;height:100%;">
//             </iframe>
//           </div>`;
//         continue;
//       }

//       // YouTube full
//       const ytMatch = href.match(
//         /https:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/
//       );
//       if (ytMatch) {
//         const src = `https://www.youtube.com/embed/${ytMatch[1]}`;
//         firstVideo = `
//           <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
//             <iframe
//               src="${src}"
//               frameborder="0"
//               allow="autoplay; fullscreen"
//               allowfullscreen
//               style="position:absolute;top:0;left:0;width:100%;height:100%;">
//             </iframe>
//           </div>`;
//         continue;
//       }

//       // YouTube short
//       const ytShort = href.match(/https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/);
//       if (ytShort) {
//         const src = `https://www.youtube.com/embed/${ytShort[1]}`;
//         firstVideo = `
//           <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
//             <iframe
//               src="${src}"
//               frameborder="0"
//               allow="autoplay; fullscreen"
//               allowfullscreen
//               style="position:absolute;top:0;left:0;width:100%;height:100%;">
//             </iframe>
//           </div>`;
//         continue;
//       }

//       // Vimeo
//       const vimeoMatch = href.match(/https:\/\/(?:www\.)?vimeo\.com\/(\d+)/);
//       if (vimeoMatch) {
//         const src = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
//         firstVideo = `
//           <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
//             <iframe
//               src="${src}"
//               frameborder="0"
//               allow="autoplay; fullscreen"
//               allowfullscreen
//               style="position:absolute;top:0;left:0;width:100%;height:100%;">
//             </iframe>
//           </div>`;
//         continue;
//       }

//       // Normal link → keep in text
//       textContent += el.outerHTML;
//     }
//   }

//   return {
//     textContent,
//     images: firstImage ? [firstImage] : [],
//     videos: firstVideo ? [firstVideo] : [],
//   };
// };

const parseNotificationHTML = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // ✅ Step 1: Collect the first image BEFORE we strip it from text
  let firstImage: { url: string; alt?: string } | null = null;
  const imgEl = doc.querySelector("img");
  if (imgEl) {
    firstImage = {
      url: imgEl.getAttribute("src") || "",
      alt: imgEl.getAttribute("alt") || "",
    };
  }

  // ✅ Step 2: Remove <img> tags only when building textContent (not from the DOM for images[])
  const paragraphs = Array.from(doc.querySelectorAll("p, h1, h2, h3, h4, h5"))
    .map((el) => {
      const clone = el.cloneNode(true) as HTMLElement;

      // 1. Remove standalone <img>
      clone.querySelectorAll("img").forEach((img) => img.remove());

      // 2. Remove <a> that only wraps an <img>
      clone.querySelectorAll("a").forEach((a) => {
        if (
          a.children.length === 1 &&
          a.querySelector("img") &&
          !a.textContent?.trim()
        ) {
          a.remove();
        }
      });

      return clone.outerHTML;
    })
    .join("");

  let textContent = paragraphs;
  let firstVideo: string | null = null;

  // ✅ Step 3: Walk DOM for videos/links (images are already handled above)
  const walker = doc.body.querySelectorAll("iframe, a, video");
  for (const el of walker) {
    if (firstVideo) break;

    if (el.tagName.toLowerCase() === "iframe") {
      const src = (el as HTMLIFrameElement).src;
      if (src) {
        firstVideo = `
          <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
            <iframe 
              src="${src}" 
              frameborder="0" 
              allow="autoplay; fullscreen" 
              allowfullscreen
              style="position:absolute;top:0;left:0;width:100%;height:100%;">
            </iframe>
          </div>`;
      }
      continue;
    }

    if (el.tagName.toLowerCase() === "a") {
      const a = el as HTMLAnchorElement;
      // 🚫 Skip <a> tags that only contain <img>
      if (
        a.children.length === 1 &&
        a.querySelector("img") &&
        !a.textContent?.trim()
      ) {
        continue;
      }

      const href = a.href;

      // Loom
      const loomMatch = href.match(
        /https:\/\/www\.loom\.com\/share\/([a-zA-Z0-9]+)/
      );
      if (loomMatch) {
        const src = `https://www.loom.com/embed/${loomMatch[1]}`;
        firstVideo = `
          <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
            <iframe 
              src="${src}" 
              frameborder="0" 
              allow="autoplay; fullscreen" 
              allowfullscreen
              style="position:absolute;top:0;left:0;width:100%;height:100%;">
            </iframe>
          </div>`;
        continue;
      }

      // YouTube (full + short)
      const ytMatch = href.match(
        /https:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/
      );
      const ytShort = href.match(/https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/);
      if (ytMatch || ytShort) {
        const videoId = ytMatch ? ytMatch[1] : ytShort![1];
        const src = `https://www.youtube.com/embed/${videoId}`;
        firstVideo = `
          <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
            <iframe 
              src="${src}" 
              frameborder="0" 
              allow="autoplay; fullscreen" 
              allowfullscreen
              style="position:absolute;top:0;left:0;width:100%;height:100%;">
            </iframe>
          </div>`;
        continue;
      }

      // Vimeo
      const vimeoMatch = href.match(/https:\/\/(?:www\.)?vimeo\.com\/(\d+)/);
      if (vimeoMatch) {
        const src = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
        firstVideo = `
          <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
            <iframe 
              src="${src}" 
              frameborder="0" 
              allow="autoplay; fullscreen" 
              allowfullscreen
              style="position:absolute;top:0;left:0;width:100%;height:100%;">
            </iframe>
          </div>`;
        continue;
      }

      // Normal link → keep in text
      textContent += el.outerHTML;
    }
  }

  return {
    textContent,
    images: firstImage ? [firstImage] : [],
    videos: firstVideo ? [firstVideo] : [],
  };
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    console.warn(
      "useNotifications called outside of NotificationProvider; using no-op fallback."
    );
    const fallback: NotificationContextType = {
      notifications: [],
      isDrawerOpen: false,
      openDrawer: () => {},
      closeDrawer: () => {},
      toggleDrawer: () => {},
      markAsRead: () => {},
      unreadCount: 0,
      searchQuery: "",
      setSearchQuery: () => {},
      loadNextPage: () => {},
      resetNotifications: () => {},
      isLoading: false,
      hasMore: false,
      fetchNotifications: async () => [],
    };
    return fallback;
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  // Authentication state
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!accessToken && !!user;

  useEffect(() => {
    const fetchData = async () => {
      // Check if we're on a public route
      const isPublicRoute = shouldSkipProfileAPI();

      // Only fetch if user is authenticated AND not on a public route
      if (!isAuthenticated || isPublicRoute) {
        setNotifications([]);
        return;
      }

      try {
        const response = await getNotifications({ page: 1, limit: 10 });

        // Handle different possible response structures
        let notificationData = null;
        if (response?.data?.notification) {
          notificationData = response.data.notification;
        } else if (response?.data?.notifications) {
          notificationData = response.data.notifications;
        } else if (response?.data && Array.isArray(response.data)) {
          notificationData = response.data;
        } else if (response?.notification) {
          notificationData = response.notification;
        } else if (response?.notifications) {
          notificationData = response.notifications;
        } else if (Array.isArray(response)) {
          notificationData = response;
        }

        if (!Array.isArray(notificationData)) {
          // console.warn("⚠️ Notification data is not an array!", notificationData);
          setNotifications([]);
          return;
        }

        const mapped: Notification[] = notificationData.map((n: any) => {
          const { textContent, images, videos } = parseNotificationHTML(
            n.description || n.content || ""
          );

          return {
            id: n.id ?? n.title ?? Math.random().toString(),
            title: n.title || "Untitled",
            category: n.category,
            date: n.created_at || n.date || new Date().toISOString(),
            read: n.read ?? false,
            textContent,
            images,
            videos,
            notificationUrl: n.notificationUrl || n.url,
          };
        });

        setNotifications(mapped);
      } catch (err) {
        // console.error("❌ Failed to load notifications:", err);
        if (err && typeof err === "object" && "response" in err) {
          const axiosError = err as any;
          if (axiosError.response?.status === 401) {
            return;
          }
        }
        setNotifications([]);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const fetchNotifications = async (pageToLoad: number) => {
    // Check if we're on a public route
    const isPublicRoute = shouldSkipProfileAPI();

    if (isLoading || !isAuthenticated || isPublicRoute) return [];

    setIsLoading(true);
    try {
      const response = await getNotifications({ page: pageToLoad, limit });

      // Handle different possible response structures
      let notificationData = null;
      if (response?.data?.notification) {
        notificationData = response.data.notification;
      } else if (response?.data?.notifications) {
        notificationData = response.data.notifications;
      } else if (response?.data && Array.isArray(response.data)) {
        notificationData = response.data;
      } else if (response?.notification) {
        notificationData = response.notification;
      } else if (response?.notifications) {
        notificationData = response.notifications;
      } else if (Array.isArray(response)) {
        notificationData = response;
      }

      if (!Array.isArray(notificationData)) {
        // console.warn("⚠️ Notification data is not an array!", notificationData);
        return [];
      }

      const newNotifications = notificationData.map((n: any) => {
        const { textContent, images, videos } = parseNotificationHTML(
          n.description || n.content || ""
        );
        return {
          id: n.id ?? n.title ?? Math.random().toString(),
          title: n.title || "Untitled",
          category: n.category,
          date: n.created_at || n.date || new Date().toISOString(),
          read: n.read ?? false,
          textContent,
          images,
          videos,
          notificationUrl: n.notificationUrl || n.url,
        };
      });

      setNotifications((prev) =>
        pageToLoad === 1 ? newNotifications : [...prev, ...newNotifications]
      );
      if (newNotifications.length < limit) setHasMore(false);

      return newNotifications;
    } catch (err) {
      // console.error("❌ fetchNotifications failed:", err);
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as any;
        if (axiosError.response?.status === 401) {
          return [];
        }
      }
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const loadNextPage = async () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      await fetchNotifications(nextPage);
    }
  };

  const resetNotifications = () => {
    setNotifications([]);
    setPage(1);
    setHasMore(true);
  };

  // Fetch notifications when page changes
  useEffect(() => {
    fetchNotifications(page);
  }, [page]);

  const openDrawer = () => {
    setIsDrawerOpen(true);
    // resetNotifications();
    // setTimeout(() => fetchNotifications(1), 0);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSearchQuery(""); // just clear search input
  };
  const toggleDrawer = (open: boolean) => {
    setIsDrawerOpen(open);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.read).length
    : 0;

  const value = {
    notifications,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    markAsRead,
    unreadCount,
    searchQuery,
    setSearchQuery,
    loadNextPage,
    resetNotifications,
    isLoading,
    hasMore,
    fetchNotifications, // ✅ export it
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
