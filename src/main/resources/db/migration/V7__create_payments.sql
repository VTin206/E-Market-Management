CREATE TABLE payments (
    payment_id BIGSERIAL PRIMARY KEY,
    method_name VARCHAR(30) NOT NULL,
    order_id BIGINT NOT NULL UNIQUE,
    CONSTRAINT fk_payments_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
);
