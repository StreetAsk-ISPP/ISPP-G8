-- Authorities seed data
-- MySQL/Aiven manual script in DBeaver:
-- INSERT INTO authorities(id, authority) VALUES (UUID_TO_BIN('11111111-1111-1111-1111-111111111111'), 'ADMIN');
-- INSERT INTO authorities(id, authority) VALUES (UUID_TO_BIN('22222222-2222-2222-2222-222222222222'), 'USER');
-- INSERT INTO authorities(id, authority) VALUES (UUID_TO_BIN('33333333-3333-3333-3333-333333333333'), 'BUSINESS');
INSERT INTO authorities(id, authority) VALUES ('11111111-1111-1111-1111-111111111111', 'ADMIN');
INSERT INTO authorities(id, authority) VALUES ('22222222-2222-2222-2222-222222222222', 'USER');
INSERT INTO authorities(id, authority) VALUES ('33333333-3333-3333-3333-333333333333', 'BUSINESS');

-- Admin user: admin1 / password: 4dm1n
-- MySQL/Aiven manual script in DBeaver:
-- INSERT INTO appusers(id, email, user_name, password, first_name, last_name, authority)
-- VALUES (
--     UUID_TO_BIN('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
--     'admin1@streetask.com',
--     'admin1',
--     '$2a$10$nMmTWAhPTqXqLDJTag3prumFrAJpsYtroxf0ojesFYq0k4PmcbWUS',
--     'Admin',
--     'User',
--     UUID_TO_BIN('11111111-1111-1111-1111-111111111111')
-- );
INSERT INTO appusers(id, email, user_name, password, first_name, last_name, authority)
VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'admin1@streetask.com',
    'admin1',
    '$2a$10$nMmTWAhPTqXqLDJTag3prumFrAJpsYtroxf0ojesFYq0k4PmcbWUS',
    'Admin',
    'User',
    '11111111-1111-1111-1111-111111111111'
);

-- Regular user: user1@streetask.com / password: 4dm1n
-- MySQL/Aiven manual script in DBeaver:
-- INSERT INTO appusers (id, email, user_name, password, first_name, last_name, authority, account_type, active, created_at)
-- VALUES (
--     UUID_TO_BIN('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
--     'user1@streetask.com',
--     'user1',
--     '$2a$10$nMmTWAhPTqXqLDJTag3prumFrAJpsYtroxf0ojesFYq0k4PmcbWUS',
--     'Regular',
--     'User',
--     UUID_TO_BIN('22222222-2222-2222-2222-222222222222'),
--     'REGULAR_USER',
--     TRUE,
--     CURRENT_TIMESTAMP
-- );
INSERT INTO appusers (id, email, user_name, password, first_name, last_name, authority, account_type, active, created_at)
VALUES (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'user1@streetask.com',
    'user1',
    '$2a$10$nMmTWAhPTqXqLDJTag3prumFrAJpsYtroxf0ojesFYq0k4PmcbWUS',
    'Regular',
    'User',
    '22222222-2222-2222-2222-222222222222',
    'REGULAR_USER',
    TRUE,
    CURRENT_TIMESTAMP
);

-- RegularUser profile for user1
-- MySQL/Aiven manual script in DBeaver:
-- INSERT INTO regular_users (id, coin_balance, rating, verified, visibility_radius_km, phone, profile_photo)
-- VALUES (
--     UUID_TO_BIN('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
--     0,
--     0,
--     FALSE,
--     10,
--     '123456789',
--     NULL
-- );
INSERT INTO regular_users (id, coin_balance, rating, verified, visibility_radius_km, phone, profile_photo)
VALUES (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    0,
    0,
    FALSE,
    10,
    '123456789',
    NULL
);

-- Premium regular user: premium1@streetask.com / password: 4dm1n
INSERT INTO appusers (id, email, user_name, password, first_name, last_name, authority, account_type, active, created_at)
VALUES (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'premium1@streetask.com',
    'premium1',
    '$2a$10$nMmTWAhPTqXqLDJTag3prumFrAJpsYtroxf0ojesFYq0k4PmcbWUS',
    'Premium',
    'User',
    '22222222-2222-2222-2222-222222222222',
    'REGULAR_USER',
    TRUE,
    CURRENT_TIMESTAMP
);

-- RegularUser profile for premium1 (premium_active = TRUE)
INSERT INTO regular_users (id, coin_balance, rating, verified, visibility_radius_km, phone, profile_photo, premium_active)
VALUES (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    0,
    0,
    FALSE,
    10,
    '987654321',
    NULL,
    TRUE
);