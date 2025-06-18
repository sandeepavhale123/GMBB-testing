
# Reviews Management API Documentation

## Overview
This document provides comprehensive API documentation for the Reviews Management system. All endpoints use REST principles and return JSON responses.

## Base URL
```
https://api.example.com/v1
```

## Authentication
All API requests require authentication using Bearer tokens:
```
Authorization: Bearer {your_access_token}
```

---

## 1. Review Summary Endpoint

### GET /reviews/summary
Get aggregated review statistics and metrics.

#### Request
```http
GET /reviews/summary
Authorization: Bearer {token}
```

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `business_id` | string | Yes | Business identifier |
| `date_from` | string | No | Start date (YYYY-MM-DD) |
| `date_to` | string | No | End date (YYYY-MM-DD) |

#### Response
```json
{
  "success": true,
  "data": {
    "overall_rating": 4.6,
    "total_reviews": 282,
    "star_distribution": {
      "5": { "count": 186, "percentage": 66 },
      "4": { "count": 56, "percentage": 20 },
      "3": { "count": 28, "percentage": 10 },
      "2": { "count": 8, "percentage": 3 },
      "1": { "count": 4, "percentage": 1 }
    },
    "sentiment_analysis": {
      "positive": { "count": 220, "percentage": 78 },
      "neutral": { "count": 45, "percentage": 16 },
      "negative": { "count": 17, "percentage": 6 }
    },
    "reply_stats": {
      "total_reviews": 282,
      "pending_replies": 12,
      "ai_replies": 156,
      "manual_replies": 114
    },
    "recent_activity": {
      "new_reviews_today": 5,
      "replies_sent_today": 8,
      "avg_response_time_hours": 3.2
    }
  }
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "BUSINESS_NOT_FOUND",
    "message": "Business not found or access denied"
  }
}
```

---

## 2. Get Reviews Endpoint

### GET /reviews
Retrieve paginated list of reviews with filtering options.

#### Request
```http
GET /reviews?page=1&limit=10&filter=all
Authorization: Bearer {token}
```

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `business_id` | string | Yes | - | Business identifier |
| `page` | integer | No | 1 | Page number |
| `limit` | integer | No | 10 | Items per page (max 100) |
| `filter` | string | No | all | Filter: `all`, `pending`, `replied` |
| `sentiment` | string | No | all | Sentiment: `all`, `positive`, `neutral`, `negative` |
| `rating` | integer | No | - | Filter by rating (1-5) |
| `sort_by` | string | No | newest | Sort: `newest`, `oldest`, `rating_high`, `rating_low` |
| `search` | string | No | - | Search in customer name or comment |
| `date_from` | string | No | - | Start date (YYYY-MM-DD) |
| `date_to` | string | No | - | End date (YYYY-MM-DD) |

