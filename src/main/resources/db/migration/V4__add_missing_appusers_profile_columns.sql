-- Backfill for environments that already had appusers before Flyway was introduced.
-- V1 uses CREATE TABLE IF NOT EXISTS and cannot alter existing tables.

SET @add_bio_sql = (
    SELECT IF(
        EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = DATABASE()
              AND table_name = 'appusers'
              AND column_name = 'bio'
        ),
        'SELECT 1',
        'ALTER TABLE appusers ADD COLUMN bio VARCHAR(255) DEFAULT NULL'
    )
);
PREPARE add_bio_stmt FROM @add_bio_sql;
EXECUTE add_bio_stmt;
DEALLOCATE PREPARE add_bio_stmt;

SET @add_profile_picture_sql = (
    SELECT IF(
        EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = DATABASE()
              AND table_name = 'appusers'
              AND column_name = 'profile_picture_url'
        ),
        'SELECT 1',
        'ALTER TABLE appusers ADD COLUMN profile_picture_url LONGTEXT'
    )
);
PREPARE add_profile_picture_stmt FROM @add_profile_picture_sql;
EXECUTE add_profile_picture_stmt;
DEALLOCATE PREPARE add_profile_picture_stmt;
