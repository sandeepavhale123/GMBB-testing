# Check Rank API Documentation

## Overview
The Check Rank API processes ranking analysis requests for Google My Business listings based on specified keywords and geographical coordinates.

## Endpoint
```
POST /check-rank
```

## Authentication
- **Required**: Bearer token in Authorization header
- **Header**: `Authorization: Bearer {access_token}`

## Request Body Schema

### Required Parameters
| Parameter | Type | Description | Validation |
|-----------|------|-------------|------------|
| `listingId` | number | The business listing ID | Required, positive integer |
| `keywords` | string | Comma-separated keywords to check ranking for | Required, max 5 keywords |
| `searchDataEngine` | string | Data source for ranking results | Required, enum: "Map API", "Briefcase API" |
| `mapPoint` | string | Coordinate selection method | Required, enum: "Automatic", "Manually" |
| `scheduleCheck` | string | Frequency of rank checking | Required, enum: "One-time", "Weekly", "Monthly" |
| `language` | string | Language code for search results | Required, format: ISO 639-1 (e.g., "en") |

### Conditional Parameters (for Automatic mode)
| Parameter | Type | Description | Validation |
|-----------|------|-------------|------------|
| `distanceUnit` | string | Unit for grid generation | Required if mapPoint="Automatic", enum: "Meters", "Miles" |
| `distanceValue` | string | Distance value for grid | Required if mapPoint="Automatic" |
| `gridSize` | string | Grid dimensions | Required if mapPoint="Automatic", enum: "3x3", "5x5", "7x7", "9x9", "11x11" |
| `latlng` | array | Generated grid coordinate points | Required if mapPoint="Automatic", array of "lat,lng" strings |

### Conditional Parameters (for Manual mode)
| Parameter | Type | Description | Validation |
|-----------|------|-------------|------------|
| `coordinates` | array | Manual coordinate points | Required if mapPoint="Manually", array of "lat,lng" strings |

### Example Request Body (Automatic Mode)
```json
{
  "listingId": 176832,
  "keywords": "digital marketing agency, seo services, web design",
  "searchDataEngine": "Map API",
  "mapPoint": "Automatic",
  "distanceUnit": "Miles",
  "distanceValue": ".5",
  "gridSize": "5x5",
  "scheduleCheck": "One-time",
  "language": "en",
  "latlng": [
    "40.7128,-74.0060",
    "40.7589,-73.9851",
    "40.6782,-73.9442",
    "40.7505,-73.9934",
    "40.7282,-73.7949",
    "40.6892,-73.9442",
    "40.7128,-73.9851",
    "40.7282,-73.9934"
  ]
}
```

### Example Request Body (Manual Mode)
```json
{
  "listingId": 176832,
  "keywords": "digital marketing agency, seo services",
  "searchDataEngine": "Briefcase API",
  "mapPoint": "Manually",
  "coordinates": [
    "40.7128,-74.0060",
    "40.7589,-73.9851",
    "40.6782,-73.9442"
  ],
  "scheduleCheck": "Weekly",
  "language": "en"
}
```

## Response Body Schema

### Success Response (200 OK)
```json
{
  "code": 200,
  "message": "Rank check completed successfully",
  "data": {
    "projectDetails": {
      "id": "project_123",
      "keywords": ["digital marketing agency", "seo services", "web design"],
      "mappoint": "Automatic",
      "distance": ".5",
      "grid": "5x5",
      "last_checked": "2024-07-02T10:30:00Z",
      "schedule": "One-time",
      "date": "2024-07-02"
    },
    "rankDetails": [
      {
        "coordinate": "40.7128,-74.0060",
        "positionId": "pos_001",
        "rank": "3"
      },
      {
        "coordinate": "40.7589,-73.9851",
        "positionId": "pos_002",
        "rank": "1"
      }
    ],
    "rankStats": {
      "atr": "2.5",
      "atrp": "12.5",
      "solvability": "85"
    },
    "underPerformingArea": [
      {
        "id": "area_001",
        "areaName": "Downtown Manhattan",
        "coordinate": "40.7128,-74.0060",
        "compRank": 1,
        "compName": "Competitor Agency",
        "compRating": "4.8",
        "compReview": "245",
        "priority": "High",
        "youRank": "3",
        "youName": "Your Digital Agency",
        "youRating": "4.5",
        "youReview": "189"
      }
    ],
    "credits": {
      "allowedCredit": "100",
      "remainingCredit": 85,
      "usedCredit": 15
    },
    "estimatedCompletion": "2024-07-02T10:35:00Z"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "code": 400,
  "message": "Invalid request parameters",
  "errors": [
    {
      "field": "keywords",
      "message": "Maximum 5 keywords allowed"
    },
    {
      "field": "distanceValue",
      "message": "Distance value is required for automatic mode"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "code": 401,
  "message": "Invalid or missing authentication token"
}
```

### 403 Forbidden
```json
{
  "code": 403,
  "message": "Insufficient permissions to access this listing"
}
```

### 404 Not Found
```json
{
  "code": 404,
  "message": "Listing not found"
}
```

### 429 Too Many Requests
```json
{
  "code": 429,
  "message": "Rate limit exceeded. Please try again later.",
  "retryAfter": 300
}
```

### 500 Internal Server Error
```json
{
  "code": 500,
  "message": "Internal server error occurred"
}
```

## Implementation Notes

### Processing Flow
1. **Validation**: Validate all input parameters
2. **Authentication**: Verify user access to the specified listing
3. **Credit Check**: Ensure user has sufficient credits for the operation
4. **Coordinate Generation**: 
   - For Automatic mode: Generate grid coordinates based on distance and grid size
   - For Manual mode: Use provided coordinates
5. **Ranking Analysis**: Process ranking for each keyword at each coordinate
6. **Result Compilation**: Aggregate results and generate statistics
7. **Response**: Return comprehensive ranking data

### Distance Value Processing
- **Meters**: Accept values like "100", "500", "1000"
- **Miles**: Accept values like ".1", ".5", "1", "2", with optional "mi" suffix

### Grid Coordinate Generation
- Use the listing's default coordinates as the center point
- Generate evenly distributed grid points based on distance and grid size
- Return coordinates in "latitude,longitude" format

### Rate Limiting
- Implement rate limiting per user/listing
- Consider the computational cost of different grid sizes
- Larger grids (9x9, 11x11) should have stricter limits

### Caching Strategy
- Cache results for identical requests within a reasonable timeframe (e.g., 1 hour)
- Consider caching partial results for efficiency
- Invalidate cache when business information changes

### Asynchronous Processing
- For large grid sizes or multiple keywords, consider asynchronous processing
- Provide status polling endpoint for long-running requests
- Send webhook notifications when processing completes

### Integration with Existing APIs
- Leverage existing `/get-default-coordinates` endpoint for center point
- Use similar response structure as `/get-keyword-details` for consistency
- Maintain credit system integration

## Testing Considerations

### Test Cases
1. **Valid automatic mode request** with different grid sizes
2. **Valid manual mode request** with multiple coordinates
3. **Invalid parameters** (missing required fields, invalid enums)
4. **Insufficient credits** scenario
5. **Large grid processing** (9x9, 11x11)
6. **Multiple keywords** (up to 5 keywords)
7. **Rate limiting** behavior
8. **Authentication** edge cases

### Performance Expectations
- Response time should be under 30 seconds for 5x5 grids
- Larger grids may require asynchronous processing
- Credit consumption should be proportional to grid size and keyword count