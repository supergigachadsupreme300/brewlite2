# ADR 001 - Cấu trúc monorepo

## Trạng thái
Đã chấp nhận

## Bối cảnh
BrewLite cần phát triển frontend và backend song song, cùng tài liệu và CI chung.

## Quyết định
Sử dụng monorepo với `apps/web`, `apps/api`, `docs` và `tests`.

## Hệ quả
- CI và tài liệu dùng chung
- Cài đặt local đơn giản hơn với Docker Compose
- Kích thước repository lớn hơn một chút