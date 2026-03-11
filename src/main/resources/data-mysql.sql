-- Authorities seed data (MySQL)
INSERT IGNORE INTO authorities(id, authority) VALUES (UUID_TO_BIN('11111111-1111-1111-1111-111111111111'), 'ADMIN');
INSERT IGNORE INTO authorities(id, authority) VALUES (UUID_TO_BIN('22222222-2222-2222-2222-222222222222'), 'USER');
INSERT IGNORE INTO authorities(id, authority) VALUES (UUID_TO_BIN('33333333-3333-3333-3333-333333333333'), 'BUSINESS');

-- Admin user: admin1 / password: 4dm1n
INSERT IGNORE INTO appusers(id, email, user_name, password, first_name, last_name, authority)
VALUES (
    UUID_TO_BIN('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    'admin1@streetask.com',
    'admin1',
    '$2a$10$nMmTWAhPTqXqLDJTag3prumFrAJpsYtroxf0ojesFYq0k4PmcbWUS',
    'Admin',
    'User',
    UUID_TO_BIN('11111111-1111-1111-1111-111111111111')
);

-- Regular user: user1@streetask.com / password: 4dm1n
INSERT IGNORE INTO appusers (id, email, user_name, password, first_name, last_name, authority, account_type, active, created_at)
VALUES (
    UUID_TO_BIN('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    'user1@streetask.com',
    'user1',
    '$2a$10$nMmTWAhPTqXqLDJTag3prumFrAJpsYtroxf0ojesFYq0k4PmcbWUS',
    'Regular',
    'User',
    UUID_TO_BIN('22222222-2222-2222-2222-222222222222'),
    'REGULAR_USER',
    TRUE,
    CURRENT_TIMESTAMP
);

-- RegularUser profile for user1
INSERT IGNORE INTO regular_users (id, coin_balance, rating, verified, visibility_radius_km, phone, profile_photo)
VALUES (
    UUID_TO_BIN('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    0,
    0,
    FALSE,
    10,
    '123456789',
    NULL
);