CREATE TABLE IF NOT EXISTS gift_offer_records (
    id VARCHAR(40) NOT NULL,
    record_type VARCHAR(40) NOT NULL,
    payload LONGTEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_gift_offer_type (record_type)
);
