export interface Post {
  id: string;
  title: string;
  content: string;
  status: "published" | "draft" | "scheduled" | "failed";
  business: string;
  publishDate: string;
  engagement: {
    views: number;
    clicks: number;
    shares: number;
  };
  searchUrl?: string;
  media?: {
    images: string;
  };
  tags?: string;
  reason: string;
  // Additional fields from post dashboard API
  listingId?: string;
  listingName?: string;
  zipcode?: string;
  category?: string;
  storeCode?: string;
}

// Helper function to transform API post to frontend post
export const transformPostDashboardPost = (apiPost: any): Post => {
  return {
    id: apiPost.id,
    title: apiPost.title,
    content: apiPost.content,
    status: apiPost.status === "LIVE" ? "published" : apiPost.status.toLowerCase(),
    business: apiPost.listingName || "",
    publishDate: apiPost.publishDate,
    engagement: {
      views: 0,
      clicks: 0,
      shares: 0,
    },
    searchUrl: apiPost.searchUrl || "",
    media: apiPost.media,
    tags: apiPost.tags || "",
    reason: apiPost.reason || "",
    listingId: apiPost.listingId,
    listingName: apiPost.listingName,
    zipcode: apiPost.zipcode,
    category: apiPost.category,
  };
};
