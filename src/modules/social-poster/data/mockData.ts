import {
  PlatformAccount,
  Post,
  DashboardStats,
  PlatformStats,
  UpcomingPost,
  SocialAccount,
} from "../types";

// Mock Platform Accounts
export const mockPlatformAccounts: PlatformAccount[] = [
  {
    id: "acc-1",
    userId: "user-1",
    platform: "facebook",
    platformUserId: "fb-12345",
    platformUsername: "john.doe",
    displayName: "John Doe",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    accessToken: "fb_token_xxx",
    refreshToken: "fb_refresh_xxx",
    tokenExpiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    status: "healthy",
    connectedAt: "2024-01-15T10:00:00Z",
    lastRefreshedAt: "2024-01-20T14:30:00Z",
    pages: [
      {
        id: "page-1",
        platform: "facebook",
        platformAccountId: "fb-page-1",
        accountName: "Company Page A",
        username: "companypagea",
        profilePicture: "https://api.dicebear.com/7.x/initials/svg?seed=CPA",
        followerCount: 12000,
        status: "healthy",
        connectedAt: "2024-01-15T10:00:00Z",
        capabilities: {
          canPost: true,
          canSchedule: true,
          canUploadMedia: true,
          maxMediaCount: 10,
        },
      },
      {
        id: "page-2",
        platform: "facebook",
        platformAccountId: "fb-page-2",
        accountName: "Personal Brand",
        username: "personalbrand",
        profilePicture: "https://api.dicebear.com/7.x/initials/svg?seed=PB",
        followerCount: 5000,
        status: "healthy",
        connectedAt: "2024-01-15T10:00:00Z",
        capabilities: {
          canPost: true,
          canSchedule: true,
          canUploadMedia: true,
          maxMediaCount: 10,
        },
      },
      {
        id: "page-3",
        platform: "facebook",
        platformAccountId: "fb-page-3",
        accountName: "Product Page",
        username: "productpage",
        profilePicture: "https://api.dicebear.com/7.x/initials/svg?seed=PP",
        followerCount: 8000,
        status: "healthy",
        connectedAt: "2024-01-15T10:00:00Z",
        capabilities: {
          canPost: true,
          canSchedule: true,
          canUploadMedia: true,
          maxMediaCount: 10,
        },
      },
    ],
  },
  {
    id: "acc-2",
    userId: "user-1",
    platform: "instagram",
    platformUserId: "ig-67890",
    platformUsername: "business_account",
    displayName: "Business Account",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Business",
    accessToken: "ig_token_xxx",
    tokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "warning",
    connectedAt: "2024-01-18T12:00:00Z",
    lastRefreshedAt: "2024-01-22T09:15:00Z",
    pages: [
      {
        id: "ig-page-1",
        platform: "instagram",
        platformAccountId: "ig-biz-1",
        accountName: "Business Account",
        username: "@business_account",
        profilePicture: "https://api.dicebear.com/7.x/initials/svg?seed=BA",
        followerCount: 25000,
        status: "warning",
        connectedAt: "2024-01-18T12:00:00Z",
        capabilities: {
          canPost: true,
          canSchedule: true,
          canUploadMedia: true,
          maxMediaCount: 10,
          maxCharacters: 2200,
        },
      },
    ],
  },
  {
    id: "acc-3",
    userId: "user-1",
    platform: "twitter",
    platformUserId: "tw-11111",
    platformUsername: "company_twitter",
    displayName: "Company Twitter",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Company",
    accessToken: "tw_token_xxx",
    status: "healthy",
    connectedAt: "2024-01-20T15:00:00Z",
    pages: [
      {
        id: "tw-page-1",
        platform: "twitter",
        platformAccountId: "tw-11111",
        accountName: "Company Twitter",
        username: "@company_twitter",
        profilePicture: "https://api.dicebear.com/7.x/initials/svg?seed=CT",
        followerCount: 8500,
        status: "healthy",
        connectedAt: "2024-01-20T15:00:00Z",
        capabilities: {
          canPost: true,
          canSchedule: true,
          canUploadMedia: true,
          maxMediaCount: 4,
          maxCharacters: 280,
        },
      },
    ],
  },
  {
    id: "acc-4",
    userId: "user-1",
    platform: "linkedin_individual",
    platformUserId: "li-22222",
    platformUsername: "john-doe",
    displayName: "John Doe",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=JohnLinkedIn",
    accessToken: "li_token_xxx",
    status: "healthy",
    connectedAt: "2024-01-22T10:00:00Z",
    pages: [
      {
        id: "li-page-1",
        platform: "linkedin_individual",
        platformAccountId: "li-22222",
        accountName: "John Doe",
        username: "john-doe",
        profilePicture: "https://api.dicebear.com/7.x/initials/svg?seed=JD",
        followerCount: 3200,
        status: "healthy",
        connectedAt: "2024-01-22T10:00:00Z",
        capabilities: {
          canPost: true,
          canSchedule: true,
          canUploadMedia: true,
          maxMediaCount: 9,
          maxCharacters: 3000,
        },
      },
    ],
  },
  {
    id: "acc-5",
    userId: "user-1",
    platform: "linkedin_organisation",
    platformUserId: "li-33333",
    platformUsername: "company-corp",
    displayName: "Company Corp",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=CompanyCorp",
    accessToken: "li_token_org_xxx",
    status: "healthy",
    connectedAt: "2024-01-23T11:00:00Z",
    pages: [
      {
        id: "li-org-page-1",
        platform: "linkedin_organisation",
        platformAccountId: "li-33333",
        accountName: "Company Corp",
        username: "company-corp",
        profilePicture: "https://api.dicebear.com/7.x/initials/svg?seed=CC",
        followerCount: 15000,
        status: "healthy",
        connectedAt: "2024-01-23T11:00:00Z",
        capabilities: {
          canPost: true,
          canSchedule: true,
          canUploadMedia: true,
          maxMediaCount: 9,
          maxCharacters: 3000,
        },
      },
    ],
  },
  {
    id: "acc-6",
    userId: "user-1",
    platform: "threads",
    platformUserId: "th-44444",
    platformUsername: "companythreads",
    displayName: "Company Threads",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Threads",
    accessToken: "th_token_xxx",
    tokenExpiresAt: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000).toISOString(), // 55 days (60-day expiry)
    status: "healthy",
    connectedAt: "2024-01-24T14:00:00Z",
    lastRefreshedAt: "2024-01-25T10:00:00Z",
    pages: [
      {
        id: "th-page-1",
        platform: "threads",
        platformAccountId: "th-44444",
        accountName: "Company Threads",
        username: "@companythreads",
        profilePicture: "https://api.dicebear.com/7.x/initials/svg?seed=TH",
        followerCount: 6500,
        status: "healthy",
        connectedAt: "2024-01-24T14:00:00Z",
        capabilities: {
          canPost: true,
          canSchedule: true,
          canUploadMedia: true,
          maxMediaCount: 10,
          maxCharacters: 500,
        },
      },
    ],
  },
];

