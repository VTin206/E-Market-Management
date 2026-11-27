-- Seed a repeatable demo dataset for local development and frontend testing.
-- The migration intentionally does not touch refresh_tokens or password_reset_tokens.

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM membership
        WHERE tier IN ('MEMBER', 'SILVER', 'GOLD', 'DIAMOND')
        HAVING COUNT(DISTINCT tier) = 4
    ) THEN
        RAISE EXCEPTION 'V14 requires all membership tiers to exist';
    END IF;
END $$;

-- Demo credentials:
-- admin-demo / Admin@123
-- member-demo-1 / User@123
-- member-demo-2 / User@123
-- customer01..customer08 / User@123
INSERT INTO users (username, password, full_name, email, phone, role, points, membership_id)
SELECT seed.username,
       seed.password,
       seed.full_name,
       seed.email,
       seed.phone,
       seed.role,
       seed.points,
       m.id
FROM (VALUES
    ('admin-demo', '$2a$10$hY6Wvbx3JjJQFl2Eo.L5vuZDnCQUIa33eXd0.sgIyMb7hlWPWnkxW', 'Quản trị viên Demo', 'admin.demo@example.local', '0900000001', 'ADMIN', 5000, 'DIAMOND'),
    ('member-demo-1', '$2a$10$YObp/RQs2J/GkyRGJOFTlOjDpqlmr8/s1Swf.HqbPqkrqpdzv32uK', 'Thành viên Demo 1', 'member.demo1@example.local', '0900000002', 'MEMBER', 2200, 'GOLD'),
    ('member-demo-2', '$2a$10$YObp/RQs2J/GkyRGJOFTlOjDpqlmr8/s1Swf.HqbPqkrqpdzv32uK', 'Thành viên Demo 2', 'member.demo2@example.local', '0900000003', 'MEMBER', 700, 'SILVER'),
    ('customer01', '$2a$10$YObp/RQs2J/GkyRGJOFTlOjDpqlmr8/s1Swf.HqbPqkrqpdzv32uK', 'Nguyễn Minh Anh', 'customer01@example.local', '0900000011', 'CUSTOMER', 120, 'MEMBER'),
    ('customer02', '$2a$10$YObp/RQs2J/GkyRGJOFTlOjDpqlmr8/s1Swf.HqbPqkrqpdzv32uK', 'Trần Quốc Bảo', 'customer02@example.local', '0900000012', 'CUSTOMER', 650, 'SILVER'),
    ('customer03', '$2a$10$YObp/RQs2J/GkyRGJOFTlOjDpqlmr8/s1Swf.HqbPqkrqpdzv32uK', 'Lê Hoàng Nam', 'customer03@example.local', '0900000013', 'CUSTOMER', 80, 'MEMBER'),
    ('customer04', '$2a$10$YObp/RQs2J/GkyRGJOFTlOjDpqlmr8/s1Swf.HqbPqkrqpdzv32uK', 'Phạm Gia Hân', 'customer04@example.local', '0900000014', 'CUSTOMER', 540, 'SILVER'),
    ('customer05', '$2a$10$YObp/RQs2J/GkyRGJOFTlOjDpqlmr8/s1Swf.HqbPqkrqpdzv32uK', 'Võ Đức Minh', 'customer05@example.local', '0900000015', 'CUSTOMER', 2100, 'GOLD'),
    ('customer06', '$2a$10$YObp/RQs2J/GkyRGJOFTlOjDpqlmr8/s1Swf.HqbPqkrqpdzv32uK', 'Đỗ Ngọc Mai', 'customer06@example.local', '0900000016', 'CUSTOMER', 5100, 'DIAMOND'),
    ('customer07', '$2a$10$YObp/RQs2J/GkyRGJOFTlOjDpqlmr8/s1Swf.HqbPqkrqpdzv32uK', 'Bùi Thanh Tùng', 'customer07@example.local', '0900000017', 'CUSTOMER', 460, 'MEMBER'),
    ('customer08', '$2a$10$YObp/RQs2J/GkyRGJOFTlOjDpqlmr8/s1Swf.HqbPqkrqpdzv32uK', 'Nguyễn Khánh Linh', 'customer08@example.local', '0900000018', 'CUSTOMER', 2600, 'GOLD')
) AS seed(username, password, full_name, email, phone, role, points, tier)
JOIN membership m ON m.tier = seed.tier
WHERE NOT EXISTS (
    SELECT 1
    FROM users existing
    WHERE existing.username = seed.username
       OR existing.email = seed.email
       OR existing.phone = seed.phone
);

