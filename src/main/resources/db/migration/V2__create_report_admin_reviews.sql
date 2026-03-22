CREATE TABLE IF NOT EXISTS report_admin_reviews (
    report_id BINARY(16) NOT NULL,
    admin_id BINARY(16) NOT NULL,
    PRIMARY KEY (report_id, admin_id),
    CONSTRAINT fk_rar_report
        FOREIGN KEY (report_id)
        REFERENCES reports (id),
    CONSTRAINT fk_rar_admin
        FOREIGN KEY (admin_id)
        REFERENCES admins (id)
);