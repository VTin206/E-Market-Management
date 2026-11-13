ALTER TABLE orders 
    ADD COLUMN tracking_code UUID NOT NULL DEFAULT gen_random_uuid();

ALTER TABLE orders 
    ALTER COLUMN tracking_code DROP DEFAULT;

CREATE UNIQUE INDEX uk_orders_tracking_code
    ON orders (tracking_code);
