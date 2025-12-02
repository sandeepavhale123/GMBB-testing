-- Migration: Create posts table
-- This stores the main content and status of posts
-- No dependencies on other social poster tables

CREATE TABLE posts (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    
    -- Content
    content TEXT NOT NULL,
    
    -- Post Status
    status ENUM('draft', 'scheduled', 'publishing', 'published', 'failed') DEFAULT 'draft',
    
    -- Scheduling
    scheduled_for DATETIME,
    
    -- Aggregated counts (denormalized for performance)
    published_count INT UNSIGNED DEFAULT 0,
    failed_count INT UNSIGNED DEFAULT 0,
    pending_count INT UNSIGNED DEFAULT 0,
    total_targets INT UNSIGNED DEFAULT 0,
    
    -- Platform-specific options stored as JSON
    platform_options JSON,
    -- Example: {"facebook": {"asAdmin": true}, "linkedin": {"postAsArticle": false}}
    
    -- Timestamps
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    published_at DATETIME,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_user_status (user_id, status),
    INDEX idx_user_created (user_id, created_at DESC),
    INDEX idx_status (status),
    INDEX idx_scheduled (scheduled_for),
    INDEX idx_created_at (created_at DESC),
    INDEX idx_published_at (published_at DESC),
    
    -- Full-text search on content
    FULLTEXT INDEX ft_content (content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comments
ALTER TABLE posts 
MODIFY platform_options JSON 
COMMENT 'Platform-specific posting options (e.g., post as admin, enable replies, post as article)';