INSERT INTO category (name, description) VALUES
    ('Điện thoại', 'Điện thoại thông minh và thiết bị di động'),
    ('Laptop', 'Laptop học tập, văn phòng và chuyên nghiệp'),
    ('Máy tính bảng', 'Máy tính bảng cho học tập và giải trí'),
    ('Phụ kiện điện thoại', 'Cáp, sạc, ốp lưng và phụ kiện di động'),
    ('Thiết bị âm thanh', 'Tai nghe, loa và thiết bị âm thanh'),
    ('Đồ gia dụng', 'Thiết bị gia dụng thông minh và tiện ích'),
    ('Gaming', 'Thiết bị và phụ kiện dành cho game thủ'),
    ('Đồng hồ thông minh', 'Đồng hồ và thiết bị theo dõi sức khỏe')
ON CONFLICT (name) DO NOTHING;

INSERT INTO brand (name, country, logo) VALUES
    ('NovaTech', 'Việt Nam', 'https://placehold.co/160x80/png?text=NovaTech'),
    ('LumiHome', 'Việt Nam', 'https://placehold.co/160x80/png?text=LumiHome'),
    ('SoundMax', 'Nhật Bản', 'https://placehold.co/160x80/png?text=SoundMax'),
    ('Vibe', 'Hoa Kỳ', 'https://placehold.co/160x80/png?text=Vibe'),
    ('GearPro', 'Đức', 'https://placehold.co/160x80/png?text=GearPro'),
    ('SmartLife', 'Hàn Quốc', 'https://placehold.co/160x80/png?text=SmartLife')
ON CONFLICT (name) DO NOTHING;

INSERT INTO product (name, description, price, stock, image_url, category_id, brand_id)
SELECT seed.name,
       seed.description,
       seed.price,
       seed.stock,
       seed.image_url,
       c.id,
       b.id
