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
}
