-- Migration: Create post_analytics table (OPTIONAL - Phase 3)
-- This tracks post performance metrics from social platforms
-- Depends on: 006_create_post_targets_table.sql

CREATE TABLE post_analytics (
    id CHAR(36) PRIMARY KEY,
    post_target_id CHAR(36) NOT NULL,
    
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
    
    -- Engagement Metrics
    views INT UNSIGNED DEFAULT 0,
    impressions INT UNSIGNED DEFAULT 0,
    reach INT UNSIGNED DEFAULT 0,
    likes INT UNSIGNED DEFAULT 0,
    comments INT UNSIGNED DEFAULT 0,
    shares INT UNSIGNED DEFAULT 0,
    saves INT UNSIGNED DEFAULT 0,
    clicks INT UNSIGNED DEFAULT 0,
    
    -- Calculated Metrics
    engagement_rate DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Engagement rate percentage',
    click_through_rate DECIMAL(5,2) DEFAULT 0.00 COMMENT 'CTR percentage',
    
    -- Video Metrics (if applicable)
    video_views INT UNSIGNED DEFAULT 0,
    video_completion_rate DECIMAL(5,2) DEFAULT 0.00,
    average_watch_time INT UNSIGNED DEFAULT 0 COMMENT 'In seconds',
    
    -- Platform-specific Metrics (JSON)
    platform_metrics JSON COMMENT 'Store platform-specific metrics that don\'t fit standard fields',
    
    -- Sync Information
    synced_at DATETIME NOT NULL,
    sync_status ENUM('success', 'partial', 'failed') DEFAULT 'success',
    
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (post_target_id) REFERENCES post_targets(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_post_target (post_target_id),
    INDEX idx_platform (platform),
    INDEX idx_synced_at (synced_at DESC),
    INDEX idx_engagement_rate (engagement_rate DESC),
    INDEX idx_views (views DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