FROM (VALUES
    ('iPhone 15 128GB', 'Điện thoại cao cấp với camera kép và chip hiệu năng cao.', 18990000.00, 35, 'https://placehold.co/600x600/png?text=iPhone+15', 'Điện thoại', 'NovaTech'),
    ('Samsung Galaxy S24', 'Điện thoại Android màn hình sáng, camera AI và pin bền.', 17990000.00, 42, 'https://placehold.co/600x600/png?text=Galaxy+S24', 'Điện thoại', 'SmartLife'),
    ('Xiaomi Redmi Note 13', 'Điện thoại phổ thông có màn hình AMOLED và sạc nhanh.', 6990000.00, 80, 'https://placehold.co/600x600/png?text=Redmi+Note+13', 'Điện thoại', 'NovaTech'),
    ('MacBook Air M3', 'Laptop mỏng nhẹ cho công việc, học tập và sáng tạo nội dung.', 27990000.00, 18, 'https://placehold.co/600x600/png?text=MacBook+Air+M3', 'Laptop', 'NovaTech'),
    ('Dell Inspiron 14', 'Laptop văn phòng cân bằng giữa hiệu năng và thời lượng pin.', 15990000.00, 26, 'https://placehold.co/600x600/png?text=Dell+Inspiron', 'Laptop', 'GearPro'),
    ('Asus ROG Strix G16', 'Laptop gaming mạnh mẽ với màn hình tần số quét cao.', 32990000.00, 12, 'https://placehold.co/600x600/png?text=ROG+Strix+G16', 'Laptop', 'GearPro'),
    ('iPad Air 11 inch', 'Máy tính bảng linh hoạt cho học tập, ghi chú và giải trí.', 16990000.00, 30, 'https://placehold.co/600x600/png?text=iPad+Air', 'Máy tính bảng', 'NovaTech'),
    ('Samsung Galaxy Tab S9', 'Máy tính bảng Android kèm bút cảm ứng cho công việc sáng tạo.', 18990000.00, 22, 'https://placehold.co/600x600/png?text=Galaxy+Tab+S9', 'Máy tính bảng', 'SmartLife'),
    ('AirPods Pro 2', 'Tai nghe không dây chống ồn chủ động và âm thanh không gian.', 5990000.00, 45, 'https://placehold.co/600x600/png?text=AirPods+Pro+2', 'Thiết bị âm thanh', 'Vibe'),
    ('Sony WH-1000XM5', 'Tai nghe chụp tai chống ồn cao cấp cho người yêu âm nhạc.', 8490000.00, 20, 'https://placehold.co/600x600/png?text=Sony+XM5', 'Thiết bị âm thanh', 'SoundMax'),
    ('JBL Flip 6', 'Loa Bluetooth chống nước, âm thanh mạnh trong thiết kế nhỏ gọn.', 2490000.00, 55, 'https://placehold.co/600x600/png?text=JBL+Flip+6', 'Thiết bị âm thanh', 'SoundMax'),
    ('Loa Bluetooth Mini', 'Loa không dây nhỏ gọn cho bàn làm việc và dã ngoại.', 1290000.00, 70, 'https://placehold.co/600x600/png?text=Mini+Speaker', 'Thiết bị âm thanh', 'Vibe'),
    ('Cáp USB-C bọc dù 1m', 'Cáp sạc và truyền dữ liệu bền chắc, tương thích nhiều thiết bị.', 199000.00, 200, 'https://placehold.co/600x600/png?text=USB-C+Cable', 'Phụ kiện điện thoại', 'NovaTech'),
    ('Sạc nhanh GaN 65W', 'Bộ sạc GaN nhỏ gọn hỗ trợ sạc nhanh cho laptop và điện thoại.', 499000.00, 100, 'https://placehold.co/600x600/png?text=GaN+65W', 'Phụ kiện điện thoại', 'NovaTech'),
    ('Ốp lưng chống sốc', 'Ốp lưng trong suốt, bảo vệ viền và camera điện thoại.', 249000.00, 150, 'https://placehold.co/600x600/png?text=Phone+Case', 'Phụ kiện điện thoại', 'LumiHome'),
    ('Bàn phím cơ K87', 'Bàn phím cơ layout gọn, switch êm và đèn nền RGB.', 1899000.00, 38, 'https://placehold.co/600x600/png?text=Keyboard+K87', 'Gaming', 'GearPro'),
    ('Chuột gaming Pro X', 'Chuột gaming cảm biến chính xác, thiết kế công thái học.', 899000.00, 60, 'https://placehold.co/600x600/png?text=Gaming+Mouse', 'Gaming', 'GearPro'),
    ('Màn hình Gaming 27 inch', 'Màn hình QHD 165Hz cho chơi game và làm việc đa nhiệm.', 7490000.00, 16, 'https://placehold.co/600x600/png?text=Gaming+Monitor', 'Gaming', 'GearPro'),
    ('Tai nghe gaming 7.1', 'Tai nghe gaming âm thanh vòm với micro chống ồn.', 1599000.00, 44, 'https://placehold.co/600x600/png?text=Gaming+Headset', 'Gaming', 'SoundMax'),
    ('Webcam Full HD', 'Webcam 1080p cho học trực tuyến, họp và livestream.', 1299000.00, 48, 'https://placehold.co/600x600/png?text=Webcam+FHD', 'Gaming', 'Vibe'),
    ('Nồi chiên không dầu 5L', 'Nồi chiên dung tích lớn, điều khiển nhiệt độ tiện lợi.', 2299000.00, 25, 'https://placehold.co/600x600/png?text=Air+Fryer', 'Đồ gia dụng', 'LumiHome'),
    ('Máy lọc không khí Mini', 'Máy lọc không khí nhỏ gọn cho phòng ngủ và phòng làm việc.', 5499000.00, 14, 'https://placehold.co/600x600/png?text=Air+Purifier', 'Đồ gia dụng', 'LumiHome'),
    ('Robot hút bụi S1', 'Robot hút bụi tự động có cảm biến chống rơi và lập bản đồ.', 8999000.00, 10, 'https://placehold.co/600x600/png?text=Robot+Vacuum', 'Đồ gia dụng', 'SmartLife'),
    ('Bình đun siêu tốc 1.7L', 'Bình đun inox an toàn, đun nước nhanh cho gia đình.', 699000.00, 65, 'https://placehold.co/600x600/png?text=Kettle', 'Đồ gia dụng', 'LumiHome'),
    ('Apple Watch SE', 'Đồng hồ thông minh theo dõi sức khỏe và thông báo hàng ngày.', 6490000.00, 24, 'https://placehold.co/600x600/png?text=Apple+Watch+SE', 'Đồng hồ thông minh', 'NovaTech'),
    ('Galaxy Watch 6', 'Đồng hồ thông minh theo dõi giấc ngủ, vận động và nhịp tim.', 5990000.00, 28, 'https://placehold.co/600x600/png?text=Galaxy+Watch+6', 'Đồng hồ thông minh', 'SmartLife'),
    ('Xiaomi Band 8', 'Vòng đeo tay thông minh nhẹ, pin lâu và nhiều chế độ thể thao.', 999000.00, 90, 'https://placehold.co/600x600/png?text=Xiaomi+Band+8', 'Đồng hồ thông minh', 'NovaTech'),
    ('SSD di động 1TB', 'Ổ SSD di động tốc độ cao cho sao lưu và di chuyển dữ liệu.', 2399000.00, 32, 'https://placehold.co/600x600/png?text=Portable+SSD', 'Phụ kiện điện thoại', 'GearPro'),
    ('USB-C Hub 7-in-1', 'Hub đa năng mở rộng HDMI, USB và khe đọc thẻ cho laptop.', 899000.00, 50, 'https://placehold.co/600x600/png?text=USB-C+Hub', 'Phụ kiện điện thoại', 'GearPro'),
    ('Balo laptop chống nước', 'Balo có ngăn laptop riêng, đệm lưng thoáng khí và chống nước.', 799000.00, 75, 'https://placehold.co/600x600/png?text=Laptop+Backpack', 'Laptop', 'LumiHome')
) AS seed(name, description, price, stock, image_url, category_name, brand_name)
JOIN category c ON c.name = seed.category_name
JOIN brand b ON b.name = seed.brand_name
WHERE NOT EXISTS (
    SELECT 1
    FROM product existing
    WHERE existing.name = seed.name
);

