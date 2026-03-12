/*!40101 SET NAMES utf8mb4 */;

/*!50503 ALTER TABLE appusers CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
/*!50503 ALTER TABLE events CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
/*!50503 ALTER TABLE questions CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
/*!50503 ALTER TABLE answers CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
/*!50503 ALTER TABLE notifications CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

CREATE TABLE push_devices
(
    id BINARY(16) NOT NULL,
    user_id BINARY(16) NOT NULL,
    push_token VARCHAR(500) NOT NULL,
    platform VARCHAR(30),
    zone_key VARCHAR(100),
    notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    last_seen_at DATETIME,
    created_at DATETIME,
    updated_at DATETIME,
    PRIMARY KEY (id),
    CONSTRAINT uk_push_devices_token UNIQUE (push_token),
    CONSTRAINT fk_push_devices_user FOREIGN KEY (user_id) REFERENCES regular_users(id)
);