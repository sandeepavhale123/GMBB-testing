-- Migration: Create post_media table
-- This stores media files (images, videos) associated with posts
-- Depends on: 004_create_posts_table.sql

CREATE TABLE post_media (
    id CHAR(36) PRIMARY KEY,
    post_id CHAR(36) NOT NULL,
    
    -- Media Information
    media_url TEXT NOT NULL,
    media_type ENUM('image', 'video', 'gif') NOT NULL,
    
    -- File Metadata
    file_size INT UNSIGNED,
    width INT UNSIGNED,
    height INT UNSIGNED,
    duration INT UNSIGNED COMMENT 'For videos, in seconds',
    mime_type VARCHAR(100),
    
    -- Thumbnail for videos
    thumbnail_url TEXT,
    
    -- Display Order
    display_order INT UNSIGNED DEFAULT 0,
    
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_post_id (post_id),
    INDEX idx_media_type (media_type),
    INDEX idx_display_order (post_id, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
