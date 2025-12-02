# Social Poster Database Migrations

This directory contains SQL migration files for the Social Poster module database schema.

## Migration Order

**IMPORTANT:** Execute migrations in the following order due to foreign key dependencies:

1. `001_create_platform_auth_config_table.sql` - Platform configuration (no dependencies)
2. `002_create_platform_accounts_table.sql` - Main OAuth connections
3. `003_create_social_accounts_table.sql` - Sub-accounts (depends on #2)
4. `004_create_posts_table.sql` - Main posts (no dependencies)
5. `005_create_post_media_table.sql` - Post media (depends on #4)
6. `006_create_post_targets_table.sql` - Platform targets (depends on #3, #4)
7. `007_create_publish_queue_table.sql` - Publishing queue (depends on #4, #6)
8. `008_create_publish_queue_logs_table.sql` - Queue logs (depends on #6, #7)
9. `009_create_api_rate_limits_table.sql` - Rate limiting (depends on #2)
10. `010_create_post_analytics_table.sql` - Analytics (optional, depends on #6)
11. `011_create_triggers.sql` - Database triggers (must be last)

## CodeIgniter 3 Migration Setup

### Option 1: Using CI3 Database Forge (Recommended)

Convert these SQL files to CI3 migration format:

```php
// application/migrations/001_create_social_poster_tables.php
class Migration_Create_social_poster_tables extends CI_Migration {
    public function up() {
        // Load SQL file and execute
        $sql = file_get_contents(APPPATH . '../src/modules/social-poster/database/migrations/001_create_platform_auth_config_table.sql');
        $this->db->query($sql);
    }
    
    public function down() {
        $this->db->query('DROP TABLE IF EXISTS platform_auth_config');
    }
}
```

### Option 2: Direct SQL Execution

Execute SQL files directly in order using phpMyAdmin, MySQL Workbench, or command line:

```bash
mysql -u username -p database_name < 001_create_platform_auth_config_table.sql
mysql -u username -p database_name < 002_create_platform_accounts_table.sql
# ... continue in order
```

### Option 3: CI3 Migration Controller

Create a custom migration controller:

```php
// application/controllers/Migrate.php
class Migrate extends CI_Controller {
    public function execute_social_poster_migrations() {
        $migration_files = [
            '001_create_platform_auth_config_table.sql',
            '002_create_platform_accounts_table.sql',
            // ... add all files in order
        ];
        
        $migration_path = FCPATH . 'src/modules/social-poster/database/migrations/';
        
        foreach ($migration_files as $file) {
            $sql = file_get_contents($migration_path . $file);
            if ($this->db->query($sql)) {
                echo "✓ {$file} executed successfully<br>";
            } else {
                echo "✗ {$file} failed<br>";
                break;
            }
        }
    }
}
```

## Database Schema Overview

### Core Tables

- **platform_auth_config**: Platform-specific OAuth/API configuration
- **platform_accounts**: Main OAuth connections per user
- **social_accounts**: Sub-accounts (Facebook Pages, Instagram Business, etc.)
- **posts**: Main content and status
- **post_media**: Images/videos attached to posts
- **post_targets**: Individual platform targets for each post

### Queue System Tables

- **publish_queue**: Job queue for publishing posts
- **publish_queue_logs**: Detailed execution logs
- **api_rate_limits**: Track API rate limits

### Analytics Tables (Optional)

- **post_analytics**: Post performance metrics

## Key Features

### 1. Flexible Authentication

Supports multiple authentication methods:
- OAuth 2.0 (most platforms)
- API Keys (some platforms)
- App ID + App Secret (Facebook, Instagram)

Credentials stored as encrypted JSON in `platform_accounts.credentials` field.

### 2. Queue System

- Priority-based job processing
- Exponential backoff retry logic
- Worker locking for distributed processing
- Comprehensive logging

### 3. Performance Optimization

- Denormalized counts in `posts` table
- Strategic indexing for common queries
- Full-text search on post content
- Composite indexes for queue polling

### 4. Automated Triggers

- Auto-update post counts when targets change
- Auto-set published_at timestamp
- Track platform account usage

## Security Considerations

### 1. Credential Encryption

**CRITICAL:** Encrypt credentials before storing:

```php
// In your model
$credentials = [
    'access_token' => $access_token,
    'refresh_token' => $refresh_token,
];

$encrypted_credentials = $this->encryption->encrypt(json_encode($credentials));
```

### 2. Token Expiry Management

Monitor `token_expires_at` and refresh tokens before expiry:

```sql
-- Find accounts with expiring tokens (within 7 days)
SELECT * FROM platform_accounts 
WHERE token_expires_at <= DATE_ADD(NOW(), INTERVAL 7 DAY)
AND status = 'healthy';
```

### 3. Rate Limit Protection

Check rate limits before queuing jobs:

```php
$rate_limit = $this->db
    ->where('platform_account_id', $account_id)
    ->where('endpoint', '/posts/publish')
    ->get('api_rate_limits')
    ->row();

if ($rate_limit->remaining < 1 && $rate_limit->reset_at > date('Y-m-d H:i:s')) {
    // Don't queue job, wait for reset
}
```

## Queue Worker Example

### Queue Polling Query

```sql
SELECT pq.*, pt.platform, pt.account_name, p.content, p.user_id
FROM publish_queue pq
INNER JOIN post_targets pt ON pq.post_target_id = pt.id
INNER JOIN posts p ON pq.post_id = p.id
WHERE pq.status = 'pending'
  AND pq.scheduled_for <= NOW()
  AND (pq.locked_until IS NULL OR pq.locked_until < NOW())
ORDER BY pq.priority ASC, pq.scheduled_for ASC
LIMIT 10
FOR UPDATE SKIP LOCKED;
```

### Lock Job Before Processing

```sql
UPDATE publish_queue
SET status = 'processing',
    worker_id = 'worker-123',
    locked_at = NOW(),
    locked_until = DATE_ADD(NOW(), INTERVAL 5 MINUTE),
    attempts = attempts + 1,
    started_at = NOW()
WHERE id = '{job_id}';
```

### Success Path

```sql
UPDATE publish_queue 
SET status = 'completed', completed_at = NOW() 
WHERE id = '{job_id}';

UPDATE post_targets 
SET status = 'published', 
    published_at = NOW(), 
    published_url = '{url}',
    platform_post_id = '{platform_id}'
WHERE id = '{target_id}';
```

### Retry Path (with Exponential Backoff)

```sql
UPDATE publish_queue
SET status = 'pending',
    next_retry_at = DATE_ADD(NOW(), INTERVAL POW(backoff_multiplier, attempts) MINUTE),
    error_message = '{error}',
    error_code = '{code}',
    locked_at = NULL,
    locked_until = NULL
WHERE id = '{job_id}' AND attempts < max_attempts;
```

### Permanent Failure

```sql
UPDATE publish_queue 
SET status = 'failed', completed_at = NOW() 
WHERE id = '{job_id}';

UPDATE post_targets 
SET status = 'failed', 
    error_message = '{error}',
    error_code = '{code}'
WHERE id = '{target_id}';
```

## Sample Data Queries

### Get User's Posts with Targets

```sql
SELECT 
    p.*,
    COUNT(pt.id) as target_count,
    GROUP_CONCAT(DISTINCT pt.platform) as platforms
FROM posts p
LEFT JOIN post_targets pt ON p.id = pt.post_id
WHERE p.user_id = '{user_id}'
GROUP BY p.id
ORDER BY p.created_at DESC;
```

### Dashboard Stats

```sql
SELECT 
    COUNT(*) as total_scheduled,
    SUM(CASE WHEN DATE(published_at) = CURDATE() THEN 1 ELSE 0 END) as published_today,
    (SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) / COUNT(*)) * 100 as success_rate,
    SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_posts
FROM posts
WHERE user_id = '{user_id}';
```

### Platform Stats

```sql
SELECT 
    pt.platform,
    COUNT(DISTINCT pt.social_account_id) as connected_accounts,
    COUNT(CASE WHEN p.status = 'scheduled' THEN 1 END) as total_scheduled,
    COUNT(CASE WHEN DATE(pt.published_at) = CURDATE() THEN 1 END) as published_today,
    (COUNT(CASE WHEN pt.status = 'published' THEN 1 END) / COUNT(*)) * 100 as success_rate,
    COUNT(CASE WHEN pt.status = 'failed' THEN 1 END) as failed_posts
FROM post_targets pt
INNER JOIN posts p ON pt.post_id = p.id
WHERE p.user_id = '{user_id}'
GROUP BY pt.platform;
```

## Rollback Procedure

To rollback all migrations:

```sql
DROP TRIGGER IF EXISTS update_post_counts_after_target_update;
DROP TRIGGER IF EXISTS update_post_counts_after_target_insert;
DROP TRIGGER IF EXISTS update_post_counts_after_target_delete;
DROP TRIGGER IF EXISTS update_platform_account_last_used;
DROP TRIGGER IF EXISTS set_post_published_at;

DROP TABLE IF EXISTS post_analytics;
DROP TABLE IF EXISTS api_rate_limits;
DROP TABLE IF EXISTS publish_queue_logs;
DROP TABLE IF EXISTS publish_queue;
DROP TABLE IF EXISTS post_targets;
DROP TABLE IF EXISTS post_media;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS social_accounts;
DROP TABLE IF EXISTS platform_accounts;
DROP TABLE IF EXISTS platform_auth_config;
```

## Testing Migrations

After running migrations, verify:

1. All tables created:
```sql
SHOW TABLES LIKE '%platform%' OR LIKE '%post%' OR LIKE '%publish%';
```

2. Indexes created:
```sql
SHOW INDEXES FROM publish_queue;
```

3. Triggers created:
```sql
SHOW TRIGGERS WHERE `Trigger` LIKE '%post%';
```

4. Foreign keys enforced:
```sql
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = DATABASE()
AND REFERENCED_TABLE_NAME IS NOT NULL;
```

## Support

For issues or questions about the database schema, refer to:
- Main PRD: `src/modules/social-poster/docs/PRD.md`
- API Documentation: `src/modules/social-poster/docs/API.md`