// Mock Posts
export const mockPosts: Post[] = [
  {
    id: "post-1",
    userId: "user-1",
    content: "🚀 Excited to announce our new product launch! Check out the amazing features we've been working on. #ProductLaunch #Innovation",
    media: [
      {
        id: "1",
        mediaUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600",
        mediaType: "image",
        thumbnailUrl: null,
        displayOrder: "0"
      }
    ],
    targets: [
      {
        id: "target-1",
        socialAccountId: "page-1",
        platform: "facebook",
        accountName: "Company Page A",
        status: "published",
        publishedUrl: "https://facebook.com/posts/123",
        publishedAt: "2024-01-24T15:00:00Z",
        scheduledFor: "2024-01-24T15:00:00Z",
      },
      {
        id: "target-2",
        socialAccountId: "page-2",
        platform: "facebook",
        accountName: "Personal Brand",
        status: "published",
        publishedUrl: "https://facebook.com/posts/124",
        publishedAt: "2024-01-24T15:00:05Z",
        scheduledFor: "2024-01-24T15:00:00Z",
      },
      {
        id: "target-3",
        socialAccountId: "ig-page-1",
        platform: "instagram",
        accountName: "Business Account",
        status: "published",
        publishedUrl: "https://instagram.com/p/abc123",
        publishedAt: "2024-01-24T15:00:10Z",
        scheduledFor: "2024-01-24T15:00:00Z",
      },
      {
        id: "target-4",
        socialAccountId: "tw-page-1",
        platform: "twitter",
        accountName: "Company Twitter",
        status: "published",
        publishedUrl: "https://twitter.com/posts/xyz",
        publishedAt: "2024-01-24T15:00:15Z",
        scheduledFor: "2024-01-24T15:00:00Z",
      },
      {
        id: "target-5",
        socialAccountId: "li-page-1",
        platform: "linkedin_individual",
        accountName: "John Doe",
        status: "published",
        publishedUrl: "https://linkedin.com/posts/def456",
        publishedAt: "2024-01-24T15:00:20Z",
        scheduledFor: "2024-01-24T15:00:00Z",
      },
    ],
    status: "published",
    scheduledFor: "2024-01-24T15:00:00Z",
    createdAt: "2024-01-23T10:00:00Z",
    updatedAt: "2024-01-24T15:00:20Z",
    publishedAt: undefined,
    targetCounts: {
      total: "5",
      published: "5",
      failed: "0",
      pending: "0"
    },
  },
  {
    id: "post-2",
    userId: "user-1",
    content: "Join us for our upcoming webinar on digital marketing strategies! Limited seats available. Register now! 🎯 #Marketing #Webinar",
    media: [
      {
        id: "2",
        mediaUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600",
        mediaType: "image",
        thumbnailUrl: null,
        displayOrder: "0"
      }
    ],
    targets: [
      {
        id: "target-6",
        socialAccountId: "page-1",
        platform: "facebook",
        accountName: "Company Page A",
        status: "publishing",
        scheduledFor: "2024-01-25T14:00:00Z",
      },
      {
        id: "target-7",
        socialAccountId: "page-3",
        platform: "facebook",
        accountName: "Product Page",
        status: "publishing",
        scheduledFor: "2024-01-25T14:00:00Z",
      },
      {
        id: "target-8",
        socialAccountId: "ig-page-1",
        platform: "instagram",
        accountName: "Business Account",
        status: "scheduled",
        scheduledFor: "2024-01-25T14:00:00Z",
      },
      {
        id: "target-9",
        socialAccountId: "tw-page-1",
        platform: "twitter",
        accountName: "Company Twitter",
        status: "scheduled",
        scheduledFor: "2024-01-25T14:00:00Z",
      },
      {
        id: "target-10",
        socialAccountId: "li-page-1",
        platform: "linkedin_individual",
        accountName: "John Doe",
        status: "scheduled",
        scheduledFor: "2024-01-25T14:00:00Z",
      },
    ],
    status: "publishing",
    scheduledFor: "2024-01-25T14:00:00Z",
    createdAt: "2024-01-24T09:00:00Z",
    updatedAt: "2024-01-25T13:59:00Z",
    publishedAt: undefined,
    targetCounts: {
      total: "5",
      published: "0",
      failed: "0",
      pending: "5"
    },
  },
  {
    id: "post-3",
    userId: "user-1",
    content: "Behind the scenes look at our office! Our team is amazing 💼✨ #TeamCulture #WorkLife",
    media: [
      {
        id: "3",
        mediaUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600",
        mediaType: "image",
        thumbnailUrl: null,
        displayOrder: "0"
      },
      {
        id: "4",
        mediaUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600",
        mediaType: "image",
        thumbnailUrl: null,
        displayOrder: "1"
      }
    ],
    targets: [
      {
        id: "target-11",
        socialAccountId: "page-1",
        platform: "facebook",
        accountName: "Company Page A",
        status: "scheduled",
        scheduledFor: "2024-01-26T10:00:00Z",
      },
      {
        id: "target-12",
        socialAccountId: "page-2",
        platform: "facebook",
        accountName: "Personal Brand",
        status: "scheduled",
        scheduledFor: "2024-01-26T10:00:00Z",
      },
      {
        id: "target-13",
        socialAccountId: "ig-page-1",
        platform: "instagram",
        accountName: "Business Account",
        status: "scheduled",
        scheduledFor: "2024-01-26T10:00:00Z",
      },
      {
        id: "target-14",
        socialAccountId: "li-page-1",
        platform: "linkedin_individual",
        accountName: "John Doe",
        status: "scheduled",
        scheduledFor: "2024-01-26T10:00:00Z",
      },
    ],
    status: "scheduled",
    scheduledFor: "2024-01-26T10:00:00Z",
    createdAt: "2024-01-24T14:00:00Z",
    updatedAt: "2024-01-24T14:00:00Z",
    publishedAt: undefined,
    targetCounts: {
      total: "4",
      published: "0",
      failed: "0",
      pending: "4"
    },
  },
  {
    id: "post-4",
    userId: "user-1",
    content: "Customer testimonial: 'Best service we've ever used!' Thank you for your trust! 🙏 #CustomerLove #Testimonial",
    media: [
      {
        id: "5",
        mediaUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600",
        mediaType: "image",
        thumbnailUrl: null,
        displayOrder: "0"
      }
    ],
    targets: [
      {
        id: "target-15",
        socialAccountId: "page-1",
        platform: "facebook",
        accountName: "Company Page A",
        status: "failed",
        error: "Token expired. Please reconnect your account.",
        scheduledFor: "2024-01-24T12:00:00Z",
      },
      {
        id: "target-16",
        socialAccountId: "ig-page-1",
        platform: "instagram",
        accountName: "Business Account",
        status: "published",
        publishedUrl: "https://instagram.com/p/testimonial123",
        publishedAt: "2024-01-24T12:00:05Z",
        scheduledFor: "2024-01-24T12:00:00Z",
      },
      {
        id: "target-17",
        socialAccountId: "tw-page-1",
        platform: "twitter",
        accountName: "Company Twitter",
        status: "failed",
        error: "Rate limit exceeded. Try again in 15 minutes.",
        scheduledFor: "2024-01-24T12:00:00Z",
      },
    ],
    status: "failed",
    scheduledFor: "2024-01-24T12:00:00Z",
    createdAt: "2024-01-23T16:00:00Z",
    updatedAt: "2024-01-24T12:01:00Z",
    publishedAt: undefined,
    targetCounts: {
      total: "3",
      published: "1",
      failed: "2",
      pending: "0"
    },
  },
  {
    id: "post-5",
    userId: "user-1",
    content: "Save this draft for later editing...",
    media: [],
    targets: [
      {
        id: "target-18",
        socialAccountId: "page-1",
        platform: "facebook",
        accountName: "Company Page A",
        status: "draft",
      },
      {
        id: "target-19",
        socialAccountId: "ig-page-1",
        platform: "instagram",
        accountName: "Business Account",
        status: "draft",
      },
    ],
    status: "draft",
    createdAt: "2024-01-25T08:00:00Z",
    updatedAt: "2024-01-25T08:00:00Z",
    publishedAt: undefined,
    targetCounts: {
      total: "2",
      published: "0",
      failed: "0",
      pending: "0"
    },
  },
  {
    id: "post-6",
    userId: "user-1",
    content: "New blog post is live! Check out our latest insights on industry trends. Link in bio! 📝 #Blog #ContentMarketing",
    media: [
      {
        id: "6",
        mediaUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600",
        mediaType: "image",
        thumbnailUrl: null,
        displayOrder: "0"
      }
    ],
    targets: [
      {
        id: "target-20",
        socialAccountId: "page-1",
        platform: "facebook",
        accountName: "Company Page A",
        status: "scheduled",
        scheduledFor: "2024-01-27T16:00:00Z",
      },
      {
        id: "target-21",
        socialAccountId: "tw-page-1",
        platform: "twitter",
        accountName: "Company Twitter",
        status: "scheduled",
        scheduledFor: "2024-01-27T16:00:00Z",
      },
      {
        id: "target-22",
        socialAccountId: "li-page-1",
        platform: "linkedin_individual",
        accountName: "John Doe",
        status: "scheduled",
        scheduledFor: "2024-01-27T16:00:00Z",
      },
    ],
    status: "scheduled",
    scheduledFor: "2024-01-27T16:00:00Z",
    createdAt: "2024-01-24T11:00:00Z",
    updatedAt: "2024-01-24T11:00:00Z",
    publishedAt: undefined,
    targetCounts: {
      total: "3",
      published: "0",
      failed: "0",
      pending: "3"
    },
  },
  {
    id: "post-7",
    userId: "user-1",
    content: "Happy Monday! Starting the week strong with our team. What are your goals for this week? 💪 #MondayMotivation #TeamWork",
    media: [
      {
        id: "7",
        mediaUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600",
        mediaType: "image",
        thumbnailUrl: null,
        displayOrder: "0"
      }
    ],
    targets: [
      {
        id: "target-23",
        socialAccountId: "page-1",
        platform: "facebook",
        accountName: "Company Page A",
        status: "scheduled",
        scheduledFor: "2024-01-29T09:00:00Z",
      },
      {
        id: "target-24",
        socialAccountId: "ig-page-1",
        platform: "instagram",
        accountName: "Business Account",
        status: "scheduled",
        scheduledFor: "2024-01-29T09:00:00Z",
      },
      {
        id: "target-25",
        socialAccountId: "li-page-1",
        platform: "linkedin_individual",
        accountName: "John Doe",
        status: "scheduled",
        scheduledFor: "2024-01-29T09:00:00Z",
      },
    ],
    status: "scheduled",
    scheduledFor: "2024-01-29T09:00:00Z",
    createdAt: "2024-01-25T10:00:00Z",
    updatedAt: "2024-01-25T10:00:00Z",
    publishedAt: undefined,
    targetCounts: {
      total: "3",
      published: "0",
      failed: "0",
      pending: "3"
    },
  },
  {
    id: "post-8",
    userId: "user-1",
    content: "Weekend vibes! Time to recharge and prepare for an amazing week ahead 🌟 #WeekendMode #Relaxation",
    media: [
      {
        id: "8",
        mediaUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600",
        mediaType: "image",
        thumbnailUrl: null,
        displayOrder: "0"
      }
    ],
    targets: [
      {
        id: "target-26",
        socialAccountId: "page-2",
        platform: "facebook",
        accountName: "Personal Brand",
        status: "scheduled",
        scheduledFor: "2024-01-28T17:00:00Z",
      },
      {
        id: "target-27",
        socialAccountId: "ig-page-1",
        platform: "instagram",
        accountName: "Business Account",
        status: "scheduled",
        scheduledFor: "2024-01-28T17:00:00Z",
      },
    ],
    status: "scheduled",
    scheduledFor: "2024-01-28T17:00:00Z",
    createdAt: "2024-01-25T11:00:00Z",
    updatedAt: "2024-01-25T11:00:00Z",
    publishedAt: undefined,
    targetCounts: {
      total: "2",
      published: "0",
      failed: "0",
      pending: "2"
    },
  },
  {
    id: "post-9",
    userId: "user-1",
    content: "Exciting product updates coming your way! Stay tuned for tomorrow's announcement 🚀 #ProductUpdate #Innovation",
    media: [
      {
        id: "9",
        mediaUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600",
        mediaType: "image",
        thumbnailUrl: null,
        displayOrder: "0"
      }
    ],
    targets: [
      {
        id: "target-28",
        socialAccountId: "page-1",
        platform: "facebook",
        accountName: "Company Page A",
        status: "scheduled",
        scheduledFor: "2024-01-30T14:00:00Z",
      },
      {
        id: "target-29",
        socialAccountId: "page-3",
        platform: "facebook",
        accountName: "Product Page",
        status: "scheduled",
        scheduledFor: "2024-01-30T14:00:00Z",
      },
      {
        id: "target-30",
        socialAccountId: "tw-page-1",
        platform: "twitter",
        accountName: "Company Twitter",
        status: "scheduled",
        scheduledFor: "2024-01-30T14:00:00Z",
      },
      {
        id: "target-31",
        socialAccountId: "li-page-1",
        platform: "linkedin_individual",
        accountName: "John Doe",
        status: "scheduled",
        scheduledFor: "2024-01-30T14:00:00Z",
      },
    ],
    status: "scheduled",
    scheduledFor: "2024-01-30T14:00:00Z",
    createdAt: "2024-01-25T12:00:00Z",
    updatedAt: "2024-01-25T12:00:00Z",
    publishedAt: undefined,
    targetCounts: {
      total: "4",
      published: "0",
      failed: "0",
      pending: "4"
    },
  },
  {
    id: "post-10",
    userId: "user-1",
    content: "Throwback to last month's company event! Great memories with an amazing team 📸 #ThrowbackThursday #TeamBuilding",
    media: [
      {
        id: "10",
        mediaUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600",
        mediaType: "image",
        thumbnailUrl: null,
        displayOrder: "0"
      }
    ],
    targets: [
      {
        id: "target-32",
        socialAccountId: "page-1",
        platform: "facebook",
        accountName: "Company Page A",
        status: "scheduled",
        scheduledFor: "2024-01-31T11:00:00Z",
      },
      {
        id: "target-33",
        socialAccountId: "ig-page-1",
        platform: "instagram",
        accountName: "Business Account",
        status: "scheduled",
        scheduledFor: "2024-01-31T11:00:00Z",
      },
    ],
    status: "scheduled",
    scheduledFor: "2024-01-31T11:00:00Z",
    createdAt: "2024-01-25T13:00:00Z",
    updatedAt: "2024-01-25T13:00:00Z",
    publishedAt: undefined,
    targetCounts: {
      total: "2",
      published: "0",
      failed: "0",
      pending: "2"
    },
  },
  {
    id: "post-11",
    userId: "user-1",
    content: "Success story alert! 🎉 See how our client achieved 300% growth in just 6 months. Read the full case study! #SuccessStory #CaseStudy",
    media: [
      {
        id: "11",
        mediaUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600",
        mediaType: "image",
        thumbnailUrl: null,
        displayOrder: "0"
      }
    ],
    targets: [
      {
        id: "target-34",
        socialAccountId: "page-1",
        platform: "facebook",
        accountName: "Company Page A",
        status: "scheduled",
        scheduledFor: "2024-02-01T15:00:00Z",
      },
      {
        id: "target-35",
        socialAccountId: "tw-page-1",
        platform: "twitter",
        accountName: "Company Twitter",
        status: "scheduled",
        scheduledFor: "2024-02-01T15:00:00Z",
      },
      {
        id: "target-36",
        socialAccountId: "li-page-1",
        platform: "linkedin_individual",
        accountName: "John Doe",
        status: "scheduled",
        scheduledFor: "2024-02-01T15:00:00Z",
      },
    ],
    status: "scheduled",
    scheduledFor: "2024-02-01T15:00:00Z",
    createdAt: "2024-01-25T14:00:00Z",
    updatedAt: "2024-01-25T14:00:00Z",
    publishedAt: undefined,
    targetCounts: {
      total: "3",
      published: "0",
      failed: "0",
      pending: "3"
    },
  },
  {
    id: "post-12",
    userId: "user-1",
    content: "Pro tip: Time management is the key to productivity! Check out our latest blog post for 10 tips to manage your time better ⏰ #ProductivityTips #TimeManagement",
    media: [
      {
        id: "12",
        mediaUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600",
        mediaType: "image",
        thumbnailUrl: null,
        displayOrder: "0"
      }
    ],
    targets: [
      {
        id: "target-37",
        socialAccountId: "page-2",
        platform: "facebook",
        accountName: "Personal Brand",
        status: "scheduled",
        scheduledFor: "2024-02-02T10:30:00Z",
      },
      {
        id: "target-38",
        socialAccountId: "tw-page-1",
        platform: "twitter",
        accountName: "Company Twitter",
        status: "scheduled",
        scheduledFor: "2024-02-02T10:30:00Z",
      },
      {
        id: "target-39",
        socialAccountId: "li-page-1",
        platform: "linkedin_individual",
        accountName: "John Doe",
        status: "scheduled",
        scheduledFor: "2024-02-02T10:30:00Z",
      },
    ],
    status: "scheduled",
    scheduledFor: "2024-02-02T10:30:00Z",
    createdAt: "2024-01-25T15:00:00Z",
    updatedAt: "2024-01-25T15:00:00Z",
    publishedAt: undefined,
    targetCounts: {
      total: "3",
      published: "0",
      failed: "0",
      pending: "3"
    },
  },
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalAccounts: 5,
  totalPosts: 150,
  scheduledPosts: 12,
  successRate: 87.5,
};

