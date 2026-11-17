# Thiết lập và quy trình repository

## Cấu trúc

- `apps/web` - Frontend Next.js mobile-first
- `apps/api` - Backend NestJS
- `docs` - Yêu cầu, sơ đồ, kiến trúc và truy vết
- `tests` - Kiểm thử tích hợp và end-to-end

## Chiến lược nhánh

- `main` - nhánh ổn định
- `develop` - nhánh tích hợp
- `feature/<ten>` - nhánh tính năng

## Quy ước commit

- `feat:` tính năng mới
- `fix:` sửa lỗi
- `docs:` tài liệu
- `test:` kiểm thử
- `chore:` bảo trì

## Quy tắc pull request

- CI phải pass: install, lint, unit test, build
- Ít nhất một review trước khi merge
- Không commit secret

## Định nghĩa hoàn thành

- Code biên dịch và kiểm thử pass
- Tài liệu được cập nhật
- Health check hoạt động
- Không có lỗi lint