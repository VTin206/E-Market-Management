# E-Market Frontend Demo

Frontend demo nằm trong `src/main/resources/static/frontend` và chỉ gồm HTML, CSS, JavaScript thuần.

## Cấu trúc

- `index.html`: layout chính, auth modal, cart drawer, product detail.
- `css/styles.css`: toàn bộ giao diện responsive lấy cảm hứng từ Dola Phone.
- `js/data.js`: dữ liệu demo khi backend chưa trả được sản phẩm.
- `js/api.js`: lớp gọi API backend, quản lý JWT trong `localStorage`.
- `js/app.js`: render UI, xử lý tìm kiếm, tab sản phẩm, cart, login/register.
- `assets/product-iphone.svg`: ảnh sản phẩm tạm dùng chung cho toàn bộ card/detail.

## API backend đang dùng

- `GET /api/products`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/cart/items`
- `GET /api/cart`

Khi mở bằng file trực tiếp, frontend mặc định gọi backend tại `http://localhost:8080`.
Khi chạy cùng Spring Boot và truy cập cùng origin, frontend dùng relative API path.
