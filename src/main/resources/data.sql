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