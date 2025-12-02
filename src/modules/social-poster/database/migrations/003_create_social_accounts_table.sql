-- Migration: Create social_accounts table
-- This stores sub-accounts like Facebook Pages, Instagram Business accounts, etc.
-- Depends on: 002_create_platform_accounts_table.sql

CREATE TABLE social_accounts (
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
    
    -- Account Type
    account_type ENUM('profile', 'page', 'business', 'group', 'channel') DEFAULT 'profile',
    
    -- External Platform Data
    platform_account_id_external VARCHAR(255) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    username VARCHAR(255),
    profile_picture TEXT,
    follower_count INT UNSIGNED DEFAULT 0,
    
    -- Account Status
    status ENUM('healthy', 'warning', 'error', 'disconnected') DEFAULT 'healthy',
    status_message VARCHAR(500),
    
    -- Credentials (for sub-accounts that need their own tokens)
    has_own_credentials TINYINT(1) DEFAULT 0,
    credentials TEXT,
    
    -- Activity Tracking
    connected_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_refreshed_at DATETIME,
    last_synced_at DATETIME,
    
    -- Capabilities stored as JSON
    capabilities JSON,
    -- Example: {"canPost": true, "canSchedule": true, "canUploadMedia": true, "maxMediaCount": 10, "maxCharacters": 3000}
    
    -- Metadata (JSON)
    -- Store additional platform-specific data
    metadata JSON,
    
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (platform_account_id) REFERENCES platform_accounts(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_platform_account (platform_account_id),
    INDEX idx_platform (platform),
    INDEX idx_account_type (account_type),
    INDEX idx_status (status),
    INDEX idx_follower_count (follower_count DESC),
    
    -- Unique constraint
    UNIQUE KEY unique_platform_external_id (platform, platform_account_id_external)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comment for credentials field
ALTER TABLE social_accounts 
MODIFY credentials TEXT 
COMMENT 'Encrypted JSON containing sub-account specific credentials (e.g., Page Access Token for Facebook Pages)';
