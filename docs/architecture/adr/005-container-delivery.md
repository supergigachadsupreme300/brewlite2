# ADR-005: CONTAINERIZED DEVELOPMENT AND DELIVERY

- Status: Proposed

## Context

Nhóm cần môi trường phát triển thống nhất giữa các thành viên và khả năng triển khai các thành phần độc lập.

## Decision

Sử dụng Docker và Docker Compose để chạy các thành phần cần thiết trong môi trường cục bộ.

Việc sử dụng container cho production chỉ được xác nhận sau khi nhóm chọn nền tảng triển khai thực tế.

## Consequences

Positive:
- Môi trường chạy nhất quán.
- Dễ khởi động frontend, backend và database.
- Hỗ trợ CI/CD.

Negative:
- Cần quản lý Dockerfile và cấu hình.
- Cần bảo vệ secret.
- Cần quản lý persistent volume cho database.

## Alternatives

- Cài trực tiếp từng dịch vụ.
- Sử dụng nền tảng PaaS mà không tự quản lý container.

## Rationale

Docker Compose phù hợp với môi trường phát triển hiện tại. Production cần được quyết định dựa trên nền tảng thực tế của nhóm.