INSERT INTO cart (user_id)
SELECT u.id
FROM (VALUES ('customer01'), ('customer02'), ('member-demo-1')) AS seed(username)
JOIN users u ON u.username = seed.username
WHERE NOT EXISTS (
    SELECT 1 FROM cart existing WHERE existing.user_id = u.id
);

INSERT INTO cart_item (cart_id, product_id, quantity)
SELECT c.id, p.id, seed.quantity
FROM (VALUES
    ('customer01', 'iPhone 15 128GB', 1),
    ('customer01', 'Ốp lưng chống sốc', 1),
    ('customer01', 'Sạc nhanh GaN 65W', 1),
    ('customer02', 'MacBook Air M3', 1),
    ('customer02', 'USB-C Hub 7-in-1', 1),
    ('member-demo-1', 'Bàn phím cơ K87', 1),
    ('member-demo-1', 'Chuột gaming Pro X', 2),
    ('member-demo-1', 'Tai nghe gaming 7.1', 1)
) AS seed(username, product_name, quantity)
JOIN users u ON u.username = seed.username
JOIN cart c ON c.user_id = u.id
JOIN product p ON p.name = seed.product_name
WHERE NOT EXISTS (
    SELECT 1
    FROM cart_item existing
    WHERE existing.cart_id = c.id
      AND existing.product_id = p.id
);

