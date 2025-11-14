import { useState, useEffect } from "react";
import { postsApi, GetPostsRequest, ApiPost } from "../api/postsApi";

interface ScheduledPost {
  id: string;
  title: string;
  content: string;
  scheduledDate: string;
  image: string;
}

interface UseScheduledPostsReturn {
  scheduledPosts: ScheduledPost[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const formatScheduledDate = (dateString: string | null): string => {
  if (!dateString) return "Not scheduled";

  try {
    // Handle DD/MM/YYYY H:MM AM/PM format from API
    if (dateString.includes("/") && dateString.includes(" ")) {
      // Parse DD/MM/YYYY H:MM AM/PM format
      const [datePart, timePart] = dateString.split(" ");
      const [day, month, year] = datePart.split("/");

      // Convert to MM/DD/YYYY format for proper parsing
      const formattedDateString = `${month}/${day}/${year} ${timePart}`;
      const date = new Date(formattedDateString);

      if (!isNaN(date.getTime())) {
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      }
    }

    // Fallback to standard date parsing
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }

    return "Invalid date";
  } catch {
    return "Invalid date";
  }
};

const extractImageUrl = (mediaImages: string): string => {
  if (!mediaImages) return "/placeholder.svg";

  try {
    // Try to parse as JSON array first
    const parsed = JSON.parse(mediaImages);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed[0];
    }
    // If it's a single URL string
    return mediaImages;
  } catch {
    // If parsing fails, treat as direct URL
    return mediaImages || "/placeholder.svg";
  }
};

const transformApiPostToScheduledPost = (apiPost: ApiPost): ScheduledPost => {
  return {
    id: apiPost.id,
    title: apiPost.title || "Untitled Post",
    content: apiPost.content,
    scheduledDate: formatScheduledDate(apiPost.publishDate),
    image: extractImageUrl(apiPost.media?.images || ""),
  };
};

export const useScheduledPosts = (
  listingId: number | null,
  limit: number = 5
): UseScheduledPostsReturn => {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScheduledPosts = async () => {
    if (!listingId) {
      setScheduledPosts([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const request: GetPostsRequest = {
        listingId,
        filters: {
          status: "SCHEDULED",
          search: "",
          dateRange: {
            startDate: "",
            endDate: "",
          },
        },
        pagination: {
          page: 1,
          limit,
          total: 0,
          total_pages: 1,
          has_next: false,
          has_prev: false,
        },
        sorting: {
          sortBy: "postdate",
          sortOrder: "asc", // Show earliest scheduled posts first
        },
      };

      const response = await postsApi.getPosts(request);
      const transformedPosts = response.data.posts.map(
        transformApiPostToScheduledPost
      );
      setScheduledPosts(transformedPosts);
    } catch (err) {
      console.error("Failed to fetch scheduled posts:", err);
      setError("Failed to load scheduled posts");
      setScheduledPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduledPosts();
  }, [listingId]);

  return {
    scheduledPosts,
    loading,
    error,
    refetch: fetchScheduledPosts,
  };
};
