# ADR 004 - Dịch vụ thanh toán mô phỏng

## Trạng thái
Đã chấp nhận

## Bối cảnh
Bài tập không yêu cầu tích hợp cổng thanh toán thật.

## Quyết định
Sử dụng dịch vụ thanh toán mô phỏng với hai kết quả `SUCCESS` và `FAILED`. Giao diện demo cho phép chọn kết quả để kiểm thử cả hai luồng.

## Hệ quả
- MVP hoàn thành nhanh hơn
- Kiểm thử luồng đặt đơn rõ ràng hơn
- Bản demo Task 4 dùng đơn mẫu và lưu idempotency trong bộ nhớ của tiến trình; dữ liệu mất khi API khởi động lại.
- Không có xác thực, database Order/Payment hoặc kết nối cổng thanh toán thật trong bản demo.
- Không thu thập hoặc lưu thông tin thẻ thật.
- Cần thay thế khi tích hợp thanh toán thật sau này