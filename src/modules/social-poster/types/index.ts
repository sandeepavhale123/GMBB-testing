// Core types for Social Poster Module

export type PlatformType = 
  | "facebook" 
  | "instagram" 
  | "twitter" 
  | "linkedin"
  | "linkedin_individual"
  | "linkedin_organisation"
  | "threads"
  | "pinterest" 
  | "youtube";

export type PostStatus = 
  | "draft" 
  | "scheduled" 
  | "publishing" 
  | "published" 
  | "failed";

export type AccountStatus = 
  | "healthy" 
  | "warning" 
  | "error" 
  | "disconnected";

export interface SocialAccount {
  id: string;
  platform: PlatformType;
  platformAccountId: string;
  accountName: string;
  username?: string;
  profilePicture?: string;
  followerCount?: number;
  status: AccountStatus;
  tokenExpiresAt?: string;
  connectedAt: string;
  lastRefreshedAt?: string;
  capabilities?: {
    canPost: boolean;
    canSchedule: boolean;
    canUploadMedia: boolean;
    maxMediaCount: number;
    maxCharacters?: number;
  };
}

export interface PlatformAccount {
  id: string;
  userId: string;
  platform: PlatformType;
  platformUserId: string;
  platformUsername: string;
  displayName: string;
  profilePicture?: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: string;
  status: AccountStatus;
  connectedAt: string;
  lastRefreshedAt?: string;
  pages?: SocialAccount[]; // For platforms like Facebook that have pages
}

export interface PostPlatformTarget {
  id: string;
  socialAccountId: string;
  platform: PlatformType;
  accountName: string;
  status: PostStatus;
  publishedUrl?: string;
  publishedAt?: string;
  platformPostId?: string;
  error?: string | null;
  scheduledFor?: string;
  retryCount?: string;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  media?: Array<{
    id: string;
    mediaUrl: string;
    mediaType: "image" | "video";
    thumbnailUrl?: string | null;
    displayOrder: string;
  }>;
  targets: PostPlatformTarget[];
  status: PostStatus;
  scheduledFor?: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  targetCounts?: {
    total: string;
    published: string;
    failed: string;
    pending: string;
  };
  platformOptions?: {
    [key in PlatformType]?: {
      asAdmin?: boolean;
      enableReplies?: boolean;
      postAsArticle?: boolean;
      [key: string]: any;
    };
  };
}

export interface PlatformStats {
  platform: PlatformType;
  connectedAccounts: number;
  totalScheduled: number;
  publishedToday: number;
  successRate: number;
  failedPosts: number;
  status: AccountStatus;
}

export interface DashboardStats {
  totalAccounts: number;
  totalPosts: number;
  scheduledPosts: number;
  successRate: number;
}

export interface PostingActivityPlatform {
  platform: string;
  display_name: string;
  posts: number;
  color: string;
}

export interface PostingActivityResponse {
  total_posts: number;
  change_percentage: number;
  platforms: PostingActivityPlatform[];
  time_range: string;
  start_date: string;
  end_date: string;
}

export interface PostActivityPeriod {
  period: string;
  start_date: string;
  end_date: string;
  posts: number;
}

export interface PostActivityResponse {
  total_posts: number;
  change_percentage: number;
  granularity: string;
  periods: PostActivityPeriod[];
  time_range: string;
  start_date: string;
  end_date: string;
}

export interface RefreshTokenRequest {
  platform_account_id: number;
  frontend_origin: string;
}

export interface RefreshTokenSuccessResponse {
  type: "success";
  http_code: number;
  message: string;
  data: {
    token_expires_at?: string;
    expires_in_days?: number;
    pages_synced?: number;
    instagram_synced?: number;
    pages_removed?: number;
    requires_reauthorization?: boolean;
    reauthorization_url?: string;
  };
}

export interface UpcomingPost {
  id: string;
  content: string;
  scheduledFor: string;
  platforms: PlatformType[];
  mediaUrls?: string[];
  targetCount: number;
}

// API Request/Response types

