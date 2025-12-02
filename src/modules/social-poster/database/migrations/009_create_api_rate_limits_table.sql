-- Migration: Create api_rate_limits table
-- This tracks API rate limits per platform account to prevent hitting platform limits
-- Depends on: 002_create_platform_accounts_table.sql

CREATE TABLE api_rate_limits (
    id CHAR(36) PRIMARY KEY,
    platform_account_id CHAR(36) NOT NULL,
    
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
    
    -- Endpoint Rate Limit
    endpoint VARCHAR(255) NOT NULL COMMENT 'API endpoint path',
    limit_value INT UNSIGNED NOT NULL COMMENT 'Maximum requests allowed',
    remaining INT UNSIGNED NOT NULL COMMENT 'Remaining requests',
    reset_at DATETIME NOT NULL COMMENT 'When the limit resets',
    
    -- Rate Limit Window
    window_type ENUM('minute', 'hour', 'day') DEFAULT 'hour',
    
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (platform_account_id) REFERENCES platform_accounts(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_platform_account (platform_account_id),
    INDEX idx_platform_endpoint (platform, endpoint),
    INDEX idx_reset_at (reset_at),
    INDEX idx_remaining (remaining),
    
    -- Unique constraint: one rate limit record per account and endpoint
    UNIQUE KEY unique_rate_limit (platform_account_id, endpoint)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
