# Use case: Đặt và thanh toán đơn hàng

## 1. Mã use case
UC-01

## 2. Tóm tắt
Khách hàng truy cập menu, chọn món, xác nhận đơn hàng và thực hiện thanh toán. Hệ thống lưu đơn hàng, xác nhận giao dịch và cập nhật trạng thái đơn cho khách hàng và nhân viên quầy.

## 3. Actor
- Khách hàng
- Nhân viên quầy
- Hệ thống
- Đơn vị thanh toán (mô phỏng hoặc thực tế trong tương lai)

## 4. Trigger
Khách hàng bắt đầu quy trình khi chọn món từ menu và chọn nút “Đặt hàng” hoặc “Thanh toán”.

## 5. Tiền điều kiện
- Người dùng đã đăng nhập hoặc có quyền truy cập hợp lệ.
- Menu sản phẩm đang có sẵn.
- Một hoặc nhiều món đã được thêm vào giỏ hàng.
- Hệ thống có thể xử lý giao dịch thanh toán trong luồng chính.

## 6. Hậu điều kiện
- Đơn hàng được lưu trong hệ thống.
- Thanh toán được xác nhận hoặc bị từ chối rõ ràng.
- Trạng thái đơn hàng được cập nhật.
- Khách hàng nhận được xác nhận thành công hoặc lỗi cụ thể.

## 7. Luồng chính
1. Khách hàng mở menu BrewLite.
2. Khách hàng chọn sản phẩm từ danh sách menu.
3. Hệ thống hiển thị thông tin chi tiết sản phẩm nếu cần.
4. Khách hàng thêm món vào giỏ hàng.
5. Hệ thống cập nhật giỏ hàng và tính tổng tiền tạm thời.
6. Khách hàng xem lại giỏ hàng và xác nhận đơn hàng.
7. Hệ thống kiểm tra dữ liệu đơn hàng và tính tổng giá trị.
8. Khách hàng chọn phương thức thanh toán và gửi yêu cầu thanh toán.
9. Hệ thống gửi yêu cầu thanh toán đến payment service.
10. Payment service xác nhận giao dịch thành công.
11. Hệ thống lưu đơn hàng và cập nhật trạng thái thành “đã thanh toán” hoặc “đang xử lý”.
12. Hệ thống hiển thị xác nhận cho khách hàng và thông báo cho nhân viên quầy.

## 8. Luồng thay thế
- Nếu khách hàng muốn sửa số lượng hoặc xóa món trước khi xác nhận, hệ thống cập nhật giỏ hàng và tổng tiền theo thời gian thực.
- Nếu khách hàng chọn phương thức thanh toán khác, hệ thống nhận và xử lý theo phương thức tương ứng.
- Nếu sản phẩm không còn khả dụng sau khi khách hàng chọn, hệ thống yêu cầu khách hàng chọn món khác và không tiếp tục thanh toán.

## 9. Luồng ngoại lệ
- Thanh toán thất bại: hệ thống hiển thị thông báo lỗi và cho phép người dùng thử lại hoặc hủy.
- Mã đơn hàng không hợp lệ hoặc thiếu dữ liệu: hệ thống từ chối thao tác và yêu cầu điền lại thông tin.
- Hệ thống database không khả dụng hoặc timeout: hệ thống báo lỗi và không xác nhận đơn hàng kiểu bỏ qua.
- Khách hàng hủy trước khi thanh toán: hệ thống hủy quá trình đặt hàng và quay về trạng thái giỏ hàng.

## 10. Yêu cầu liên kết

| Mã yêu cầu | Mô tả |
| --- | --- |
| FR-01 | Xem menu |
| FR-02 | Xem chi tiết sản phẩm |
| FR-03 | Thêm vào giỏ hàng |
| FR-04 | Quản lý giỏ hàng |
| FR-05 | Xác thực người dùng |
| FR-06 | Đặt đơn hàng |
| FR-07 | Thanh toán |
| FR-08 | Xác nhận đơn hàng và thanh toán |
| FR-09 | Lịch sử đơn hàng |
| FR-10 | Quản lý trạng thái đơn |
| NFR-01 | Hiệu năng |
| NFR-02 | Tính khả dụng |
| NFR-03 | Bảo mật |

## 11. Tiêu chí chấp nhận

- Khách hàng có thể chọn món và xem tổng tiền chính xác trước khi đặt hàng.
- Đơn hàng được tạo thành công sau khi xác nhận.
- Thanh toán thành công được lưu và phản hồi rõ ràng cho khách hàng.
- Trạng thái đơn hàng dễ xác định và có thể được quản lý bởi nhân viên quầy.
- Luồng thành công và luồng lỗi cơ bản đều có phản hồi rõ ràng và không làm gián đoạn hệ thống.

## 12. Ghi chú

Use case này là luồng nghiệp vụ trọng tâm của BrewLite và là cơ sở để thiết kế test trong các task tiếp theo như unit test, integration test và end-to-end test.
