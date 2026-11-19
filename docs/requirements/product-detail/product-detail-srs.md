# SRS - Chi tiết sản phẩm

## 1. Mục tiêu hệ thống

Phân hệ **Chi tiết sản phẩm** thuộc hệ thống **BrewLite** có nhiệm vụ hiển thị đầy đủ thông tin của một sản phẩm đồ uống khi khách hàng chọn từ Menu. Phân hệ này sử dụng API `GET /products/:id` và đóng vai trò nguồn dữ liệu chuẩn cho các bước thêm vào giỏ hàng và đặt đơn.

## 2. Yêu cầu chức năng

### FR-PD-01: Xem chi tiết sản phẩm
Hệ thống cho phép khách hàng chọn một món trên Menu để xem đầy đủ thông tin chi tiết của sản phẩm đó.

**Tiêu chí chấp nhận**
- Khi chọn một sản phẩm, hệ thống gọi `GET /products/:id` và hiển thị trang hoặc modal chi tiết sản phẩm.
- Thông tin hiển thị bao gồm: tên món, hình ảnh, mô tả chi tiết (`description`), đơn giá (`price`), số lượng tồn kho hiện có (`stock`) và các tùy chọn đi kèm (nếu có).
- Nếu `id` sản phẩm không tồn tại hoặc không hợp lệ, API trả về mã lỗi `HTTP 404 Not Found` và giao diện hiển thị thông báo sản phẩm không tồn tại kèm liên kết quay lại Menu.

### FR-PD-02: Hiển thị trạng thái tồn kho
Hệ thống hiển thị trạng thái khả dụng của sản phẩm dựa trên số lượng tồn kho (`stock`).

**Tiêu chí chấp nhận**
- Sản phẩm có `stock > 0` được hiển thị trạng thái "Còn hàng" và cho phép chọn số lượng từ `1` đến `stock`.
- Sản phẩm có `stock = 0` hiển thị nhãn "Hết hàng" và không cho phép thêm vào giỏ hàng.

### FR-PD-03: Cung cấp API chi tiết sản phẩm
Backend NestJS cung cấp API `GET /products/:id` để Frontend và các module khác truy xuất chi tiết sản phẩm.

**Tiêu chí chấp nhận**
- Trả về `HTTP 200 OK` cùng đối tượng chi tiết sản phẩm nếu tìm thấy.
- Trả về `HTTP 404 Not Found` nếu không tìm thấy sản phẩm.

## 3. Yêu cầu phi chức năng

| Mã | Yêu cầu | Ưu tiên | Tiêu chí chấp nhận |
| --- | --- | --- | --- |
| NFR-PD-01 | Hiệu năng | Must | API `GET /products/:id` có thời gian phản hồi trung bình ≤ 300 ms trong môi trường local/demo. |
| NFR-PD-02 | Tính toàn vẹn dữ liệu | Must | Đơn giá (`price`) luôn dương và tồn kho (`stock`) luôn là số nguyên không âm; dữ liệu UI khớp 100% với API. |
| NFR-PD-03 | Bảo mật | Must | Tham số `id` được kiểm tra hợp lệ; không lộ thông tin nhạy cảm trong response lỗi. |

## 4. Quy tắc nghiệp vụ

1. Mỗi sản phẩm phải có `id` duy nhất và `name` không được rỗng.
2. Đơn giá sản phẩm (`price`) phải lớn hơn 0.
3. Tồn kho (`stock`) phải là số nguyên không âm; nếu `stock = 0`, sản phẩm được coi là hết hàng.
4. Khách hàng kể cả chưa đăng nhập đều có quyền xem chi tiết sản phẩm.
5. Việc trừ tồn kho chính thức khi mua hàng phải được thực hiện trong transaction của module Order/Checkout.