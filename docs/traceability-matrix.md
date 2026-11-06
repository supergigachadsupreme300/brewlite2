# Ma trận truy nguyên yêu cầu

Tài liệu này liên kết yêu cầu nghiệp vụ và kiến trúc của BrewLite với các tài liệu và biểu đồ có trong repository. Phần này tập trung vào mối liên hệ giữa use case, kiến trúc hệ thống và công việc triển khai / kiểm thử.

## Ánh xạ yêu cầu

| Mã yêu cầu | User story / Use case | Thiết kế / Biểu đồ | Code / API | Phạm vi kiểm thử |
| --- | --- | --- | --- | --- |
| FR-01 | Khách hàng lựa chọn món và đặt hàng | `docs/requirements/use-case-place-and-pay.md`, `docs/diagrams/sequence-checkout.puml` | API order module trong `apps/api/src` | Integration và E2E tests |
| FR-02 | Khách hàng thanh toán đơn hàng | `docs/requirements/use-case-place-and-pay.md` | API payment module và order flow | Integration và E2E tests |
| FR-03 | Khách hàng xem trạng thái đơn | `docs/architecture/architecture.md` | API response model và frontend flow | Integration tests |
| NFR-01 | Hệ thống có thể triển khai ổn định | `docs/architecture/architecture.md` | Docker / deployment configuration | Smoke test và health check |
| NFR-02 | Hệ thống dễ bảo trì | `docs/architecture/architecture.md` | Module/domain structure | Unit test và review architecture |
| NFR-03 | Quản lý configuration và bảo mật | `docs/architecture/architecture.md` | Environment variables và secret handling | CI và deployment validation |

## Ghi chú

- Requirement và use case tập trung vào luồng nghiệp vụ của BrewLite.
- Architecture mô tả toàn bộ hệ thống và deployment mục tiêu.
- PlantUML source file vẫn được lưu trong `docs/diagrams` và không bị thay bằng hình ảnh.
- Tài liệu này được thiết kế để dễ truy vết giữa use case, thiết kế và triển khai mà không cần giữ các file ADR riêng lẻ.
