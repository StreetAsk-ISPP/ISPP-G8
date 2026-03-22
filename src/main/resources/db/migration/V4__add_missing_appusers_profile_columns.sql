-- Backfill for environments that already had appusers before Flyway was introduced.
-- V1 uses CREATE TABLE IF NOT EXISTS and cannot alter existing tables.

ALTER TABLE appusers
    ADD COLUMN IF NOT EXISTS bio VARCHAR(255) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS profile_picture_url LONGTEXT;
