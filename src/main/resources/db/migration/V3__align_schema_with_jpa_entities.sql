-- Align database constraints with the JPA entity model.
-- Existing nullable rows are normalized before NOT NULL constraints are applied.

UPDATE membership
SET name = CONCAT('Membership ', id)
WHERE name IS NULL OR BTRIM(name) = '';

UPDATE membership
SET discount_percent = 0
WHERE discount_percent IS NULL;

UPDATE membership
SET required_points = 0
WHERE required_points IS NULL;

UPDATE users
SET username = CONCAT('user_', id)
WHERE username IS NULL OR BTRIM(username) = '';

UPDATE users
SET password = ''
WHERE password IS NULL;

UPDATE users
SET full_name = CONCAT('User ', id)
WHERE full_name IS NULL OR BTRIM(full_name) = '';

UPDATE users
SET email = CONCAT('user_', id, '@example.local')
WHERE email IS NULL OR BTRIM(email) = '';

UPDATE users
SET role = 'CUSTOMER'
WHERE role IS NULL OR BTRIM(role) = '';

UPDATE users
SET phone = NULL
WHERE phone IS NOT NULL AND BTRIM(phone) = '';

UPDATE category
SET name = CONCAT('Category ', id)
WHERE name IS NULL OR BTRIM(name) = '';

UPDATE brand
SET name = CONCAT('Brand ', id)
WHERE name IS NULL OR BTRIM(name) = '';

UPDATE product
SET name = CONCAT('Product ', id)
WHERE name IS NULL OR BTRIM(name) = '';

UPDATE product
SET price = 0
WHERE price IS NULL;

UPDATE product
SET stock = 0
WHERE stock IS NULL;

UPDATE orders
SET customer_name = CONCAT('Customer ', id)
WHERE customer_name IS NULL OR BTRIM(customer_name) = '';

UPDATE orders
SET phone = ''
WHERE phone IS NULL;

UPDATE orders
SET address = ''
WHERE address IS NULL OR BTRIM(address) = '';

UPDATE orders
SET total_amount = 0
WHERE total_amount IS NULL;

UPDATE orders
SET status = 'PENDING'
WHERE status IS NULL OR BTRIM(status) = '';

UPDATE orders
SET created_at = CURRENT_TIMESTAMP
WHERE created_at IS NULL;

UPDATE order_item
SET quantity = 0
WHERE quantity IS NULL;

UPDATE order_item
SET unit_price = 0
WHERE unit_price IS NULL;

UPDATE review
SET rating = 0
WHERE rating IS NULL;

UPDATE review
SET created_at = CURRENT_TIMESTAMP
WHERE created_at IS NULL;

ALTER TABLE membership
    ALTER COLUMN name SET NOT NULL,
    ALTER COLUMN discount_percent SET NOT NULL,
    ALTER COLUMN required_points SET NOT NULL;

ALTER TABLE users
    ALTER COLUMN username SET NOT NULL,
    ALTER COLUMN password SET NOT NULL,
    ALTER COLUMN full_name SET NOT NULL,
    ALTER COLUMN email SET NOT NULL,
    ALTER COLUMN role SET NOT NULL;

ALTER TABLE category
    ALTER COLUMN name SET NOT NULL;

ALTER TABLE brand
    ALTER COLUMN name SET NOT NULL;

ALTER TABLE product
    ALTER COLUMN name SET NOT NULL,
    ALTER COLUMN price SET NOT NULL,
    ALTER COLUMN stock SET NOT NULL;

ALTER TABLE orders
    ALTER COLUMN customer_name SET NOT NULL,
    ALTER COLUMN phone SET NOT NULL,
    ALTER COLUMN address SET NOT NULL,
    ALTER COLUMN total_amount SET NOT NULL,
    ALTER COLUMN status SET NOT NULL,
    ALTER COLUMN created_at SET NOT NULL;

ALTER TABLE order_item
    ALTER COLUMN quantity SET NOT NULL,
    ALTER COLUMN unit_price SET NOT NULL;

ALTER TABLE review
    ALTER COLUMN rating SET NOT NULL,
    ALTER COLUMN created_at SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uk_membership_name ON membership (name);
CREATE UNIQUE INDEX IF NOT EXISTS uk_users_username ON users (username);
CREATE UNIQUE INDEX IF NOT EXISTS uk_users_email ON users (email);
CREATE UNIQUE INDEX IF NOT EXISTS uk_users_phone ON users (phone);
CREATE UNIQUE INDEX IF NOT EXISTS uk_category_name ON category (name);
CREATE UNIQUE INDEX IF NOT EXISTS uk_brand_name ON brand (name);
CREATE UNIQUE INDEX IF NOT EXISTS uk_cart_user_id ON cart (user_id);

ALTER TABLE users
    DROP COLUMN IF EXISTS test_flyway;
