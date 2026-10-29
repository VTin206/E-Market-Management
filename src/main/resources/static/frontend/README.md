# E-Market Frontend

Frontend nằm trong `src/main/resources/static/frontend` và chỉ gồm HTML, CSS, JavaScript thuần.

## Cấu trúc

- `index.html`: storefront, đăng nhập/đăng ký, giỏ hàng, checkout và lịch sử đơn.
- `css/styles.css`: toàn bộ giao diện responsive lấy cảm hứng từ Dola Phone.
- `js/data.js`: dữ liệu demo khi backend chưa trả được sản phẩm.
- `js/api.js`: lớp gọi API backend, quản lý JWT trong `localStorage`.
- `js/app.js`: render UI, tìm kiếm/lọc sản phẩm, đồng bộ giỏ, đặt hàng và xem đơn.
- `assets/product-iphone.svg`: tài sản SVG hiện có; card dùng `imageUrl` từ API hoặc mock CSS khi chưa có ảnh.

## API backend đang dùng

- `GET /api/products`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/{itemId}`
- `DELETE /api/cart/items/{itemId}`
- `POST /api/orders`
- `GET /api/orders/me`

Khách chưa đăng nhập gửi danh sách `items` khi tạo đơn. Người dùng đã đăng nhập đặt hàng từ giỏ hàng backend; frontend gửi kèm thông tin người nhận và địa chỉ.

Khi mở bằng file trực tiếp, frontend mặc định gọi backend tại `http://localhost:8080`.
Khi chạy cùng Spring Boot và truy cập cùng origin, frontend dùng relative API path.
Nếu backend chạy ở origin khác, đặt `window.EMARKET_API_BASE` trước khi nạp `js/api.js`.
