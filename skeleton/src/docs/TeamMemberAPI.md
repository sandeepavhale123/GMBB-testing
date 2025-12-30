# Team Member Management API Documentation

## Overview
This document outlines the API endpoints required for team member management functionality, including listing, creating, updating, and deleting team members with role-based permissions.

## Base URL
```
/api/v1/team-members
```

## Authentication
All endpoints require Bearer token authentication in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 1. Get Team Members List

### Endpoint
```http
GET /api/v1/team-members
```

### Description
Retrieves a paginated list of team members with filtering and search capabilities.

### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | Page number for pagination (default: 1) |
| `limit` | integer | No | Number of items per page (default: 10, max: 100) |
| `search` | string | No | Search term for name or email |
| `role` | string | No | Filter by role: `Moderator`, `Staff`, `Client`, `Lead Generator` |
| `status` | string | No | Filter by status: `active`, `inactive` |
| `sort` | string | No | Sort field: `name`, `email`, `role`, `created_at` (default: created_at) |
| `order` | string | No | Sort order: `asc`, `desc` (default: desc) |

### Request Example
```http
GET /api/v1/team-members?page=1&limit=10&search=john&role=Staff&status=active
```

### Response Format
```json
{
  "success": true,
  "message": "Team members retrieved successfully",
  "data": {
    "members": [
      {
        "id": "uuid-string",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "profilePicture": "https://example.com/path/to/image.jpg",
        "role": "Staff",
        "listingsCount": 25,
        "isActive": true,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-20T14:45:00Z",
        "lastLoginAt": "2024-01-22T09:15:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPreviousPage": false
    },
    "summary": {
      "totalMembers": 25,
      "activeMembers": 20,
      "inactiveMembers": 5,
      "roleDistribution": {
        "Moderator": 2,
        "Staff": 15,
        "Client": 7,
        "Lead Generator": 1
      }
    }
  }
}
```

### Error Responses
```json
{
  "success": false,
  "message": "Invalid role filter provided",
  "errors": {
    "role": "Role must be one of: Moderator, Staff, Client, Lead Generator"
  }
}
```

---

## 2. Get Single Team Member

### Endpoint
```http
GET /api/v1/team-members/{id}
```

### Description
Retrieves detailed information about a specific team member.

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Team member UUID |

### Response Format
```json
{
  "success": true,
  "message": "Team member retrieved successfully",
  "data": {
    "member": {
      "id": "uuid-string",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "profilePicture": "https://example.com/path/to/image.jpg",
      "role": "Staff",
      "listingsCount": 25,
      "isActive": true,
      "permissions": {
        "manageGoogleAccount": "edit",
        "manageGMBTags": "view",
        "bulkActions": "hide",
        "manageReports": "edit"
      },
      "listingAccess": {
        "allowAccess": true,
        "listings": [
          {
            "id": "listing-uuid",
            "name": "Restaurant ABC",
            "account": "Account 1",
            "hasAccess": true
          }
        ]
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T14:45:00Z",
      "lastLoginAt": "2024-01-22T09:15:00Z"
    }
  }
}
```

---

## 3. Create Team Member

### Endpoint
```http
POST /api/v1/team-members
```

### Description
Creates a new team member with specified role and permissions.

### Request Body
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "password": "SecurePassword123!",
  "role": "Staff",
  "profilePicture": "base64-encoded-image-or-url",
  "permissions": {
    "manageGoogleAccount": "view",
    "manageGMBTags": "edit",
    "bulkActions": "hide"
  },
  "listingAccess": {
    "allowAccess": true,
    "listingIds": ["listing-uuid-1", "listing-uuid-2"]
  },
  "sendWelcomeEmail": true
}
```

### Field Validation
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `firstName` | string | Yes | 2-50 characters |
| `lastName` | string | Yes | 2-50 characters |
| `email` | string | Yes | Valid email format, unique |
| `password` | string | Yes | Min 8 chars, 1 uppercase, 1 lowercase, 1 number |
| `role` | string | Yes | One of: Moderator, Staff, Client, Lead Generator |
| `profilePicture` | string | No | Base64 or valid URL |
| `permissions` | object | No | Permission name: access level pairs |
| `listingAccess` | object | No | Listing access configuration |

### Response Format
```json
{
  "success": true,
  "message": "Team member created successfully",
  "data": {
    "member": {
      "id": "new-uuid-string",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "profilePicture": "https://example.com/path/to/image.jpg",
      "role": "Staff",
      "isActive": true,
      "createdAt": "2024-01-23T10:30:00Z"
    },
    "temporaryPassword": "TempPass123!",
    "loginUrl": "https://app.example.com/login"
  }
}
```

### Error Responses
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Email already exists",
    "password": "Password must contain at least 8 characters"
  }
}
```

---

## 4. Update Team Member

### Endpoint
```http
PUT /api/v1/team-members/{id}
```

### Description
Updates an existing team member's information, permissions, and access.

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Team member UUID |

