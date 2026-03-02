-- One admin user, named admin1 with password 4dm1n and authority admin
INSERT INTO authorities(id, authority) VALUES ('11111111-1111-1111-1111-111111111111', 'ADMIN');
INSERT INTO authorities(id, authority) VALUES ('22222222-2222-2222-2222-222222222222', 'USER');
INSERT INTO authorities(id, authority) VALUES ('33333333-3333-3333-3333-333333333333', 'BUSINESS');

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

-- One admin user, email user1@streetask.com with password 4dm1n and authority admin
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

-- OJO: regular_users.id debe existir también en appusers.id (FK regular_users -> appusers)
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