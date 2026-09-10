CREATE TABLE IF NOT EXISTS reward_transactions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    type VARCHAR(30) NOT NULL,
    points INT NOT NULL,
    reference VARCHAR(100),
    description VARCHAR(500) NOT NULL,
    balance_after INT NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_reward_tx_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_reward_tx_user_created ON reward_transactions(user_id, created_at);

CREATE TABLE IF NOT EXISTS lucky_spin_records (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    segment_id VARCHAR(64) NOT NULL,
    segment_name VARCHAR(100) NOT NULL,
    reward_points INT NOT NULL,
    spun_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    next_eligible_at TIMESTAMP(6) NOT NULL,
    CONSTRAINT fk_lucky_spin_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_spin_user_spun ON lucky_spin_records(user_id, spun_at);
