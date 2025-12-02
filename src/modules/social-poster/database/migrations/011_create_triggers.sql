-- Migration: Create triggers for automatic updates
-- This creates triggers to maintain denormalized data and automate common tasks

-- ============================================================================
-- Trigger 1: Update post counts when post_target status changes
-- ============================================================================
DELIMITER $$

CREATE TRIGGER update_post_counts_after_target_update
AFTER UPDATE ON post_targets
FOR EACH ROW
BEGIN
    -- Only update if status changed
    IF OLD.status != NEW.status THEN
        UPDATE posts SET
            published_count = (
                SELECT COUNT(*) 
                FROM post_targets 
                WHERE post_id = NEW.post_id AND status = 'published'
            ),
            failed_count = (
                SELECT COUNT(*) 
                FROM post_targets 
                WHERE post_id = NEW.post_id AND status = 'failed'
            ),
            pending_count = (
                SELECT COUNT(*) 
                FROM post_targets 
                WHERE post_id = NEW.post_id AND status IN ('draft', 'scheduled')
            ),
            updated_at = NOW()
        WHERE id = NEW.post_id;
        
        -- Update overall post status based on targets
        UPDATE posts p
        SET p.status = CASE
            -- All targets published = post published
            WHEN (SELECT COUNT(*) FROM post_targets WHERE post_id = NEW.post_id AND status = 'published') = p.total_targets
                THEN 'published'
            -- Any target failed = post failed
            WHEN (SELECT COUNT(*) FROM post_targets WHERE post_id = NEW.post_id AND status = 'failed') > 0
                THEN 'failed'
            -- Any target publishing = post publishing
            WHEN (SELECT COUNT(*) FROM post_targets WHERE post_id = NEW.post_id AND status = 'publishing') > 0
                THEN 'publishing'
            -- Otherwise scheduled
            ELSE 'scheduled'
        END
        WHERE id = NEW.post_id;
    END IF;
END$$

DELIMITER ;

-- ============================================================================
-- Trigger 2: Update post counts when new post_target is inserted
-- ============================================================================
DELIMITER $$

CREATE TRIGGER update_post_counts_after_target_insert
AFTER INSERT ON post_targets
FOR EACH ROW
BEGIN
    UPDATE posts SET
        total_targets = total_targets + 1,
        pending_count = pending_count + 1,
        updated_at = NOW()
    WHERE id = NEW.post_id;
END$$

DELIMITER ;

-- ============================================================================
-- Trigger 3: Update post counts when post_target is deleted
-- ============================================================================
DELIMITER $$

CREATE TRIGGER update_post_counts_after_target_delete
AFTER DELETE ON post_targets
FOR EACH ROW
BEGIN
    UPDATE posts SET
        total_targets = total_targets - 1,
        published_count = CASE WHEN OLD.status = 'published' THEN published_count - 1 ELSE published_count END,
        failed_count = CASE WHEN OLD.status = 'failed' THEN failed_count - 1 ELSE failed_count END,
        pending_count = CASE WHEN OLD.status IN ('draft', 'scheduled') THEN pending_count - 1 ELSE pending_count END,
        updated_at = NOW()
    WHERE id = OLD.post_id;
END$$

DELIMITER ;

-- ============================================================================
-- Trigger 4: Update platform_accounts last_used_at when used
-- ============================================================================
DELIMITER $$

CREATE TRIGGER update_platform_account_last_used
AFTER INSERT ON publish_queue
FOR EACH ROW
BEGIN
    UPDATE platform_accounts pa
    INNER JOIN social_accounts sa ON pa.id = sa.platform_account_id
    INNER JOIN post_targets pt ON sa.id = pt.social_account_id
    SET pa.last_used_at = NOW()
    WHERE pt.id = NEW.post_target_id;
END$$

DELIMITER ;

-- ============================================================================
-- Trigger 5: Set published_at timestamp when post becomes published
-- ============================================================================
DELIMITER $$

CREATE TRIGGER set_post_published_at
BEFORE UPDATE ON posts
FOR EACH ROW
BEGIN
    IF OLD.status != 'published' AND NEW.status = 'published' AND NEW.published_at IS NULL THEN
        SET NEW.published_at = NOW();
    END IF;
END$$

DELIMITER ;
