# Social Poster Calendar View - Backend API Endpoints

This document outlines the required backend endpoints for the Social Poster Calendar View functionality.

## Base URL
```
/api/v1/social-poster
```

## Authentication
All endpoints require JWT Bearer token in the Authorization header:
```
Authorization: Bearer {jwt_token}
```

---

## 1. Get Posts for Calendar View

### Endpoint
```
GET /posts/calendar
```

### Description
Retrieve posts for calendar display with optional date range filtering. Returns posts grouped by date in user's timezone.

### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| start_date | string (YYYY-MM-DD) | No | Start date for filtering (inclusive) |
| end_date | string (YYYY-MM-DD) | No | End date for filtering (inclusive) |
| status | string | No | Filter by status: `all`, `draft`, `scheduled`, `publishing`, `published`, `failed` |
| platform | string | No | Filter by platform: `facebook`, `instagram`, `twitter`, `linkedin`, etc. |
| timezone | string | No | User's timezone (e.g., "America/New_York"). Defaults to user's profile timezone |
| page | integer | No | Page number for pagination (default: 1) |
| limit | integer | No | Number of results per page (default: 100) |

### Request Example
```http
GET /api/v1/social-poster/posts/calendar?start_date=2024-01-01&end_date=2024-01-31&status=scheduled&timezone=America/New_York
Authorization: Bearer eyJhbGc...
```

### Response Success (200 OK)
```json
{
  "code": 200,
  "message": "Posts retrieved successfully",
  "data": {
    "posts": [
      {
        "id": "post-1",
        "userId": "user-1",
        "content": "🚀 Excited to announce our new product launch!...",
        "media": [
          {
            "id": "1",
            "mediaUrl": "https://storage.example.com/media/image1.jpg",
            "mediaType": "image",
            "thumbnailUrl": null,
            "displayOrder": "0"
          }
        ],
        "targets": [
          {
            "id": "target-1",
            "socialAccountId": "page-1",
            "platform": "facebook",
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
        "publishedAt": "2024-01-24T15:00:20Z",
        "targetCounts": {
          "total": "5",
          "published": "5",
          "failed": "0",
          "pending": "0"
        }
      }
    ],
    "postsByDate": {
      "2024-01-24": ["post-1", "post-2"],
      "2024-01-25": ["post-3"],
      "2024-01-26": ["post-4", "post-5"]
    },
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 1,
      "itemsPerPage": 100
    },
    "timezone": "America/New_York"
  }
}
```

### Response Error (400 Bad Request)
```json
{
  "code": 400,
  "message": "Invalid date format. Expected YYYY-MM-DD",
  "data": null
}
```

### Response Error (401 Unauthorized)
```json
{
  "code": 401,
  "message": "Unauthorized. Invalid or missing token",
  "data": null
}
```

---

## 2. Get Posts for Specific Date

### Endpoint
```
GET /posts/calendar/date/{date}
```

### Description
Retrieve all posts scheduled for a specific date in the user's timezone.

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| date | string (YYYY-MM-DD) | Yes | The date to retrieve posts for |

### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| timezone | string | No | User's timezone (defaults to profile timezone) |
| status | string | No | Filter by status |
| platform | string | No | Filter by platform |

### Request Example
```http
GET /api/v1/social-poster/posts/calendar/date/2024-01-25?timezone=America/New_York
Authorization: Bearer eyJhbGc...
```

### Response Success (200 OK)
```json
{
  "code": 200,
  "message": "Posts for date retrieved successfully",
  "data": {
    "date": "2024-01-25",
    "timezone": "America/New_York",
    "posts": [
      {
        "id": "post-2",
        "userId": "user-1",
        "content": "Join us for our upcoming webinar...",
        "media": [...],
        "targets": [...],
        "status": "scheduled",
        "scheduledFor": "2024-01-25T14:00:00Z",
        "createdAt": "2024-01-24T09:00:00Z",
        "updatedAt": "2024-01-25T13:59:00Z",
        "targetCounts": {
          "total": "5",
          "published": "0",
          "failed": "0",
          "pending": "5"
        }
      }
    ],
    "totalPosts": 1
  }
}
```

---

## 3. Get Calendar Summary (Month Overview)

### Endpoint
```
GET /posts/calendar/summary
```

### Description
Get a summary of posts for each day in a month. Useful for rendering calendar indicators showing which days have posts.

### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| year | integer | Yes | Year (e.g., 2024) |
| month | integer | Yes | Month (1-12) |
| timezone | string | No | User's timezone |

### Request Example
```http
GET /api/v1/social-poster/posts/calendar/summary?year=2024&month=1&timezone=America/New_York
Authorization: Bearer eyJhbGc...
```

### Response Success (200 OK)
```json
{
  "code": 200,
  "message": "Calendar summary retrieved successfully",
  "data": {
    "year": 2024,
    "month": 1,
    "timezone": "America/New_York",
    "summary": {
      "2024-01-24": {
        "count": 2,
        "statuses": {
          "published": 1,
          "failed": 1
        },
        "platforms": ["facebook", "instagram", "twitter", "linkedin"]
      },
      "2024-01-25": {
        "count": 1,
        "statuses": {
          "scheduled": 1
        },
        "platforms": ["facebook", "instagram", "twitter"]
      },
      "2024-01-26": {
        "count": 2,
        "statuses": {
          "scheduled": 2
        },
        "platforms": ["facebook", "instagram"]
      }
    },
    "totalPostsInMonth": 15
  }
}
```