export interface GetPostsRequest {
  status?: PostStatus;
  platform?: PlatformType;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "scheduledFor" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface GetPostsResponse {
  code: number;
  message: string;
  data: {
    posts: Post[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface GetPostResponse {
  code: number;
  message: string;
  data: Post;
}

export interface DeletePostResponse {
  code: number;
  message: string;
  data: {
    id: string;
    deletedTargets: number;
    deletedMedia: number;
    deletedQueueItems: number;
  };
}

export interface CreatePostRequest {
  content: string;
  mediaIds?: string[];
  targetAccountIds: string[];
  scheduledFor?: string;
  platformOptions?: Post["platformOptions"];
}

export interface CreatePostResponse {
  code: number;
  message: string;
  data: {
    id: string;
    content: string;
    status: PostStatus;
    scheduledFor?: string;
    platformOptions?: Post["platformOptions"];
    media: Array<{
      id: string;
      mediaUrl: string;
      mediaType: "image" | "video";
      thumbnailUrl?: string;
      displayOrder: string;
    }>;
    targets: Array<{
      id: string;
      socialAccountId: string;
      platform: PlatformType;
      accountName: string;
      status: PostStatus;
      scheduledFor?: string;
    }>;
    targetCounts: {
      total: string;
      published: string;
      failed: string;
      pending: string;
    };
    createdAt: string;
    updatedAt: string;
  };
}

export interface GetAccountsResponse {
  code: number;
  message: string;
  data: {
    accounts: PlatformAccount[];
    meta: {
      total: number;
      platforms: Record<string, number>;
    };
  };
}

export interface AvailableAccount {
  id: string;
  platform: PlatformType;
  platformAccountId: string;
  platformAccountIdExternal: string;
  accountType: string;
  accountName: string;
  username?: string;
  profilePicture?: string;
  followerCount?: number;
  status: AccountStatus;
  connectedAt: string;
  capabilities: {
    canPost: boolean;
    canSchedule: boolean;
    canUploadMedia: boolean;
    maxMediaCount: number;
    maxCharacters?: number;
  };
  parentStatus: AccountStatus;
  parentName: string;
  tokenExpiresAt?: string;
}

export interface GetAvailableAccountsResponse {
  code: number;
  message: string;
  data: {
    accounts: AvailableAccount[];
    groupedByPlatform: Record<string, number>;
    meta: {
      total: number;
      platforms: number;
    };
  };
}

export interface UploadMediaResponse {
  code: number;
  message: string;
  data: {
    id: string;
    mediaUrl: string;
    thumbnailUrl?: string;
    mediaType: "image" | "video";
    fileSize: number;
    width?: number;
    height?: number;
    mimeType: string;
  };
}

export interface GetAccountsRequest {
  platform?: PlatformType;
  status?: AccountStatus;
}

export interface ConnectAccountRequest {
  platform: PlatformType;
  code?: string; // OAuth code
  state?: string; // OAuth state
}

export interface ConnectAccountResponse {
  account: PlatformAccount;
  message: string;
}

export interface UpdatePostRequest {
  content?: string;
  mediaIds?: string[];
  targetAccountIds?: string[];
  scheduledFor?: string;
  platformOptions?: Post["platformOptions"];
}

export interface RetryPostRequest {
  postId: string;
  targetIds?: string[]; // If not provided, retry all failed
}

export interface DisconnectAccountResponse {
  code: number;
  message: string;
  data: {
    accountId: string;
    platform: PlatformType;
    deletedSubAccounts: number;
  };
}

export type MediaItem = {
  id?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  preview: string;
  mediaType: "image" | "video";
  name?: string;
  fileSize?: number;
  mimeType?: string;
  width?: number;
  height?: number;
};

export interface GetDashboardStatsResponse {
  type: string;
  httpCode: number;
  message: string;
  data: DashboardStats;
}

export interface GetPostingActivityResponse {
  code: number;
  message: string;
  data: PostingActivityResponse;
}

export interface GetPostActivityResponse {
  code: number;
  message: string;
  data: PostActivityResponse;
}

// Channel-specific content for compose post tabs
export interface ChannelContent {
  platform: PlatformType | "draft";
  content: string;
  useCustomContent: boolean; // false = use draft content
}