// Mock Platform Stats
export const mockPlatformStats: PlatformStats[] = [
  {
    platform: "facebook",
    connectedAccounts: 3,
    totalScheduled: 8,
    publishedToday: 2,
    successRate: 92.0,
    failedPosts: 1,
    status: "healthy",
  },
  {
    platform: "instagram",
    connectedAccounts: 1,
    totalScheduled: 4,
    publishedToday: 1,
    successRate: 95.0,
    failedPosts: 0,
    status: "warning",
  },
  {
    platform: "twitter",
    connectedAccounts: 1,
    totalScheduled: 3,
    publishedToday: 0,
    successRate: 75.0,
    failedPosts: 1,
    status: "healthy",
  },
  {
    platform: "linkedin_individual",
    connectedAccounts: 1,
    totalScheduled: 1,
    publishedToday: 0,
    successRate: 100.0,
    failedPosts: 0,
    status: "healthy",
  },
  {
    platform: "linkedin_organisation",
    connectedAccounts: 1,
    totalScheduled: 1,
    publishedToday: 0,
    successRate: 100.0,
    failedPosts: 0,
    status: "healthy",
  },
  {
    platform: "pinterest",
    connectedAccounts: 0,
    totalScheduled: 0,
    publishedToday: 0,
    successRate: 0,
    failedPosts: 0,
    status: "disconnected",
  },
  {
    platform: "youtube",
    connectedAccounts: 0,
    totalScheduled: 0,
    publishedToday: 0,
    successRate: 0,
    failedPosts: 0,
    status: "disconnected",
  },
  {
    platform: "threads",
    connectedAccounts: 1,
    totalScheduled: 2,
    publishedToday: 0,
    successRate: 100.0,
    failedPosts: 0,
    status: "healthy",
  },
];

