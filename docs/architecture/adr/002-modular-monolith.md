# ADR 002 - Kiến trúc modular monolith

## Trạng thái
Đã chấp nhận

## Bối cảnh
MVP của BrewLite cần phân tách domain rõ ràng mà không phức tạp như microservices.

## Quyết định
Sử dụng modular monolith phân lớp: frontend Next.js, backend NestJS tổ chức theo module domain, cơ sở dữ liệu PostgreSQL.

## Hệ quả
- Triển khai và kiểm thử dễ hơn
- Các module domain có thể tách riêng sau này nếu cần
- Cần kỷ luật trong việc giữ ranh giới module