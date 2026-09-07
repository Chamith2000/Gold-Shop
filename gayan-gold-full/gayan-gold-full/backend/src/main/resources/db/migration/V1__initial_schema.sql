-- Users
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NULL
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    display_order INT NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NULL
);

-- Products
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    category_id VARCHAR(64) NOT NULL,
    price DECIMAL(14,2) NOT NULL,
    original_price DECIMAL(14,2),
    gold_purity VARCHAR(10) NOT NULL,
    weight_grams DECIMAL(10,3) NOT NULL,
    description TEXT,
    specifications JSON,
    in_stock BOOLEAN NOT NULL DEFAULT TRUE,
    stock_count INT NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_new_arrival BOOLEAN NOT NULL DEFAULT FALSE,
    is_best_seller BOOLEAN NOT NULL DEFAULT FALSE,
    rating DECIMAL(3,2),
    review_count INT DEFAULT 0,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NULL,
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS product_images (
    product_id VARCHAR(64) NOT NULL,
    image_url LONGTEXT NOT NULL,
    image_order INT NOT NULL,
    PRIMARY KEY (product_id, image_order),
    CONSTRAINT fk_product_images FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    order_number VARCHAR(40) NOT NULL UNIQUE,
    user_id VARCHAR(64) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(180) NOT NULL,
    subtotal DECIMAL(14,2) NOT NULL,
    discount_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    points_redeemed INT NOT NULL DEFAULT 0,
    shipping_fee DECIMAL(14,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(14,2) NOT NULL,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    order_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    earned_points INT NOT NULL DEFAULT 0,
    shipping_street VARCHAR(255),
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_postal_code VARCHAR(20),
    shipping_country VARCHAR(80),
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NULL,
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL,
    product_id VARCHAR(64) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    price DECIMAL(14,2) NOT NULL,
    quantity INT NOT NULL,
    gold_purity VARCHAR(10),
    image VARCHAR(500),
    CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Reward profiles
CREATE TABLE IF NOT EXISTS reward_profiles (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL UNIQUE,
    current_points INT NOT NULL DEFAULT 0,
    lifetime_earned INT NOT NULL DEFAULT 0,
    lifetime_redeemed INT NOT NULL DEFAULT 0,
    reward_tier VARCHAR(20) NOT NULL DEFAULT 'SILVER',
    points_multiplier DOUBLE NOT NULL DEFAULT 1.0,
    updated_at TIMESTAMP(6) NULL,
    CONSTRAINT fk_reward_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Gold rates
CREATE TABLE IF NOT EXISTS gold_rates (
    id VARCHAR(64) PRIMARY KEY,
    rate_date DATE NOT NULL UNIQUE,
    rate24k DECIMAL(12,2) NOT NULL,
    rate22k DECIMAL(12,2) NOT NULL,
    rate18k DECIMAL(12,2) NOT NULL,
    sovereign24k DECIMAL(14,2) NOT NULL,
    sovereign22k DECIMAL(14,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'LKR',
    recorded_at TIMESTAMP(6) NULL
);

-- Wishlist
CREATE TABLE IF NOT EXISTS wishlist_items (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    product_id VARCHAR(64) NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    UNIQUE KEY uk_wishlist (user_id, product_id),
    CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_wishlist_product FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    user_name VARCHAR(150) NOT NULL,
    rating INT NOT NULL,
    title VARCHAR(200),
    comment TEXT,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    helpful_votes INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_review_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(64) PRIMARY KEY,
    appointment_number VARCHAR(40) NOT NULL UNIQUE,
    user_id VARCHAR(64) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(180) NOT NULL,
    customer_phone VARCHAR(30),
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL,
    appointment_type VARCHAR(80) NOT NULL,
    visitor_count INT NOT NULL DEFAULT 1,
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    store_traffic_level VARCHAR(20),
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_appointment_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Store activity (single row typically)
CREATE TABLE IF NOT EXISTS store_activity (
    id VARCHAR(64) PRIMARY KEY,
    current_visitor_count INT NOT NULL DEFAULT 0,
    traffic_level VARCHAR(20) NOT NULL DEFAULT 'LOW',
    estimated_wait_minutes INT NOT NULL DEFAULT 0,
    store_status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    peak_hours_note VARCHAR(500),
    recorded_at TIMESTAMP(6) NULL,
    updated_at TIMESTAMP(6) NULL,
    updated_by VARCHAR(100)
);

CREATE INDEX idx_product_category ON products(category_id);
CREATE INDEX idx_order_user ON orders(user_id);
CREATE INDEX idx_wishlist_user ON wishlist_items(user_id);
CREATE INDEX idx_appointment_date ON appointments(appointment_date);
