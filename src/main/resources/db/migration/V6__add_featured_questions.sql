-- Add featured flag to questions and seed 4 permanent featured questions in Seville.

ALTER TABLE questions ADD COLUMN `featured` bit(1) DEFAULT b'0';

-- Seed user: uses user1 (bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb) as creator

-- Centro (Plaza Nueva)
INSERT INTO questions (id, creator_id, event_id, title, content, latitude, longitude, radius_km, active, featured, expires_at, created_at, answer_count)
VALUES (
    UUID_TO_BIN('dd000000-0000-0000-0000-000000000001'),
    UUID_TO_BIN('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    NULL,
    'What is the best night plan in Seville? 🍻',
    'Cocktail bars, terraces, flamenco shows... what is the real Seville nightlife like?',
    37.3891, -5.9847, 50.0, TRUE, TRUE, '2099-12-31 23:59:59', CURRENT_TIMESTAMP, 0
)
AS incoming
ON DUPLICATE KEY UPDATE title=incoming.title, content=incoming.content, latitude=incoming.latitude, longitude=incoming.longitude, featured=incoming.featured, active=incoming.active, expires_at=incoming.expires_at;

-- Estadio Benito Villamarín (Betis)
INSERT INTO questions (id, creator_id, event_id, title, content, latitude, longitude, radius_km, active, featured, expires_at, created_at, answer_count)
VALUES (
    UUID_TO_BIN('dd000000-0000-0000-0000-000000000002'),
    UUID_TO_BIN('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    NULL,
    'Betis or Sevilla? 😏',
    'You are in front of Villamarin. There is no middle ground here. Which side are you on?',
    37.3564, -5.9812, 50.0, TRUE, TRUE, '2099-12-31 23:59:59', CURRENT_TIMESTAMP, 0
)
AS incoming
ON DUPLICATE KEY UPDATE title=incoming.title, content=incoming.content, latitude=incoming.latitude, longitude=incoming.longitude, featured=incoming.featured, active=incoming.active, expires_at=incoming.expires_at;

-- Reina Mercedes
INSERT INTO questions (id, creator_id, event_id, title, content, latitude, longitude, radius_km, active, featured, expires_at, created_at, answer_count)
VALUES (
    UUID_TO_BIN('dd000000-0000-0000-0000-000000000003'),
    UUID_TO_BIN('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    NULL,
    'Do you like someone at Reina? 😳',
    'Come on, confess... is there someone on campus that makes you nervous every time you see them? 👀',
    37.3580, -5.9866, 50.0, TRUE, TRUE, '2099-12-31 23:59:59', CURRENT_TIMESTAMP, 0
)
AS incoming
ON DUPLICATE KEY UPDATE title=incoming.title, content=incoming.content, latitude=incoming.latitude, longitude=incoming.longitude, featured=incoming.featured, active=incoming.active, expires_at=incoming.expires_at;

-- Triana
INSERT INTO questions (id, creator_id, event_id, title, content, latitude, longitude, radius_km, active, featured, expires_at, created_at, answer_count)
VALUES (
    UUID_TO_BIN('dd000000-0000-0000-0000-000000000004'),
    UUID_TO_BIN('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    NULL,
    'Who is going out partying tonight? 🎉',
    'Do you have plans tonight or are you staying home? Come on and tell us...',
    37.3840, -6.0028, 50.0, TRUE, TRUE, '2099-12-31 23:59:59', CURRENT_TIMESTAMP, 0
)
AS incoming
ON DUPLICATE KEY UPDATE title=incoming.title, content=incoming.content, latitude=incoming.latitude, longitude=incoming.longitude, featured=incoming.featured, active=incoming.active, expires_at=incoming.expires_at;