// Mock Upcoming Posts
export const mockUpcomingPosts: UpcomingPost[] = [
  {
    id: "post-2",
    content: "Join us for our upcoming webinar on digital marketing strategies! Limited seats available. Register now! 🎯",
    scheduledFor: "2024-01-25T14:00:00Z",
    platforms: ["facebook", "instagram", "twitter", "linkedin"],
    mediaUrls: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600",
    ],
    targetCount: 5,
  },
  {
    id: "post-3",
    content: "Behind the scenes look at our office! Our team is amazing 💼✨",
    scheduledFor: "2024-01-26T10:00:00Z",
    platforms: ["facebook", "instagram", "linkedin"],
    mediaUrls: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600",
    ],
    targetCount: 4,
  },
  {
    id: "post-6",
    content: "New blog post is live! Check out our latest insights on industry trends. Link in bio! 📝",
    scheduledFor: "2024-01-27T16:00:00Z",
    platforms: ["facebook", "twitter", "linkedin"],
    mediaUrls: [
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600",
    ],
    targetCount: 3,
  },
];

// Helper function to get posts by status
export const getPostsByStatus = (status: Post["status"]): Post[] => {
  return mockPosts.filter((post) => post.status === status);
};

// Helper function to get accounts by platform
export const getAccountsByPlatform = (
  platform: PlatformAccount["platform"]
): PlatformAccount[] => {
  return mockPlatformAccounts.filter((acc) => acc.platform === platform);
};

// Helper function to get all social accounts (flattened pages)
export const getAllSocialAccounts = (): SocialAccount[] => {
  return mockPlatformAccounts.flatMap((acc) => acc.pages || []);
};
