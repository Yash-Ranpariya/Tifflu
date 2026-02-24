-- Database Schema for TiFFLu Application
-- Generated based on database_schema_details.md

-- 1. Users Table
CREATE TABLE IF NOT EXISTS Users (
    user_id CHAR(36) PRIMARY KEY,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    profile_image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Vendors Table
CREATE TABLE IF NOT EXISTS Vendors (
    vendor_id CHAR(36) PRIMARY KEY,
    business_name VARCHAR(150) NOT NULL,
    business_type VARCHAR(50) NOT NULL,
    description TEXT,
    fssai_license VARCHAR(50) UNIQUE,
    opening_time TIME,
    closing_time TIME,
    is_open BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    min_order_value DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (vendor_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 3. Delivery_Partners Table
CREATE TABLE IF NOT EXISTS Delivery_Partners (
    partner_id CHAR(36) PRIMARY KEY,
    vehicle_number VARCHAR(20) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    current_status VARCHAR(50) DEFAULT 'offline',
    current_latitude DECIMAL(10,8),
    current_longitude DECIMAL(11,8),
    rating DECIMAL(3,2) DEFAULT 0.00,
    FOREIGN KEY (partner_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 7. Moods Table (Created early for FK dependencies)
CREATE TABLE IF NOT EXISTS Moods (
    mood_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    icon_url VARCHAR(500)
);

-- 4. Menu_Items Table
CREATE TABLE IF NOT EXISTS Menu_Items (
    item_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    vendor_id VARCHAR(50) NOT NULL,
    category_id INT,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    is_veg BOOLEAN DEFAULT TRUE,
    image_url LONGTEXT,
    is_available BOOLEAN DEFAULT TRUE,
    is_chef_special BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -- FOREIGN KEY (vendor_id) REFERENCES Vendors(vendor_id) ON DELETE CASCADE
);

/*
-- 8. Menu_Item_Moods Table
CREATE TABLE IF NOT EXISTS Menu_Item_Moods (
    item_id BIGINT,
    mood_id INT,
    PRIMARY KEY (item_id, mood_id),
    FOREIGN KEY (item_id) REFERENCES Menu_Items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (mood_id) REFERENCES Moods(mood_id) ON DELETE CASCADE
);
*/

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS Orders (
    order_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id CHAR(36) NOT NULL,
    vendor_id CHAR(36) NOT NULL,
    partner_id CHAR(36),
    order_status VARCHAR(50) DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50),
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    special_instructions TEXT,
    placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Users(user_id),
    FOREIGN KEY (vendor_id) REFERENCES Vendors(vendor_id),
    FOREIGN KEY (partner_id) REFERENCES Delivery_Partners(partner_id)
);

CREATE TABLE IF NOT EXISTS Order_Items (
    order_item_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    menu_item_id BIGINT NOT NULL,
    quantity INT DEFAULT 1,
    price_at_order DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES Menu_Items(item_id)
);

-- 6. Subscriptions Table
CREATE TABLE IF NOT EXISTS Subscriptions (
    subscription_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id CHAR(36) NOT NULL,
    vendor_id VARCHAR(50) NOT NULL,
    plan_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Users(user_id)
);

-- 9. Reviews Table
CREATE TABLE IF NOT EXISTS Reviews (
    review_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT UNIQUE NOT NULL,
    customer_id CHAR(36) NOT NULL,
    vendor_id VARCHAR(50) NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (customer_id) REFERENCES Users(user_id)
);

-- 10. Conversations Table
CREATE TABLE IF NOT EXISTS Conversations (
    conversation_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    participant1_id CHAR(36) NOT NULL,
    participant2_id CHAR(36) NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (participant1_id) REFERENCES Users(user_id),
    FOREIGN KEY (participant2_id) REFERENCES Users(user_id)
);

-- 11. Messages Table
CREATE TABLE IF NOT EXISTS Messages (
    message_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    conversation_id BIGINT NOT NULL,
    sender_id CHAR(36) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES Conversations(conversation_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES Users(user_id)
);

-- 12. Payments Table
CREATE TABLE IF NOT EXISTS Payments (
    transaction_id VARCHAR(100) PRIMARY KEY,
    order_id BIGINT,
    subscription_id BIGINT,
    amount DECIMAL(10,2) NOT NULL,
    method VARCHAR(50),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (subscription_id) REFERENCES Subscriptions(subscription_id)
);

-- 13. User_Mood_Logs Table
CREATE TABLE IF NOT EXISTS User_Mood_Logs (
    log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(36) NOT NULL,
    mood_id INT NOT NULL,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (mood_id) REFERENCES Moods(mood_id)
);
