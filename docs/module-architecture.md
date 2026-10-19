# Kiến trúc module

Backend được tổ chức theo feature/module thay vì gom toàn bộ class theo layer ngang. Mỗi module chứa các thành phần liên quan trong cùng một package:

- `auth`: đăng ký, đăng nhập và JWT security.
- `user`: user entity, repository và DTO.
- `product`: product, brand, category cùng controller/service/repository/mapper/DTO.
- `cart`: giỏ hàng và cart item.
- `order`: đơn hàng, order item và mapper.
- `membership`: hạng thành viên.
- `review`: đánh giá sản phẩm.
- `shared`: thành phần dùng chung như exception và response DTO.
- `config`: cấu hình ứng dụng dùng chung.

Ví dụ cấu trúc module:

```text
src/main/java/E_Market_Management/product/
├── controller/
├── dto/
├── entity/
├── mapper/
├── repository/
└── service/
```

Các API route và schema Flyway được giữ nguyên; thay đổi này tổ chức lại boundary của mã nguồn theo module.
