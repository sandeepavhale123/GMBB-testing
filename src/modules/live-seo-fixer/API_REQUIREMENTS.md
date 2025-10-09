# API Requirements for Grouped Audit Results

## Overview
The Grouped Audit Results page requires several API endpoints to fetch categories, issues, and manage fix approvals with pagination support.

## Required API Endpoints

### 1. Fetch Issue Categories
**Endpoint:** `GET /live-seo-fixer/projects/{projectId}/audit-categories`

**Description:** Fetch all issue categories with their counts for a project

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "categories": [
      {
        "type": "title",
        "category_name": "Title Tags",
        "icon": "tag",
        "total_issues": 10,
        "fixed_issues": 9,
        "has_issues": true
      },
      {
        "type": "meta_description",
        "category_name": "Meta Description",
        "icon": "file-text",
        "total_issues": 10,
        "fixed_issues": 0,
        "has_issues": true
      },
      {
        "type": "image_alt",
        "category_name": "Missing Image Alt Text",
        "icon": "image",
        "total_issues": 26,
        "fixed_issues": 0,
        "has_issues": true
      },
      {
        "type": "links",
        "category_name": "Issues with Links",
        "icon": "link",
        "total_issues": 0,
        "fixed_issues": 0,
        "has_issues": false
      },
      {
        "type": "meta_keywords",
        "category_name": "Meta Keywords",
        "icon": "key",
        "total_issues": 10,
        "fixed_issues": 0,
        "has_issues": true
      },
      {
        "type": "heading_optimization",
        "category_name": "Heading Optimizations",
        "icon": "heading",
        "total_issues": 3,
        "fixed_issues": 0,
        "has_issues": true
      },
      {
        "type": "heading_length",
        "category_name": "Headings Length",
        "icon": "ruler",
        "total_issues": 17,
        "fixed_issues": 0,
        "has_issues": true
      },
      {
        "type": "canonical",
        "category_name": "Canonical Link",
        "icon": "link-2",
        "total_issues": 1,
        "fixed_issues": 0,
        "has_issues": true
      },
      {
        "type": "open_graph",
        "category_name": "Open Graph",
        "icon": "share-2",
        "total_issues": 30,
        "fixed_issues": 0,
        "has_issues": true
      },
      {
        "type": "twitter_card",
        "category_name": "Twitter Card",
        "icon": "twitter",
        "total_issues": 40,
        "fixed_issues": 0,
        "has_issues": true
      },
      {
        "type": "misc",
        "category_name": "Miscellaneous",
        "icon": "more-horizontal",
        "total_issues": 0,
        "fixed_issues": 0,
        "has_issues": false
      }
    ]
  }
}
```

### 2. Fetch Category Issues (Paginated)
**Endpoint:** `GET /live-seo-fixer/projects/{projectId}/audit-categories/{seoIssue.type}/issues`

**Query Parameters:**
- `page` (integer, default: 1): Current page number
- `per_page` (integer, default: 10): Items per page (max: 100)
- `filter` (string, optional): Filter by status ('approved', 'pending', 'all')

**Description:** Fetch paginated issues for a specific category

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "issues": [
      {
        "issue_id": "issue_123",
        "page_id": "page_456",
        "page_url": "/",
        "page_type": "home",
        "target_keyword": "AI Visibility",
        "severity": "high",
        "issue_type": "title",
        "original_value": "Missing",
        "suggested_fix": "LLMClicks.ai: AI Visibility Audits & SEO Optimization",
        "approved": false,
        "fix_status": "pending",
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T00:00:00Z"
      },
      {
        "issue_id": "issue_124",
        "page_id": "page_457",
        "page_url": "/pricing/",
        "page_type": "service",
        "target_keyword": "pricing",
        "severity": "medium",
        "issue_type": "title",
        "original_value": "Pricing",
        "suggested_fix": "LLMClicks Pricing: AI Plans for Individuals & Teams",
        "approved": true,
        "fix_status": "approved",
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total_items": 10,
      "total_pages": 1
    },
    "summary": {
      "total_approved": 9,
      "total_pending": 1,
      "ai_generations_used": 20,
      "ai_generations_limit": 500
    }
  }
}
```

### 3. Update Fix Value and Approval Status
**Endpoint:** `PUT /live-seo-fixer/projects/{projectId}/issues/{issueId}/fix`

**Request Body:**
```json
{
  "fix_value": "Updated suggested fix content",
  "approved": true
}
```

**Description:** Update the fix value and/or approval status for a specific issue

**Response:**
```json
{
  "code": 200,
  "message": "Fix updated successfully",
  "data": {
    "issue_id": "issue_123",
    "fix_value": "Updated suggested fix content",
    "approved": true,
    "updated_at": "2025-01-01T00:00:00Z"
  }
}
```

### 4. Bulk Approve Category Fixes
**Endpoint:** `POST /live-seo-fixer/projects/{projectId}/audit-categories/{seoIssue.type}/approve-all`

**Request Body:**
```json
{
  "approved": true
}
```

**Description:** Approve or unapprove all fixes in a category at once

**Response:**
```json
{
  "code": 200,
  "message": "All fixes in category approved successfully",
  "data": {
    "type": "title",
    "affected_issues": 10,
    "approved": true
  }
}
```

### 5. Regenerate Fix Suggestion (AI)
**Endpoint:** `POST /live-seo-fixer/projects/{projectId}/issues/{issueId}/regenerate`

**Request Body:**
```json
{
  "force_regenerate": true
}
```

**Description:** Trigger AI regeneration for a specific issue's suggested fix

**Response:**
```json
{
  "code": 200,
  "message": "Fix regenerated successfully",
  "data": {
    "issue_id": "issue_123",
    "suggested_fix": "New AI generated fix content",
    "ai_generations_used": 21,
    "ai_generations_limit": 500
  }
}
```

## Implementation Notes

### Loading Sequence
1. **Page Load:** 
   - Call `GET /audit-categories` to fetch all categories
   - Automatically select first category with issues
   - Call `GET /audit-categories/{firstIssueType}/issues?page=1&per_page=10` to load initial issues

2. **Category Selection:**
   - When user clicks a different category
   - Call `GET /audit-categories/{type}/issues?page=1&per_page=10`
   - Reset to page 1

3. **Pagination:**
   - When user changes page or items per page
   - Call `GET /audit-categories/{type}/issues?page={newPage}&per_page={newPerPage}`

4. **Filter Change:**
   - When user selects "Approved" or "Pending" tab
   - Call `GET /audit-categories/{type}/issues?page=1&per_page=10&filter={filterValue}`
   - Reset to page 1

### State Management
- Cache category list (rarely changes)
- Keep track of current category, page, per_page, and filter
- Store issues data with pagination info
- Update individual issue status optimistically in UI, then sync with API

### Error Handling
- Display toast notifications for API errors
- Show loading states during API calls
- Handle pagination edge cases (empty results, last page)
- Validate fix values before sending to API

### Performance Optimization
- Debounce rapid category switches
- Cache recently viewed category issues
- Lazy load category data as needed
- Use optimistic UI updates for better UX