WITH seed_orders(tracking_code, username, customer_name, phone, address, total_amount, status, created_at, shipping_carrier, carrier_tracking_number) AS (
    VALUES
        ('11111111-1111-4111-8111-111111111111'::uuid, 'customer01', 'Nguyễn Minh Anh', '0900000011', '12 Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh', 19239000.00, 'PENDING', CURRENT_TIMESTAMP - INTERVAL '3 days', NULL, NULL),
        ('22222222-2222-4222-8222-222222222222'::uuid, 'customer02', 'Trần Quốc Bảo', '0900000012', '45 Láng Hạ, Đống Đa, Hà Nội', 28889000.00, 'CONFIRMED', CURRENT_TIMESTAMP - INTERVAL '7 days', NULL, NULL),
        ('33333333-3333-4333-8333-333333333333'::uuid, 'customer03', 'Lê Hoàng Nam', '0900000013', '18 Trần Phú, Hải Châu, Đà Nẵng', 18688000.00, 'PROCESSING', CURRENT_TIMESTAMP - INTERVAL '12 days', NULL, NULL),
        ('44444444-4444-4444-8444-444444444444'::uuid, 'customer04', 'Phạm Gia Hân', '0900000014', '80 Cách Mạng Tháng Tám, Ninh Kiều, Cần Thơ', 16789000.00, 'SHIPPED', CURRENT_TIMESTAMP - INTERVAL '18 days', 'Giao Hàng Nhanh', 'GHN-DEMO-0004'),
        ('55555555-5555-4555-8555-555555555555'::uuid, 'customer05', 'Võ Đức Minh', '0900000015', '21 Phan Chu Trinh, Hải Châu, Đà Nẵng', 8979000.00, 'COMPLETED', CURRENT_TIMESTAMP - INTERVAL '25 days', 'Viettel Post', 'VTP-DEMO-0005'),
        ('66666666-6666-4666-8666-666666666666'::uuid, 'customer06', 'Đỗ Ngọc Mai', '0900000016', '66 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh', 18138000.00, 'COMPLETED', CURRENT_TIMESTAMP - INTERVAL '31 days', 'Giao Hàng Tiết Kiệm', 'GHTK-DEMO-0006'),
        ('77777777-7777-4777-8777-777777777777'::uuid, 'customer07', 'Bùi Thanh Tùng', '0900000017', '09 Điện Biên Phủ, Bình Thạnh, TP. Hồ Chí Minh', 33889000.00, 'CANCELLED', CURRENT_TIMESTAMP - INTERVAL '39 days', NULL, NULL),
        ('88888888-8888-4888-8888-888888888888'::uuid, 'customer08', 'Nguyễn Khánh Linh', '0900000018', '102 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội', 7489000.00, 'PENDING', CURRENT_TIMESTAMP - INTERVAL '44 days', NULL, NULL),
        ('99999999-9999-4999-8999-999999999999'::uuid, 'member-demo-2', 'Thành viên Demo 2', '0900000003', '15 Võ Văn Tần, Quận 3, TP. Hồ Chí Minh', 11587000.00, 'COMPLETED', CURRENT_TIMESTAMP - INTERVAL '51 days', 'Giao Hàng Nhanh', 'GHN-DEMO-0009'),
        ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid, 'customer02', 'Trần Quốc Bảo', '0900000012', '45 Láng Hạ, Đống Đa, Hà Nội', 16797000.00, 'COMPLETED', CURRENT_TIMESTAMP - INTERVAL '60 days', 'Viettel Post', 'VTP-DEMO-0010'),
        ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'::uuid, 'customer07', 'Bùi Thanh Tùng', '0900000017', '09 Điện Biên Phủ, Bình Thạnh, TP. Hồ Chí Minh', 9888000.00, 'COMPLETED', CURRENT_TIMESTAMP - INTERVAL '72 days', 'Giao Hàng Tiết Kiệm', 'GHTK-DEMO-0011'),
        ('cccccccc-cccc-4ccc-8ccc-cccccccccccc'::uuid, 'customer08', 'Nguyễn Khánh Linh', '0900000018', '102 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội', 11278000.00, 'COMPLETED', CURRENT_TIMESTAMP - INTERVAL '86 days', 'Giao Hàng Nhanh', 'GHN-DEMO-0012')
)
INSERT INTO orders (tracking_code, user_id, customer_name, phone, address, total_amount, status, created_at, shipping_carrier, carrier_tracking_number)
SELECT s.tracking_code,
       u.id,
       s.customer_name,
       s.phone,
       s.address,
       s.total_amount,
       s.status,
       s.created_at,
       s.shipping_carrier,
       s.carrier_tracking_number
FROM seed_orders s
JOIN users u ON u.username = s.username
ON CONFLICT (tracking_code) DO NOTHING;

