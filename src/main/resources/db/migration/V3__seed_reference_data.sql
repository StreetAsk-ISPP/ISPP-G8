-- Minimal reference data for fresh MySQL databases.
-- Keeps inserts deterministic using fixed UUIDs.

INSERT INTO authorities (id, authority)
VALUES (UUID_TO_BIN('11111111-1111-1111-1111-111111111111'), 'ADMIN')
AS incoming
ON DUPLICATE KEY UPDATE authority = incoming.authority;

INSERT INTO authorities (id, authority)
VALUES (UUID_TO_BIN('22222222-2222-2222-2222-222222222222'), 'USER')
AS incoming
ON DUPLICATE KEY UPDATE authority = incoming.authority;

INSERT INTO authorities (id, authority)
VALUES (UUID_TO_BIN('33333333-3333-3333-3333-333333333333'), 'BUSINESS')
AS incoming
ON DUPLICATE KEY UPDATE authority = incoming.authority;

-- admin1 / password: 4dm1n
INSERT INTO appusers (
    id,
    email,
    user_name,
    password,
    first_name,
    last_name,
    authority,
    account_type,
    active,
    created_at
)
VALUES (
    UUID_TO_BIN('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    'admin1@streetask.com',
    'admin1',
    '$2a$10$nMmTWAhPTqXqLDJTag3prumFrAJpsYtroxf0ojesFYq0k4PmcbWUS',
    'Admin',
    'User',
    UUID_TO_BIN('11111111-1111-1111-1111-111111111111'),
    'ADMIN',
    TRUE,
    CURRENT_TIMESTAMP
)
AS incoming
ON DUPLICATE KEY UPDATE
    email = incoming.email,
    user_name = incoming.user_name,
    password = incoming.password,
    first_name = incoming.first_name,
    last_name = incoming.last_name,
    authority = incoming.authority,
    account_type = incoming.account_type,
    active = incoming.active;

INSERT INTO admins (id, role, permissions, assigned_at)
VALUES (
    UUID_TO_BIN('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    'SUPER_ADMIN',
    '[]',
    CURRENT_TIMESTAMP
)
AS incoming
ON DUPLICATE KEY UPDATE
    role = incoming.role,
    permissions = incoming.permissions,
    assigned_at = incoming.assigned_at;

-- user1 (normal regular user) / password: 4dm1n
INSERT INTO appusers (
    id,
    email,
    user_name,
    password,
    first_name,
    last_name,
    authority,
    account_type,
    active,
    created_at
)
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
)
AS incoming
ON DUPLICATE KEY UPDATE
    email = incoming.email,
    user_name = incoming.user_name,
    password = incoming.password,
    first_name = incoming.first_name,
    last_name = incoming.last_name,
    authority = incoming.authority,
    account_type = incoming.account_type,
    active = incoming.active;

INSERT INTO regular_users (
    id,
    coin_balance,
    rating,
    verified,
    visibility_radius_km,
    phone,
    profile_photo,
    premium_active
)
VALUES (
    UUID_TO_BIN('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    0,
    0,
    FALSE,
    10,
    '123456789',
    NULL,
    FALSE
)
AS incoming
ON DUPLICATE KEY UPDATE
    coin_balance = incoming.coin_balance,
    rating = incoming.rating,
    verified = incoming.verified,
    visibility_radius_km = incoming.visibility_radius_km,
    phone = incoming.phone,
    profile_photo = incoming.profile_photo,
    premium_active = incoming.premium_active;

-- premium1 (regular user with premium active) / password: 4dm1n
INSERT INTO appusers (
    id,
    email,
    user_name,
    password,
    first_name,
    last_name,
    authority,
    account_type,
    active,
    created_at
)
VALUES (
    UUID_TO_BIN('cccccccc-cccc-cccc-cccc-cccccccccccc'),
    'premium1@streetask.com',
    'premium1',
    '$2a$10$nMmTWAhPTqXqLDJTag3prumFrAJpsYtroxf0ojesFYq0k4PmcbWUS',
    'Premium',
    'User',
    UUID_TO_BIN('22222222-2222-2222-2222-222222222222'),
    'REGULAR_USER',
    TRUE,
    CURRENT_TIMESTAMP
)
AS incoming
ON DUPLICATE KEY UPDATE
    email = incoming.email,
    user_name = incoming.user_name,
    password = incoming.password,
    first_name = incoming.first_name,
    last_name = incoming.last_name,
    authority = incoming.authority,
    account_type = incoming.account_type,
    active = incoming.active;

INSERT INTO regular_users (
    id,
    coin_balance,
    rating,
    verified,
    visibility_radius_km,
    phone,
    profile_photo,
    premium_active
)
VALUES (
    UUID_TO_BIN('cccccccc-cccc-cccc-cccc-cccccccccccc'),
    0,
    0,
    FALSE,
    10,
    '987654321',
    NULL,
    TRUE
)
AS incoming
ON DUPLICATE KEY UPDATE
    coin_balance = incoming.coin_balance,
    rating = incoming.rating,
    verified = incoming.verified,
    visibility_radius_km = incoming.visibility_radius_km,
    phone = incoming.phone,
    profile_photo = incoming.profile_photo,
    premium_active = incoming.premium_active;