#### Response
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "rev_123456",
        "customer_name": "Sarah Johnson",
        "customer_initials": "SJ",
        "rating": 5,
        "comment": "Amazing coffee and friendly staff! Will definitely come back.",
        "business": "Downtown Coffee",
        "platform": "Google",
        "date": "2024-06-11T10:30:00Z",
        "replied": true,
        "reply_text": "Thank you so much for your kind words, Sarah!",
        "reply_date": "2024-06-11T14:20:00Z",
        "reply_type": "ai", // "ai" | "manual"
        "sentiment": "positive",
        "verified": true,
        "helpful_votes": 5,
        "metadata": {
          "source_url": "https://google.com/reviews/...",
          "device_type": "mobile"
        }
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 29,
      "total_items": 282,
      "items_per_page": 10,
      "has_next": true,
      "has_previous": false
    },
    "filters_applied": {
      "filter": "all",
      "sentiment": "all",
      "date_range": null
    }
  }
}
```

---

## 3. Review Reply Endpoints

### POST /reviews/{review_id}/reply
Send a reply to a specific review.

#### Request
```http
POST /reviews/rev_123456/reply
Authorization: Bearer {token}
Content-Type: application/json
```

#### Request Body
```json
{
  "reply_text": "Thank you for your feedback! We appreciate your business.",
  "reply_type": "manual", // "manual" | "ai"
  "send_notification": true
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "reply_id": "reply_789012",
    "review_id": "rev_123456",
    "reply_text": "Thank you for your feedback! We appreciate your business.",
    "reply_type": "manual",
    "created_at": "2024-06-11T15:45:00Z",
    "status": "published"
  }
}
```

### PUT /reviews/{review_id}/reply
Update an existing reply.

#### Request
```http
PUT /reviews/rev_123456/reply
Authorization: Bearer {token}
Content-Type: application/json
```

#### Request Body
```json
{
  "reply_text": "Updated reply text here",
  "send_notification": false
}
```

### DELETE /reviews/{review_id}/reply
Delete a reply to a review.

#### Request
```http
DELETE /reviews/rev_123456/reply
Authorization: Bearer {token}
```

#### Response
```json
{
  "success": true,
  "message": "Reply deleted successfully"
}
```

---

## 4. AI Reply Generation Endpoint

### POST /reviews/{review_id}/generate-ai-reply
Generate an AI-powered reply for a specific review.

#### Request
```http
POST /reviews/rev_123456/generate-ai-reply
Authorization: Bearer {token}
Content-Type: application/json
```

#### Request Body
```json
{
  "tone": "professional", // "professional" | "friendly" | "apologetic" | "enthusiastic"
  "language": "en", // ISO language code
  "include_business_name": true,
  "custom_instructions": "Always mention our loyalty program for positive reviews"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "generated_reply": "Hi Sarah! Thank you so much for your wonderful 5-star review! We're thrilled to hear that you enjoyed your experience with us. Your kind words mean the world to our team and motivate us to continue providing excellent service. Don't forget to ask about our loyalty program on your next visit. We look forward to welcoming you back soon!",
    "confidence_score": 0.92,
    "tone_detected": "enthusiastic",
    "word_count": 58,
    "generation_time_ms": 1250,
    "suggestions": [
      "Consider personalizing further by mentioning specific items they enjoyed",
      "You could add information about upcoming promotions"
    ]
  }
}
```

### POST /reviews/bulk-generate-ai-replies
Generate AI replies for multiple reviews at once.

#### Request
```http
POST /reviews/bulk-generate-ai-replies
Authorization: Bearer {token}
Content-Type: application/json
```

#### Request Body
```json
{
  "review_ids": ["rev_123456", "rev_789012", "rev_345678"],
  "settings": {
    "tone": "professional",
    "language": "en",
    "include_business_name": true,
    "auto_publish": false
  }
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "generated_replies": [
      {
        "review_id": "rev_123456",
        "generated_reply": "Thank you for your feedback...",
        "status": "generated"
      },
      {
        "review_id": "rev_789012",
        "generated_reply": "We appreciate your review...",
        "status": "generated"
      }
    ],
    "summary": {
      "total_requested": 3,
      "successfully_generated": 2,
      "failed": 1,
      "total_generation_time_ms": 3400
    },
    "failed_generations": [
      {
        "review_id": "rev_345678",
        "error": "Review content too short for AI generation"
      }
    ]
  }
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_TOKEN` | Authentication token is invalid or expired |
| `BUSINESS_NOT_FOUND` | Business ID not found or access denied |
| `REVIEW_NOT_FOUND` | Review ID not found |
| `REPLY_ALREADY_EXISTS` | Reply already exists for this review |
| `RATE_LIMIT_EXCEEDED` | Too many requests, try again later |
| `AI_GENERATION_FAILED` | AI service temporarily unavailable |
| `INVALID_PARAMETERS` | Request parameters are invalid |
| `INSUFFICIENT_PERMISSIONS` | User lacks permission for this operation |

---

## Rate Limits

| Endpoint | Rate Limit |
|----------|------------|
| GET /reviews/summary | 100 requests/hour |
| GET /reviews | 1000 requests/hour |
| POST /reviews/{id}/reply | 500 requests/hour |
| POST /reviews/{id}/generate-ai-reply | 200 requests/hour |
| POST /reviews/bulk-generate-ai-replies | 50 requests/hour |

---

## Example Usage

### JavaScript/Fetch Example
```javascript
// Get reviews with filtering
const getReviews = async (businessId, filters = {}) => {
  const params = new URLSearchParams({
    business_id: businessId,
    ...filters
  });
  
  const response = await fetch(`/api/v1/reviews?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.json();
};

// Generate AI reply
const generateAIReply = async (reviewId, options = {}) => {
  const response = await fetch(`/api/v1/reviews/${reviewId}/generate-ai-reply`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(options)
  });
  
  return response.json();
};
```

### cURL Examples
```bash
# Get review summary
curl -X GET "https://api.example.com/v1/reviews/summary?business_id=biz_123" \
  -H "Authorization: Bearer your_token"

# Send manual reply
curl -X POST "https://api.example.com/v1/reviews/rev_123456/reply" \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json" \
  -d '{"reply_text": "Thank you for your review!", "reply_type": "manual"}'

# Generate AI reply
curl -X POST "https://api.example.com/v1/reviews/rev_123456/generate-ai-reply" \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json" \
  -d '{"tone": "professional", "language": "en"}'
```

---

## Webhooks (Optional)

You can configure webhooks to receive real-time notifications:

### New Review Webhook
```json
{
  "event": "review.created",
  "data": {
    "review_id": "rev_123456",
    "business_id": "biz_123",
    "customer_name": "John Doe",
    "rating": 5,
    "created_at": "2024-06-11T10:30:00Z"
  }
}
```

### Reply Sent Webhook
```json
{
  "event": "reply.sent",
  "data": {
    "review_id": "rev_123456",
    "reply_id": "reply_789012",
    "reply_type": "ai",
    "sent_at": "2024-06-11T15:45:00Z"
  }
}
```