WITH seed_items(tracking_code, product_name, quantity, unit_price) AS (
    VALUES
        ('11111111-1111-4111-8111-111111111111'::uuid, 'iPhone 15 128GB', 1, 18990000.00),
        ('11111111-1111-4111-8111-111111111111'::uuid, 'Ốp lưng chống sốc', 1, 249000.00),
        ('22222222-2222-4222-8222-222222222222'::uuid, 'MacBook Air M3', 1, 27990000.00),
        ('22222222-2222-4222-8222-222222222222'::uuid, 'USB-C Hub 7-in-1', 1, 899000.00),
        ('33333333-3333-4333-8333-333333333333'::uuid, 'Samsung Galaxy S24', 1, 17990000.00),
        ('33333333-3333-4333-8333-333333333333'::uuid, 'Sạc nhanh GaN 65W', 1, 499000.00),
        ('33333333-3333-4333-8333-333333333333'::uuid, 'Cáp USB-C bọc dù 1m', 1, 199000.00),
        ('44444444-4444-4444-8444-444444444444'::uuid, 'Dell Inspiron 14', 1, 15990000.00),
        ('44444444-4444-4444-8444-444444444444'::uuid, 'Balo laptop chống nước', 1, 799000.00),
        ('55555555-5555-4555-8555-555555555555'::uuid, 'AirPods Pro 2', 1, 5990000.00),
        ('55555555-5555-4555-8555-555555555555'::uuid, 'JBL Flip 6', 1, 2490000.00),
        ('55555555-5555-4555-8555-555555555555'::uuid, 'Sạc nhanh GaN 65W', 1, 499000.00),
        ('66666666-6666-4666-8666-666666666666'::uuid, 'iPad Air 11 inch', 1, 16990000.00),
        ('66666666-6666-4666-8666-666666666666'::uuid, 'Ốp lưng chống sốc', 1, 249000.00),
        ('66666666-6666-4666-8666-666666666666'::uuid, 'USB-C Hub 7-in-1', 1, 899000.00),
        ('77777777-7777-4777-8777-777777777777'::uuid, 'Asus ROG Strix G16', 1, 32990000.00),
        ('77777777-7777-4777-8777-777777777777'::uuid, 'Chuột gaming Pro X', 1, 899000.00),
        ('88888888-8888-4888-8888-888888888888'::uuid, 'Xiaomi Redmi Note 13', 1, 6990000.00),
        ('88888888-8888-4888-8888-888888888888'::uuid, 'Sạc nhanh GaN 65W', 1, 499000.00),
        ('99999999-9999-4999-8999-999999999999'::uuid, 'Màn hình Gaming 27 inch', 1, 7490000.00),
        ('99999999-9999-4999-8999-999999999999'::uuid, 'Bàn phím cơ K87', 1, 1899000.00),
        ('99999999-9999-4999-8999-999999999999'::uuid, 'Chuột gaming Pro X', 1, 899000.00),
        ('99999999-9999-4999-8999-999999999999'::uuid, 'Webcam Full HD', 1, 1299000.00),
        ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid, 'Robot hút bụi S1', 1, 8999000.00),
        ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid, 'Máy lọc không khí Mini', 1, 5499000.00),
        ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid, 'Nồi chiên không dầu 5L', 1, 2299000.00),
        ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'::uuid, 'Apple Watch SE', 1, 6490000.00),
        ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'::uuid, 'Xiaomi Band 8', 1, 999000.00),
        ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'::uuid, 'SSD di động 1TB', 1, 2399000.00),
        ('cccccccc-cccc-4ccc-8ccc-cccccccccccc'::uuid, 'Sony WH-1000XM5', 1, 8490000.00),
        ('cccccccc-cccc-4ccc-8ccc-cccccccccccc'::uuid, 'Webcam Full HD', 1, 1299000.00),
        ('cccccccc-cccc-4ccc-8ccc-cccccccccccc'::uuid, 'Loa Bluetooth Mini', 1, 1290000.00),
        ('cccccccc-cccc-4ccc-8ccc-cccccccccccc'::uuid, 'Cáp USB-C bọc dù 1m', 1, 199000.00)
)
INSERT INTO order_item (order_id, product_id, quantity, unit_price)
SELECT o.id, p.id, s.quantity, s.unit_price
FROM seed_items s
JOIN orders o ON o.tracking_code = s.tracking_code
JOIN product p ON p.name = s.product_name
WHERE NOT EXISTS (
    SELECT 1
    FROM order_item existing
    WHERE existing.order_id = o.id
      AND existing.product_id = p.id
);

