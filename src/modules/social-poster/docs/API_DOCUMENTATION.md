# Social Poster API Documentation

This document describes the expected API endpoints and data structures for the Social Poster module backend.

## Base URL
All endpoints are prefixed with: `/api/social-poster`

---

## Authentication
All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## Endpoints

### 1. Get Dashboard Stats
**GET** `/dashboard/stats`

Get overview statistics for the dashboard.

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalScheduled": 12,
      "publishedToday": 3,
      "successRate": 87.5,
      "failedPosts": 2,
      "changeFromLastMonth": {
        "scheduled": 15.5,
        "published": 23.0,
        "successRate": 5.2,
        "failed": -12.0
      }
    },
    "platformStats": [
      {
        "platform": "facebook",
        "connectedAccounts": 3,
        "totalScheduled": 8,
        "publishedToday": 2,
        "successRate": 92.0,
        "failedPosts": 1,
        "status": "healthy"
      },
      {
        "platform": "instagram",
        "connectedAccounts": 1,
        "totalScheduled": 4,
        "publishedToday": 1,
        "successRate": 95.0,
        "failedPosts": 0,
        "status": "warning"
      },
      {
        "platform": "twitter",
        "connectedAccounts": 1,
        "totalScheduled": 3,
        "publishedToday": 0,
        "successRate": 75.0,
        "failedPosts": 1,
        "status": "healthy"
      },
      {
        "platform": "linkedin",
        "connectedAccounts": 1,
        "totalScheduled": 2,
        "publishedToday": 0,
        "successRate": 100.0,
        "failedPosts": 0,
        "status": "healthy"
      },
      {
        "platform": "threads",
        "connectedAccounts": 1,
        "totalScheduled": 2,
        "publishedToday": 0,
        "successRate": 100.0,
        "failedPosts": 0,
        "status": "healthy"
      },
      {
        "platform": "pinterest",
        "connectedAccounts": 0,
        "totalScheduled": 0,
        "publishedToday": 0,
        "successRate": 0,
        "failedPosts": 0,
        "status": "disconnected"
      },
      {
        "platform": "youtube",
        "connectedAccounts": 0,
        "totalScheduled": 0,
        "publishedToday": 0,
        "successRate": 0,
        "failedPosts": 0,
        "status": "disconnected"
      },
      {
        "platform": "threads",
        "connectedAccounts": 0,
        "totalScheduled": 0,
        "publishedToday": 0,
        "successRate": 0,
        "failedPosts": 0,
        "status": "disconnected"
      }
    ],
    "upcomingPosts": [
      {
        "id": "post-2",
        "content": "Join us for our upcoming webinar...",
        "scheduledFor": "2024-01-25T14:00:00Z",
        "platforms": ["facebook", "instagram", "twitter", "linkedin"],
        "mediaUrls": ["https://..."],
        "targetCount": 5
      },
      {
        "id": "post-3",
        "content": "Behind the scenes look at our office! Our team is amazing 💼✨",
        "scheduledFor": "2024-01-26T10:00:00Z",
        "platforms": ["facebook", "instagram", "linkedin"],
        "mediaUrls": [
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600",
        ],
        "targetCount": 4,
      },
      {
        "id": "post-6",
        "content": "New blog post is live! Check out our latest insights on industry trends. Link in bio! 📝",
        "scheduledFor": "2024-01-27T16:00:00Z",
        "platforms": ["facebook", "twitter", "linkedin"],
        "mediaUrls": [
          "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600",
        ],
        "targetCount": 3,
      },
    ]
  }
}
```

---

### 2. Get Connected Accounts
**GET** `/accounts`

Get all connected social media accounts for the user.

**Response:**
```json
{
  "success": true,
  "data": {
    "accounts": [
      {
        "id": "acc-1",
        "userId": "user-1",
        "platform": "facebook",
        "platformUserId": "fb-12345",
        "platformUsername": "john.doe",
        "displayName": "John Doe",
        "profilePicture": "https://...",
        "accessToken": "fb_token_xxx",
        "refreshToken": "fb_refresh_xxx",
        "tokenExpiresAt": "2024-03-01T10:00:00Z",
        "status": "healthy",
        "connectedAt": "2024-01-15T10:00:00Z",
        "lastRefreshedAt": "2024-01-20T14:30:00Z",
        "pages": [
          {
            "id": "page-1",
            "platform": "facebook",
            "platformAccountId": "fb-page-1",
            "accountName": "Company Page A",
            "username": "companypagea",
            "profilePicture": "https://...",
            "followerCount": 12000,
            "status": "healthy",
            "connectedAt": "2024-01-15T10:00:00Z",
            "capabilities": {
              "canPost": true,
              "canSchedule": true,
              "canUploadMedia": true,
              "maxMediaCount": 10
            }
          }
        ]
      }
    ]
  }
}
```

---

### 3. Connect Social Account
**POST** `/accounts/connect`

Initiate OAuth connection for a social platform.

**Request:**
```json
{
  "platform": "facebook"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "authUrl": "https://facebook.com/oauth/authorize?..."
  }
}
```

---

### 4. OAuth Callback
**GET** `/accounts/callback/:platform`

**Query Parameters:**
- `code`: OAuth authorization code
- `state`: OAuth state parameter

**Response:**
```json
{
  "success": true,
  "data": {
    "account": {
      "id": "acc-1",
      "platform": "facebook",
      "displayName": "John Doe",
      "status": "healthy"
    },
    "message": "Account connected successfully"
  }
}
```

---

### 5. Refresh Account Token
**POST** `/accounts/:accountId/refresh`

Refresh the access token for an account.

**Response:**
```json
{
  "success": true,
  "data": {
    "tokenExpiresAt": "2024-04-01T10:00:00Z",
    "message": "Token refreshed successfully"
  }
}
```

---

### 6. Disconnect Account
**DELETE** `/accounts/:accountId`

Disconnect a social media account.

**Response:**
```json
{
  "success": true,
  "message": "Account disconnected successfully"
}
```

---

### 7. Get Posts
**GET** `/posts`

Get posts with filtering and pagination.

**Query Parameters:**
- `status`: Filter by status (draft, scheduled, publishing, published, failed)
- `platform`: Filter by platform
- `dateFrom`: Filter from date (ISO 8601)
- `dateTo`: Filter to date (ISO 8601)
- `search`: Search in content
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `sortBy`: Sort field (createdAt, scheduledFor, updatedAt)
- `sortOrder`: Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "post-1",
        "userId": "user-1",
        "content": "Excited to announce our new product launch!...",
        "mediaUrls": ["https://..."],
        "targets": [
          {
            "platform": "facebook",
            "accountId": "page-1",
            "accountName": "Company Page A",
            "status": "published",
            "publishedUrl": "https://facebook.com/posts/123",
            "publishedAt": "2024-01-24T15:00:00Z",
            "scheduledFor": "2024-01-24T15:00:00Z",
            "error": null
          }
        ],
        "status": "published",
        "scheduledFor": "2024-01-24T15:00:00Z",
        "createdAt": "2024-01-23T10:00:00Z",
        "updatedAt": "2024-01-24T15:00:20Z",
        "publishedCount": 5,
        "failedCount": 0,
        "pendingCount": 0,
        "totalTargets": 5,
        "platformOptions": {
          "facebook": {
            "asAdmin": true
          }
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

---

### 8. Create Post
**POST** `/posts`

Create a new post.

**Request:**
```json
{
  "content": "Check out our new product!",
  "mediaUrls": ["https://..."],
  "targetAccountIds": ["page-1", "page-2", "ig-page-1"],
  "scheduledFor": "2024-01-26T14:00:00Z",
  "platformOptions": {
    "facebook": {
      "asAdmin": true
    },
    "twitter": {
      "enableReplies": false
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "post": {
      "id": "post-new",
      "status": "scheduled",
      "scheduledFor": "2024-01-26T14:00:00Z"
    },
    "message": "Post created and scheduled successfully"
  }
}
```

---

### 9. Update Post
**PUT** `/posts/:postId`

Update an existing post (only drafts and scheduled posts can be updated).

**Request:**
```json
{
  "content": "Updated content",
  "mediaUrls": ["https://..."],
  "targetAccountIds": ["page-1", "page-2"],
  "scheduledFor": "2024-01-27T14:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "post": {
      "id": "post-1",
      "status": "scheduled",
      "updatedAt": "2024-01-25T10:00:00Z"
    },
    "message": "Post updated successfully"
  }
}
```

---

### 10. Delete Post
**DELETE** `/posts/:postId`

Delete a post.

**Response:**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

### 11. Retry Failed Post
**POST** `/posts/:postId/retry`

Retry publishing failed post targets.

**Request:**
```json
{
  "targetAccountIds": ["page-1", "tw-page-1"]
}
```
*Note: If targetAccountIds is not provided, retry all failed targets*

**Response:**
```json
{
  "success": true,
  "data": {
    "retriedCount": 2,
    "message": "Post retry initiated"
  }
}
```

---

### 12. Upload Media
**POST** `/media/upload`

Upload media files for posts.

**Request:**
- Content-Type: multipart/form-data
- Body: file field with image/video

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://storage.example.com/media/abc123.jpg",
    "type": "image",
    "size": 1024000
  }
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "content": "Content is required",
      "targetAccountIds": "At least one account must be selected"
    }
  }
}
```

---

## Platform-Specific Notes

### Facebook
- Requires App ID and App Secret
- Supports pages with different roles
- Token expiration: 60 days
- Max media: 10 images/videos

### Instagram
- Connected via Facebook Graph API
- Requires Business or Creator account
- Max media: 10 images, 1 video
- Character limit: 2200

### Twitter/X
- Different API tiers available
- Character limit: 280
- Max media: 4 images, 1 video

### LinkedIn
- Supports personal profiles and company pages
- Character limit: 3000
- Max media: 9 images, 1 video

---

## Webhooks (Future)

For real-time post status updates:

**POST** `/webhooks/status`

```json
{
  "postId": "post-1",
  "platform": "facebook",
  "accountId": "page-1",
  "status": "published",
  "publishedUrl": "https://facebook.com/posts/123",
  "timestamp": "2024-01-25T14:00:00Z"
}
```
