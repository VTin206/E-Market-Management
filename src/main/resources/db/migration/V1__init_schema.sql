-- Membership
CREATE TABLE membership (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100),
    discount_percent INT,
    required_points INT
);

-- User
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100),
    password VARCHAR(255),
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(50),
    points INT,
    membership_id BIGINT,
    CONSTRAINT fk_user_membership
        FOREIGN KEY (membership_id)
        REFERENCES membership(id)
);

-- Category
CREATE TABLE category (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT
);

-- Brand
CREATE TABLE brand (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100),
    country VARCHAR(100)
);

-- Product
CREATE TABLE product (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    price NUMERIC(10,2),
    stock INT,
    image_url VARCHAR(255),
    category_id BIGINT,
    brand_id BIGINT,
    CONSTRAINT fk_product_category
        FOREIGN KEY (category_id)
        REFERENCES category(id),
    CONSTRAINT fk_product_brand
        FOREIGN KEY (brand_id)
        REFERENCES brand(id)
);

-- Cart
CREATE TABLE cart (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    CONSTRAINT fk_cart_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
);

-- CartItem
CREATE TABLE cart_item (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT,
    product_id BIGINT,
    quantity INT,
    CONSTRAINT fk_cart_item_cart
        FOREIGN KEY (cart_id)
        REFERENCES cart(id),
    CONSTRAINT fk_cart_item_product
        FOREIGN KEY (product_id)
        REFERENCES product(id)
);

-- Order
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NULL,
    customer_name VARCHAR(255),
    phone VARCHAR(20),
    address VARCHAR(255),
    total_amount NUMERIC(10,2),
    status VARCHAR(50),
    created_at TIMESTAMP,
    CONSTRAINT fk_order_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
);

-- OrderItem
CREATE TABLE order_item (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT,
    product_id BIGINT,
    quantity INT,
    unit_price NUMERIC(10,2),
    CONSTRAINT fk_order_item_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id),
    CONSTRAINT fk_order_item_product
        FOREIGN KEY (product_id)
        REFERENCES product(id)
);

-- Review
CREATE TABLE review (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    product_id BIGINT,
    rating INT,
    comment TEXT,
    created_at TIMESTAMP,
    CONSTRAINT fk_review_user
        FOREIGN KEY (user_id)
        REFERENCES users(id),
    CONSTRAINT fk_review_product
        FOREIGN KEY (product_id)
        REFERENCES product(id)
);