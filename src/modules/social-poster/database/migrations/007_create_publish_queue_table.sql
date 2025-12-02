-- Migration: Create publish_queue table
-- This is the job queue for publishing posts to social media platforms
-- Depends on: 004_create_posts_table.sql, 006_create_post_targets_table.sql

CREATE TABLE publish_queue (
    id CHAR(36) PRIMARY KEY,
    post_target_id CHAR(36) NOT NULL,
    post_id CHAR(36) NOT NULL,
    
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
    
    -- Queue Status
    status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    priority INT DEFAULT 5 COMMENT '1 (highest priority) to 10 (lowest priority)',
    
    -- Scheduling
    scheduled_for DATETIME NOT NULL,
    started_at DATETIME,
    completed_at DATETIME,
    
    -- Retry Logic
    attempts INT UNSIGNED DEFAULT 0,
    max_attempts INT UNSIGNED DEFAULT 3,
    next_retry_at DATETIME,
    backoff_multiplier DECIMAL(3,2) DEFAULT 2.0 COMMENT 'Exponential backoff multiplier',
    
    -- Error Tracking
    error_message TEXT,
    error_code VARCHAR(50),
    error_details JSON,
    
    -- Worker Tracking (for distributed processing)
    worker_id VARCHAR(100),
    locked_at DATETIME,
    locked_until DATETIME,
    
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (post_target_id) REFERENCES post_targets(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    
    -- Indexes (CRITICAL for queue performance)
    INDEX idx_status_priority_scheduled (status, priority ASC, scheduled_for ASC),
    INDEX idx_next_retry (status, next_retry_at),
    INDEX idx_locked (status, locked_until),
    INDEX idx_post_target (post_target_id),
    INDEX idx_platform_status (platform, status),
    INDEX idx_created_at (created_at DESC),
    INDEX idx_worker (worker_id, status),
    
    -- Composite index for queue polling (MOST IMPORTANT)
    INDEX idx_queue_poll (status, scheduled_for, priority, locked_until)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comments
ALTER TABLE publish_queue 
MODIFY backoff_multiplier DECIMAL(3,2) DEFAULT 2.0 
COMMENT 'Used to calculate exponential backoff: next_retry = now + (base_delay * pow(backoff_multiplier, attempts))';