### Request Body
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@example.com",
  "password": "NewPassword123!",
  "role": "Moderator",
  "profilePicture": "base64-encoded-image-or-url",
  "isActive": true,
  "permissions": {
    "manageGoogleAccount": "edit",
    "manageGMBTags": "view",
    "bulkActions": "hide"
  },
  "listingAccess": {
    "allowAccess": true,
    "listingIds": ["listing-uuid-1", "listing-uuid-3"]
  }
}
```

### Response Format
```json
{
  "success": true,
  "message": "Team member updated successfully",
  "data": {
    "member": {
      "id": "uuid-string",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane.doe@example.com",
      "profilePicture": "https://example.com/path/to/image.jpg",
      "role": "Moderator",
      "isActive": true,
      "updatedAt": "2024-01-23T15:45:00Z"
    }
  }
}
```

---

## 5. Delete Team Member

### Endpoint
```http
DELETE /api/v1/team-members/{id}
```

### Description
Permanently deletes a team member and removes all associated permissions.

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Team member UUID |

### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `transferData` | boolean | No | Whether to transfer member's data to another user |
| `transferToId` | string | No | UUID of user to transfer data to (required if transferData=true) |

### Response Format
```json
{
  "success": true,
  "message": "Team member deleted successfully",
  "data": {
    "deletedMemberId": "uuid-string",
    "dataTransferred": true,
    "transferredToId": "another-uuid"
  }
}
```

---

## 6. Get Available Permissions

### Endpoint
```http
GET /api/v1/team-members/permissions
```

### Description
Retrieves the list of all available permissions that can be assigned to team members.

### Response Format
```json
{
  "success": true,
  "message": "Permissions retrieved successfully",
  "data": {
    "permissions": [
      {
        "key": "manageGoogleAccount",
        "name": "Manage Google Account",
        "category": "Account Management",
        "description": "Ability to connect and manage Google accounts",
        "accessLevels": ["view", "edit", "hide"]
      },
      {
        "key": "manageGMBTags",
        "name": "Manage GMB Tags",
        "category": "GMB Management",
        "description": "Create and manage Google My Business tags",
        "accessLevels": ["view", "edit", "hide"]
      }
    ],
    "categories": [
      "Account Management",
      "GMB Management",
      "Reports",
      "Social Media",
      "Analytics"
    ]
  }
}
```

---

## 7. Bulk Operations

### Update Multiple Team Members
```http
PATCH /api/v1/team-members/bulk
```

### Request Body
```json
{
  "operation": "update_status",
  "memberIds": ["uuid-1", "uuid-2", "uuid-3"],
  "data": {
    "isActive": false
  }
}
```

### Delete Multiple Team Members
```http
DELETE /api/v1/team-members/bulk
```

### Request Body
```json
{
  "memberIds": ["uuid-1", "uuid-2"],
  "transferData": true,
  "transferToId": "admin-uuid"
}
```

---

## 8. Team Member Statistics

### Endpoint
```http
GET /api/v1/team-members/statistics
```

### Description
Provides comprehensive statistics about team members.

### Response Format
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalMembers": 25,
      "activeMembers": 20,
      "inactiveMembers": 5,
      "newThisMonth": 3
    },
    "roleDistribution": {
      "Moderator": 2,
      "Staff": 15,
      "Client": 7,
      "Lead Generator": 1
    },
    "activityStats": {
      "loggedInLast7Days": 18,
      "loggedInLast30Days": 22,
      "neverLoggedIn": 3
    },
    "permissionUsage": {
      "mostUsedPermissions": [
        "manageReports",
        "viewInsights",
        "managePosts"
      ]
    }
  }
}
```

---

## Error Codes

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | `VALIDATION_ERROR` | Request validation failed |
| 401 | `UNAUTHORIZED` | Invalid or missing authentication |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 404 | `MEMBER_NOT_FOUND` | Team member not found |
| 409 | `EMAIL_EXISTS` | Email already in use |
| 422 | `UNPROCESSABLE_ENTITY` | Business logic validation failed |
| 500 | `INTERNAL_ERROR` | Server error |

---

## Rate Limiting
- **GET endpoints**: 100 requests per minute per user
- **POST/PUT/DELETE endpoints**: 30 requests per minute per user
- **Bulk operations**: 10 requests per minute per user

---

## Webhooks (Optional)

### Team Member Events
```json
{
  "event": "team_member.created",
  "timestamp": "2024-01-23T10:30:00Z",
  "data": {
    "memberId": "uuid-string",
    "email": "jane.smith@example.com",
    "role": "Staff"
  }
}
```

Available events:
- `team_member.created`
- `team_member.updated`
- `team_member.deleted`
- `team_member.login`
- `team_member.permission_changed`

---

## Implementation Notes

1. **Password Security**: All passwords should be hashed using bcrypt with minimum 12 rounds
2. **Email Verification**: Send verification emails for new team members
3. **Audit Logging**: Log all team member operations for security and compliance
4. **Profile Pictures**: Support both file uploads and base64 encoding
5. **Permission Inheritance**: Consider role-based permission templates
6. **Data Export**: Provide CSV/Excel export functionality for team member lists
7. **Two-Factor Authentication**: Consider implementing 2FA for enhanced security

---

## Testing Endpoints

For development and testing purposes, you can use tools like Postman or curl to test these endpoints. Ensure you have proper authentication tokens and test data setup.