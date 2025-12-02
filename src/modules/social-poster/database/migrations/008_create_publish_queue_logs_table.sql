-- Migration: Create publish_queue_logs table
-- This stores detailed logs for each queue job execution
-- Depends on: 006_create_post_targets_table.sql, 007_create_publish_queue_table.sql

CREATE TABLE publish_queue_logs (
    id CHAR(36) PRIMARY KEY,
    queue_id CHAR(36) NOT NULL,
    post_target_id CHAR(36) NOT NULL,
    
    -- Execution Details
    attempt_number INT UNSIGNED NOT NULL,
    status ENUM('started', 'success', 'failed', 'retry') NOT NULL,
    
    -- Log Data
    message TEXT,
    response_data JSON COMMENT 'Platform API response',
    error_details JSON COMMENT 'Error details if failed',
    
    -- Performance Metrics
    execution_time_ms INT UNSIGNED COMMENT 'Execution time in milliseconds',
    
    -- Worker Information
    worker_id VARCHAR(100),
    
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (queue_id) REFERENCES publish_queue(id) ON DELETE CASCADE,
    FOREIGN KEY (post_target_id) REFERENCES post_targets(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_queue_id (queue_id),
    INDEX idx_post_target (post_target_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at DESC),
    INDEX idx_attempt (queue_id, attempt_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
