-- Migration: Create post_targets table
-- This stores individual platform targets for each post
-- Depends on: 003_create_social_accounts_table.sql, 004_create_posts_table.sql

CREATE TABLE post_targets (
    id CHAR(36) PRIMARY KEY,
    post_id CHAR(36) NOT NULL,
    social_account_id CHAR(36) NOT NULL,
    
    -- Platform Information
    platform ENUM(
        'facebook', 
        'instagram', 
        'twitter', 
        'linkedin', 
        'threads',
        'pinterest', 
        'youtube'
    ) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    
    -- Target Status
    status ENUM('draft', 'scheduled', 'publishing', 'published', 'failed') DEFAULT 'draft',
    
    -- Scheduling
    scheduled_for DATETIME,
    
    -- Publishing Results
    published_url TEXT,
    published_at DATETIME,
    platform_post_id VARCHAR(255) COMMENT 'Post ID from the social platform',
    
    -- Error Tracking
    error_message TEXT,
    error_code VARCHAR(50),
    error_details JSON,
    
    -- Retry Logic
    retry_count INT UNSIGNED DEFAULT 0,
    last_retry_at DATETIME,
    max_retries INT UNSIGNED DEFAULT 3,
    
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (social_account_id) REFERENCES social_accounts(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_post_id (post_id),
    INDEX idx_social_account (social_account_id),
    INDEX idx_status (status),
    INDEX idx_platform_status (platform, status),
    INDEX idx_scheduled (scheduled_for),
    INDEX idx_published_at (published_at DESC),
    INDEX idx_retry (retry_count, last_retry_at),
    INDEX idx_platform_post_id (platform, platform_post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
