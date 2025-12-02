-- Migration: Create platform_auth_config table
-- This stores platform-specific authentication configuration
-- Execute this first as it has no dependencies

CREATE TABLE platform_auth_config (
    id CHAR(36) PRIMARY KEY,
    platform ENUM(
        'facebook', 
        'instagram', 
        'twitter', 
        'linkedin', 
        'threads',
        'pinterest', 
        'youtube'
    ) NOT NULL UNIQUE,
    
    -- OAuth Configuration
    auth_type ENUM('oauth2', 'api_key', 'app_credentials') NOT NULL DEFAULT 'oauth2',
    client_id VARCHAR(255),
    client_secret VARCHAR(255),
    auth_url TEXT,
    token_url TEXT,
    redirect_uri TEXT,
    scope TEXT,
    
    -- API Configuration
    api_base_url VARCHAR(255),
    api_version VARCHAR(50),
    
    -- Rate Limiting
    rate_limit_per_hour INT UNSIGNED DEFAULT 100,
    rate_limit_per_day INT UNSIGNED DEFAULT 1000,
    
    -- Platform Capabilities (JSON)
    capabilities JSON,
    -- Example: {"supports_scheduling": true, "supports_video": true, "max_media_count": 10, "max_character_limit": 3000}
    
    -- Feature Flags
    is_active TINYINT(1) DEFAULT 1,
    supports_scheduling TINYINT(1) DEFAULT 1,
    supports_media_upload TINYINT(1) DEFAULT 1,
    supports_video TINYINT(1) DEFAULT 1,
    max_media_count INT UNSIGNED DEFAULT 10,
    max_character_limit INT UNSIGNED,
    
    -- Metadata
    documentation_url TEXT,
    notes TEXT,
    
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_platform (platform),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default platform configurations
INSERT INTO platform_auth_config (id, platform, auth_type, api_base_url, api_version, max_character_limit, max_media_count, capabilities) VALUES
(UUID(), 'facebook', 'oauth2', 'https://graph.facebook.com', 'v18.0', NULL, 10, '{"supports_scheduling": true, "supports_video": true, "supports_pages": true, "supports_groups": true}'),
(UUID(), 'instagram', 'oauth2', 'https://graph.instagram.com', 'v18.0', 2200, 10, '{"supports_scheduling": true, "supports_video": true, "supports_stories": true, "supports_reels": true}'),
(UUID(), 'twitter', 'oauth2', 'https://api.twitter.com', '2', 280, 4, '{"supports_scheduling": true, "supports_video": true, "supports_polls": true, "supports_threads": true}'),
(UUID(), 'linkedin', 'oauth2', 'https://api.linkedin.com', 'v2', 3000, 9, '{"supports_scheduling": true, "supports_video": true, "supports_documents": true, "supports_articles": true}'),
(UUID(), 'threads', 'oauth2', 'https://graph.threads.net', 'v1', 500, 10, '{"supports_scheduling": true, "supports_video": true, "linked_to_instagram": true}'),
(UUID(), 'pinterest', 'oauth2', 'https://api.pinterest.com', 'v5', 500, 5, '{"supports_scheduling": true, "supports_video": true, "supports_boards": true}'),
(UUID(), 'youtube', 'oauth2', 'https://www.googleapis.com/youtube', 'v3', 5000, 1, '{"supports_scheduling": true, "supports_video": true, "video_only": true, "supports_livestream": true}');