---

## 4. Move/Reschedule Post (Drag & Drop on Calendar)

### Endpoint
```
PATCH /posts/{postId}/reschedule
```

### Description
Reschedule a post to a new date/time. Used when dragging posts to different dates on the calendar.

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| postId | string | Yes | The ID of the post to reschedule |

### Request Body
```json
{
  "scheduledFor": "2024-01-30T14:00:00Z",
  "timezone": "America/New_York"
}
```

### Request Example
```http
PATCH /api/v1/social-poster/posts/post-1/reschedule
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "scheduledFor": "2024-01-30T14:00:00Z",
  "timezone": "America/New_York"
}
```

### Response Success (200 OK)
```json
{
  "code": 200,
  "message": "Post rescheduled successfully",
  "data": {
    "id": "post-1",
    "scheduledFor": "2024-01-30T14:00:00Z",
    "updatedAt": "2024-01-25T16:30:00Z",
    "targets": [
      {
        "id": "target-1",
        "scheduledFor": "2024-01-30T14:00:00Z",
        "status": "scheduled"
      }
    ]
  }
}
```

### Response Error (403 Forbidden)
```json
{
  "code": 403,
  "message": "Cannot reschedule posts with status 'published' or 'publishing'",
  "data": null
}
```

---

## 5. Bulk Operations for Calendar

### Endpoint
```
POST /posts/calendar/bulk-action
```

### Description
Perform bulk actions on multiple posts (delete, reschedule, retry).

### Request Body
```json
{
  "action": "reschedule",
  "postIds": ["post-1", "post-2", "post-3"],
  "scheduledFor": "2024-01-30T14:00:00Z",
  "timezone": "America/New_York"
}
```

### Supported Actions
- `delete` - Delete multiple posts
- `reschedule` - Reschedule multiple posts to the same time
- `retry` - Retry failed posts
- `duplicate` - Duplicate posts to another date

### Request Example
```http
POST /api/v1/social-poster/posts/calendar/bulk-action
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "action": "reschedule",
  "postIds": ["post-1", "post-2"],
  "scheduledFor": "2024-01-30T14:00:00Z"
}
```

### Response Success (200 OK)
```json
{
  "code": 200,
  "message": "Bulk action completed successfully",
  "data": {
    "action": "reschedule",
    "totalProcessed": 2,
    "successful": 2,
    "failed": 0,
    "results": [
      {
        "postId": "post-1",
        "status": "success",
        "newScheduledFor": "2024-01-30T14:00:00Z"
      },
      {
        "postId": "post-2",
        "status": "success",
        "newScheduledFor": "2024-01-30T14:00:00Z"
      }
    ]
  }
}
```

---

## Data Validation Rules

### Date Formats
- All dates should be in ISO 8601 format: `YYYY-MM-DDTHH:mm:ssZ` (UTC)
- Date-only queries use format: `YYYY-MM-DD`
- Backend should convert all dates to user's timezone for display

### Timezone Handling
- All datetime values stored in database should be in UTC
- Backend converts UTC to user's timezone before sending response
- Frontend sends user's timezone with each request
- User's default timezone comes from their profile settings

### Status Constraints
- Only posts with status `draft` or `scheduled` can be edited or rescheduled
- Posts with status `published`, `publishing`, or `failed` cannot be edited (only retried or deleted)
- Status transitions: `draft` → `scheduled` → `publishing` → `published` / `failed`

### Platform-Specific Rules
- LinkedIn: Show both `linkedin_individual` and `linkedin_organisation` together when filtering by `linkedin`
- Each post target has its own status independent of the post's overall status
- Post overall status is derived from target statuses:
  - `published`: All targets published
  - `failed`: At least one target failed
  - `publishing`: At least one target currently publishing
  - `scheduled`: All targets scheduled for future
  - `draft`: No targets scheduled

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions or invalid operation) |
| 404 | Not Found (post/resource doesn't exist) |
| 409 | Conflict (e.g., trying to schedule in the past) |
| 422 | Unprocessable Entity (business logic error) |
| 500 | Internal Server Error |

---

## Rate Limiting

All endpoints are subject to rate limiting:
- **Standard limit**: 100 requests per minute per user
- **Bulk operations**: 20 requests per minute per user
- **Calendar summary**: 60 requests per minute per user

Rate limit headers included in response:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## Notes for Implementation

1. **Timezone Conversion**: Always convert UTC timestamps to user timezone in responses
2. **Performance**: Use database indexes on `scheduledFor`, `status`, and `userId` columns
3. **Caching**: Consider caching calendar summary data for 5-10 minutes
4. **Pagination**: Default to 100 items for calendar view (typically shows 1 month)
5. **Real-time Updates**: Consider WebSocket/SSE for real-time post status updates
6. **Filtering**: Support multiple filters simultaneously (status + platform + date range)
7. **Sorting**: Posts within a day should be sorted by time (earliest first)
8. **Media Handling**: Include `thumbnailUrl` for video posts to display in calendar

---

## Future Enhancements

These endpoints may be needed in future iterations:

1. **Drag & Drop API** - Real-time updates when dragging posts between dates
2. **Calendar Templates** - Save and reuse calendar patterns
3. **Analytics Integration** - Show performance metrics directly on calendar
4. **Collaborative Features** - Show who scheduled which posts
5. **Calendar Export** - Export calendar to iCal, Google Calendar format
