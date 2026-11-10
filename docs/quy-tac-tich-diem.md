# Quy tắc tích điểm và hạng thành viên (MVP)

> Các hạng và mốc điểm bên dưới đã được cố định trong backend. Điểm được cộng và hạng được cập nhật khi đơn chuyển sang `COMPLETED`. Backend chưa xử lý thu hồi điểm nếu đơn đã hoàn tất bị hoàn hoặc điều chỉnh. Cần kiểm tra biên lợi nhuận trước khi áp dụng ưu đãi thực tế.

## 1. Cách tích điểm

- Tài khoản khách hàng tích lũy **1 điểm cho mỗi 10.000đ** tiền sản phẩm đủ điều kiện.
- Số điểm được làm tròn xuống: `điểm = floor(tổng tiền sản phẩm thực trả / 10.000)`.
- Tính trên tiền sản phẩm sau khi áp dụng giảm giá; không tính phí vận chuyển.
- Chỉ cộng điểm khi đơn hàng được chuyển sang `COMPLETED`. Không cộng khi đơn mới tạo, đang xử lý hoặc đã hủy.
- Với đơn bị hoàn hoặc điều chỉnh sau khi hoàn tất, cần thu hồi số điểm tương ứng.

Ví dụ: tổng tiền sản phẩm thực trả 4.999.999đ được 499 điểm; 5.000.000đ được 500 điểm.

## 2. Hạng thành viên

Điểm dùng để xét hạng là **điểm tích lũy trọn đời**. Điểm không bị trừ khi khách lên hạng và không hết hạn trong chính sách MVP này.

| Hạng | Điểm yêu cầu | Ưu đãi dự kiến |
| --- | ---: | ---: |
| Thành viên | 0 | 0% |
| Bạc | 500 | 1% |
| Vàng | 2.000 | 2% |
| Kim cương | 5.000 | 3% |

Các ngưỡng tương ứng khoảng 0đ, 5 triệu, 20 triệu và 50 triệu đồng chi tiêu đủ điều kiện. Mức phần trăm là giá trị khởi điểm để mô phỏng, chưa phải cam kết cuối cùng.

## 3. Áp dụng ưu đãi

- Hạng hiện tại quyết định phần trăm ưu đãi cho đơn tiếp theo.
- Không cộng dồn ưu đãi thành viên với mã khuyến mãi trong phiên bản MVP.
- Tính điểm trên số tiền sản phẩm sau ưu đãi thành viên.
- Trước khi bật mức 1–3%, cần kiểm tra biên lợi nhuận theo nhóm hàng; có thể loại trừ sản phẩm đang giảm giá hoặc nhóm hàng có biên lợi nhuận thấp.

## 4. Phạm vi MVP

- Điểm chỉ dùng để xét hạng, chưa đổi thành tiền hoặc phần thưởng.
- Backend cộng điểm khi đơn hoàn tất và cập nhật hạng dựa trên tổng điểm tích lũy.
- Hiện `User.points` là một trường điểm duy nhất. Nếu triển khai đổi điểm sau này, cần tách số dư có thể tiêu khỏi điểm tích lũy trọn đời và lưu lịch sử cộng, trừ, hoàn điểm theo từng đơn hàng.
