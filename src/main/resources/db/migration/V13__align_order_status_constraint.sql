-- Keep the database constraint aligned with the order lifecycle represented by STATUS.
-- V4 normalized legacy values, but its constraint did not include the newer
-- CONFIRMED, SHIPPED, and DELIVERED states used by the application.

ALTER TABLE orders
    DROP CONSTRAINT IF EXISTS ck_orders_status;

ALTER TABLE orders
    ADD CONSTRAINT ck_orders_status
    CHECK (status IN (
        'PENDING',
        'CONFIRMED',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'COMPLETED',
        'CANCELLED'
    ));
