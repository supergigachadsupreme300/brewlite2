# Use case - Xem chi tiết sản phẩm

## Actor
Khách hàng

## Trigger
Khách hàng chọn một sản phẩm từ Menu.

## Tiền điều kiện
- Sản phẩm tồn tại trong hệ thống.

## Hậu điều kiện
- Thông tin chi tiết sản phẩm được hiển thị.

## Luồng chính
1. Khách hàng chọn sản phẩm.
2. Hệ thống gọi API `GET /products/:id`.
3. Hệ thống nhận dữ liệu sản phẩm.
4. Hệ thống hiển thị trang chi tiết sản phẩm với tên món, hình ảnh, mô tả, đơn giá, tồn kho và tùy chọn đi kèm.

## Luồng thay thế
- Nếu sản phẩm hết hàng (`stock = 0`), hệ thống vẫn hiển thị thông tin và trạng thái hết hàng.

## Luồng ngoại lệ
- Nếu sản phẩm không tồn tại, hệ thống trả về `HTTP 404 Not Found` và hiển thị thông báo lỗi kèm liên kết quay lại Menu.