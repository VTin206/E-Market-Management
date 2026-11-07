-- Normalize legacy status values before the Java field is mapped to STATUS.
UPDATE orders
SET status = CASE UPPER(BTRIM(status))
    WHEN 'PENDING' THEN 'PENDING'
    WHEN 'CONFIRMED' THEN 'PROCESSING'
    WHEN 'PROCESSING' THEN 'PROCESSING'
    WHEN 'SHIPPING' THEN 'PROCESSING'
    WHEN 'SHIPPED' THEN 'PROCESSING'
    WHEN 'DELIVERED' THEN 'COMPLETED'
    WHEN 'COMPLETED' THEN 'COMPLETED'
    WHEN 'CANCELLED' THEN 'CANCELLED'
    WHEN 'CANCELED' THEN 'CANCELLED'
    ELSE UPPER(BTRIM(status))
END;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM orders
        WHERE status NOT IN ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED')
    ) THEN
        RAISE EXCEPTION 'orders contains status values that are not supported by STATUS enum';
    END IF;
END $$;

ALTER TABLE orders
    ADD CONSTRAINT ck_orders_status
    CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'));
