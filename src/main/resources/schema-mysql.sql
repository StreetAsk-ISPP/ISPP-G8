CREATE TABLE push_devices
(
    id BINARY(16) NOT NULL,
    user_id BINARY(16) NOT NULL,
    endpoint VARCHAR(1000) NOT NULL,
    p256dh VARCHAR(512) NOT NULL,
    auth VARCHAR(512) NOT NULL,
    zone_key VARCHAR(100),
    notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    last_seen_at DATETIME,
    created_at DATETIME,
    updated_at DATETIME,
    PRIMARY KEY (id),
    CONSTRAINT uk_push_devices_endpoint UNIQUE (endpoint),
    CONSTRAINT fk_push_devices_user FOREIGN KEY (user_id) REFERENCES regular_users(id)
);

CREATE TABLE password_reset_tokens
(
    id BINARY(16) NOT NULL,
    user_id BINARY(16) NOT NULL,
    token VARCHAR(200) NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME,
    PRIMARY KEY (id),
    CONSTRAINT uk_password_reset_tokens_token UNIQUE (token),
    CONSTRAINT fk_password_reset_tokens_user FOREIGN KEY (user_id) REFERENCES appusers(id)
);