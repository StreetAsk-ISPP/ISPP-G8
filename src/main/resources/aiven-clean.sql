-- =========================================================================
-- SCRIPT DE LIMPIEZA DE PREPRODUCCIÓN (Mantiene Roles, regenera Usuarios)
-- =========================================================================

-- 1. Desactivamos las claves foráneas para poder vaciar sin restricciones
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Vaciamos toda la basura (EXCEPTO authorities)
TRUNCATE TABLE admins;
TRUNCATE TABLE answer_votes;
TRUNCATE TABLE answers;
TRUNCATE TABLE business_accounts;
TRUNCATE TABLE coin_transactions;
TRUNCATE TABLE event_attendances;
TRUNCATE TABLE events;
TRUNCATE TABLE notifications;
TRUNCATE TABLE push_devices;
TRUNCATE TABLE questions;
TRUNCATE TABLE regular_users;
TRUNCATE TABLE reports;
TRUNCATE TABLE user_locations;
TRUNCATE TABLE appusers;

-- 3. Volvemos a activar las claves foráneas (¡Súper importante!)
SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================================
-- 4. RE-INSERCIÓN DE USUARIOS SEMILLA (Seed Data)
-- =========================================================================

-- Creamos de nuevo al Admin (admin1@streetask.com / 4dm1n)
INSERT INTO appusers(id, email, user_name, password, first_name, last_name, authority)
VALUES (
    UUID_TO_BIN('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    'admin1@streetask.com',
    'admin1',
    '$2a$10$nMmTWAhPTqXqLDJTag3prumFrAJpsYtroxf0ojesFYq0k4PmcbWUS',
    'Admin',
    'User',
    UUID_TO_BIN('11111111-1111-1111-1111-111111111111') -- ID de la autoridad ADMIN
);

-- Creamos de nuevo al usuario regular (user1@streetask.com / 4dm1n)
INSERT INTO appusers (id, email, user_name, password, first_name, last_name, authority, account_type, active, created_at)
VALUES (
    UUID_TO_BIN('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    'user1@streetask.com',
    'user1',
    '$2a$10$nMmTWAhPTqXqLDJTag3prumFrAJpsYtroxf0ojesFYq0k4PmcbWUS',
    'Regular',
    'User',
    UUID_TO_BIN('22222222-2222-2222-2222-222222222222'), -- ID de la autoridad USER
    'REGULAR_USER',
    TRUE,
    CURRENT_TIMESTAMP
);

-- Creamos el perfil del usuario regular
INSERT INTO regular_users (id, coin_balance, rating, verified, visibility_radius_km, phone, profile_photo)
VALUES (
    UUID_TO_BIN('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    0,
    0,
    FALSE,
    10,
    '123456789',
    NULL
);