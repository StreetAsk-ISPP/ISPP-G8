-- One admin user, named admin1 with password 4dm1n and authority admin
INSERT INTO authorities(id,authority) VALUES (1,'ADMIN');
INSERT INTO authorities(id,authority) VALUES (2,'USER');
INSERT INTO authorities(id,authority) VALUES (3,'BUSINESS');
INSERT INTO appusers(id,email,user_name,password,first_name,last_name,authority) VALUES (1,'admin1@streetask.com','admin1','$2a$10$nMmTWAhPTqXqLDJTag3prumFrAJpsYtroxf0ojesFYq0k4PmcbWUS','Admin','User',1);