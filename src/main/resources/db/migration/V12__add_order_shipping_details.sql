ALTER TABLE orders
    ADD COLUMN shipping_carrier VARCHAR(100),
    ADD COLUMN carrier_tracking_number VARCHAR(150);