WITH seed_payments(tracking_code, method_name, status) AS (
    VALUES
        ('11111111-1111-4111-8111-111111111111'::uuid, 'CASH', 'UNPAID'),
        ('22222222-2222-4222-8222-222222222222'::uuid, 'BANK_TRANSFER', 'PENDING'),
        ('33333333-3333-4333-8333-333333333333'::uuid, 'BANK_TRANSFER', 'PAID'),
        ('44444444-4444-4444-8444-444444444444'::uuid, 'CASH', 'PAID'),
        ('55555555-5555-4555-8555-555555555555'::uuid, 'BANK_TRANSFER', 'PAID'),
        ('66666666-6666-4666-8666-666666666666'::uuid, 'BANK_TRANSFER', 'PAID'),
        ('77777777-7777-4777-8777-777777777777'::uuid, 'CASH', 'REFUNDED'),
        ('88888888-8888-4888-8888-888888888888'::uuid, 'CASH', 'UNPAID'),
        ('99999999-9999-4999-8999-999999999999'::uuid, 'BANK_TRANSFER', 'PAID'),
        ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid, 'BANK_TRANSFER', 'PAID'),
        ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'::uuid, 'CASH', 'PAID'),
        ('cccccccc-cccc-4ccc-8ccc-cccccccccccc'::uuid, 'BANK_TRANSFER', 'PAID')
)
INSERT INTO payments (method_name, status, order_id)
SELECT s.method_name, s.status, o.id
FROM seed_payments s
JOIN orders o ON o.tracking_code = s.tracking_code
WHERE NOT EXISTS (
    SELECT 1 FROM payments existing WHERE existing.order_id = o.id
);

