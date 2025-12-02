-- Migration: Create platform_accounts table
-- This stores main OAuth connections and API credentials for each platform
-- Depends on: 001_create_platform_auth_config_table.sql

CREATE TABLE platform_accounts (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    
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
    
    -- Authentication Type
    auth_type ENUM('oauth2', 'api_key', 'app_credentials') NOT NULL DEFAULT 'oauth2',
    
    -- External Platform Data
    platform_user_id VARCHAR(255) NOT NULL,
    platform_username VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    profile_picture TEXT,
    
    -- Encrypted Credentials (JSON format)
    -- OAuth2: {"access_token": "xxx", "refresh_token": "xxx", "token_type": "Bearer"}
    -- API Key: {"api_key": "xxx", "api_secret": "xxx"}
    -- App Credentials: {"app_id": "xxx", "app_secret": "xxx", "access_token": "xxx"}
    credentials TEXT NOT NULL,
    
    -- Token Management
    token_expires_at DATETIME,
    token_type VARCHAR(50) DEFAULT 'Bearer',
    
    -- Account Status
    status ENUM('healthy', 'warning', 'error', 'disconnected') DEFAULT 'healthy',
    status_message VARCHAR(500),
    
    -- Error Tracking
    last_error TEXT,
    last_error_at DATETIME,
    
    -- Activity Tracking
    connected_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_refreshed_at DATETIME,
    last_used_at DATETIME,
    
    -- Metadata (JSON)
    -- Store additional platform-specific data
    metadata JSON,
    
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_user_platform (user_id, platform),
    INDEX idx_platform_user (platform, platform_user_id),
    INDEX idx_status (status),
    INDEX idx_token_expiry (token_expires_at),
    INDEX idx_last_used (last_used_at),
    
    -- Unique constraint: one account per platform per user
    UNIQUE KEY unique_user_platform_account (user_id, platform, platform_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comment for credentials field
ALTER TABLE platform_accounts 
MODIFY credentials TEXT NOT NULL 
COMMENT 'Encrypted JSON containing platform-specific credentials (access_token, refresh_token, api_key, app_id, app_secret, etc.)';
