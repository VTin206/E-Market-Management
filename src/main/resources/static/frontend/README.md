# E-Market Frontend

Frontend nằm trong `src/main/resources/static/frontend` và chỉ gồm HTML, CSS, JavaScript thuần.

## Cấu trúc

- `index.html`: storefront, đăng nhập/đăng ký, giỏ hàng, checkout và lịch sử đơn.
- `css/styles.css`: toàn bộ giao diện responsive lấy cảm hứng từ Dola Phone.
- `js/api.js`: lớp gọi API backend, quản lý JWT trong `localStorage`.
- `js/app.js`: render UI từ dữ liệu backend, tìm kiếm/lọc sản phẩm, đồng bộ giỏ, đặt hàng và xem đơn.
- Sản phẩm dùng ảnh trong trường `imageUrl`; nếu chưa có ảnh, giao diện báo rõ trạng thái thiếu ảnh.
- Khi backend không khả dụng, giao diện hiển thị lỗi và nút thử tải lại; không nạp dữ liệu mẫu.

## API backend đang dùng

## Đánh giá sản phẩm

- `GET /api/reviews?productId={productId}`: đọc đánh giá công khai trên trang chi tiết sản phẩm.
- `GET /api/reviews/{reviewId}`: đọc một đánh giá công khai.
- `POST /api/reviews/product/{productId}`: khách hàng/thành viên đã đăng nhập gửi đánh giá (`rating` từ 1 đến 5, `comment` tùy chọn).
- `PUT /api/reviews/{reviewId}` và `DELETE /api/reviews/{reviewId}`: chủ đánh giá hoặc admin.

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
