# ADR 003 - PostgreSQL là cơ sở dữ liệu chính

## Trạng thái
Đã chấp nhận

## Bối cảnh
Đơn hàng, thanh toán và tồn kho cần tính nhất quán transaction.

## Quyết định
Sử dụng PostgreSQL với migration theo phiên bản.

## Hệ quả
- Nhất quán mạnh và mô hình dữ liệu quan hệ
- Cần quản lý migration
- Phù hợp cho local và production