WITH seed_reviews(username, product_name, rating, comment, created_at) AS (
    VALUES
        ('customer05', 'AirPods Pro 2', 5, 'Chống ồn tốt, đeo lâu vẫn thoải mái.', CURRENT_TIMESTAMP - INTERVAL '23 days'),
        ('customer05', 'JBL Flip 6', 4, 'Âm lượng lớn, pin dùng được nhiều giờ.', CURRENT_TIMESTAMP - INTERVAL '22 days'),
        ('customer05', 'Sạc nhanh GaN 65W', 5, 'Củ sạc nhỏ gọn và sạc laptop rất tiện.', CURRENT_TIMESTAMP - INTERVAL '21 days'),
        ('customer06', 'iPad Air 11 inch', 5, 'Màn hình đẹp, phù hợp để học và ghi chú.', CURRENT_TIMESTAMP - INTERVAL '29 days'),
        ('customer06', 'Ốp lưng chống sốc', 4, 'Ốp vừa máy và cầm khá chắc tay.', CURRENT_TIMESTAMP - INTERVAL '28 days'),
        ('customer06', 'USB-C Hub 7-in-1', 5, 'Có đủ cổng cần thiết cho MacBook và iPad.', CURRENT_TIMESTAMP - INTERVAL '27 days'),
        ('member-demo-2', 'Màn hình Gaming 27 inch', 5, 'Tần số quét cao, màu sắc tốt trong tầm giá.', CURRENT_TIMESTAMP - INTERVAL '48 days'),
        ('member-demo-2', 'Bàn phím cơ K87', 4, 'Gõ êm, đèn RGB dễ tùy chỉnh.', CURRENT_TIMESTAMP - INTERVAL '47 days'),
        ('member-demo-2', 'Chuột gaming Pro X', 5, 'Chuột nhẹ và tracking ổn định.', CURRENT_TIMESTAMP - INTERVAL '46 days'),
        ('member-demo-2', 'Webcam Full HD', 4, 'Hình ảnh rõ khi họp trực tuyến.', CURRENT_TIMESTAMP - INTERVAL '45 days'),
        ('customer02', 'Robot hút bụi S1', 5, 'Khả năng lập bản đồ và hút bụi tốt.', CURRENT_TIMESTAMP - INTERVAL '57 days'),
        ('customer02', 'Máy lọc không khí Mini', 4, 'Hoạt động êm, phù hợp phòng ngủ.', CURRENT_TIMESTAMP - INTERVAL '56 days'),
        ('customer02', 'Nồi chiên không dầu 5L', 5, 'Dung tích vừa đủ cho gia đình nhỏ.', CURRENT_TIMESTAMP - INTERVAL '55 days'),
        ('customer07', 'Apple Watch SE', 5, 'Theo dõi vận động và thông báo rất tiện.', CURRENT_TIMESTAMP - INTERVAL '69 days'),
        ('customer07', 'Xiaomi Band 8', 4, 'Pin tốt, đeo nhẹ cả ngày.', CURRENT_TIMESTAMP - INTERVAL '68 days'),
        ('customer07', 'SSD di động 1TB', 5, 'Tốc độ sao chép nhanh và thiết kế chắc chắn.', CURRENT_TIMESTAMP - INTERVAL '67 days'),
        ('customer08', 'Sony WH-1000XM5', 5, 'Chống ồn xuất sắc, âm thanh chi tiết.', CURRENT_TIMESTAMP - INTERVAL '82 days'),
        ('customer08', 'Webcam Full HD', 4, 'Dùng tốt cho lớp học và cuộc họp.', CURRENT_TIMESTAMP - INTERVAL '81 days'),
        ('customer08', 'Loa Bluetooth Mini', 4, 'Nhỏ gọn, âm thanh đủ tốt cho phòng cá nhân.', CURRENT_TIMESTAMP - INTERVAL '80 days'),
        ('customer08', 'Cáp USB-C bọc dù 1m', 5, 'Dây chắc chắn, sạc ổn định.', CURRENT_TIMESTAMP - INTERVAL '79 days')
)
INSERT INTO review (user_id, product_id, rating, comment, created_at)
SELECT u.id, p.id, s.rating, s.comment, s.created_at
FROM seed_reviews s
JOIN users u ON u.username = s.username
JOIN product p ON p.name = s.product_name
WHERE NOT EXISTS (
    SELECT 1
    FROM review existing
    WHERE existing.user_id = u.id
      AND existing.product_id = p.id
      AND existing.comment = s.comment
);

-- Keep identity sequences above any rows that may have been inserted before this migration.
SELECT setval(
    pg_get_serial_sequence('users', 'id'),
    GREATEST(COALESCE((SELECT MAX(id) FROM users), 1), 1),
    true
);
SELECT setval(
    pg_get_serial_sequence('category', 'id'),
    GREATEST(COALESCE((SELECT MAX(id) FROM category), 1), 1),
    true
);
SELECT setval(
    pg_get_serial_sequence('brand', 'id'),
    GREATEST(COALESCE((SELECT MAX(id) FROM brand), 1), 1),
    true
);
SELECT setval(
    pg_get_serial_sequence('product', 'id'),
    GREATEST(COALESCE((SELECT MAX(id) FROM product), 1), 1),
    true
);
SELECT setval(
    pg_get_serial_sequence('cart', 'id'),
    GREATEST(COALESCE((SELECT MAX(id) FROM cart), 1), 1),
    true
);
SELECT setval(
    pg_get_serial_sequence('cart_item', 'id'),
    GREATEST(COALESCE((SELECT MAX(id) FROM cart_item), 1), 1),
    true
);
SELECT setval(
    pg_get_serial_sequence('orders', 'id'),
    GREATEST(COALESCE((SELECT MAX(id) FROM orders), 1), 1),
    true
);
SELECT setval(
    pg_get_serial_sequence('order_item', 'id'),
    GREATEST(COALESCE((SELECT MAX(id) FROM order_item), 1), 1),
    true
);
SELECT setval(
    pg_get_serial_sequence('payments', 'payment_id'),
    GREATEST(COALESCE((SELECT MAX(payment_id) FROM payments), 1), 1),
    true
);
SELECT setval(
    pg_get_serial_sequence('review', 'id'),
    GREATEST(COALESCE((SELECT MAX(id) FROM review), 1), 1),
    true
);
