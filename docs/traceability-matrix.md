# Ma trận truy vết yêu cầu

| Mã yêu cầu | Use-case/User Story                   | Thiết kế/Sơ đồ                                                                 | Code/API         | Test                                             |
| ---------- | ------------------------------------- | ------------------------------------------------------------------------------ | ---------------- | ------------------------------------------------ |
| FR-01      | US-01 Xem menu                        | `docs/diagrams/activity-end-to-end.puml`, `docs/diagrams/class-domain.puml`     | `GET /products`  | `apps/api/src/products/products.service.spec.ts` |
| FR-02      | US-02 Xem chi tiết sản phẩm           | `docs/diagrams/product-detail/product-detail-sequence.puml`                    | `GET /products/:id` | `apps/api/src/products/products.controller.spec.ts` |
| FR-03      | US-03 Thêm vào giỏ hàng               | `docs/diagrams/cart/cart-sequence-checkout.puml`                               |                  |                                                  |
| FR-04      | US-04 Quản lý giỏ hàng                | `docs/diagrams/cart/cart-activity.puml`                                        |                  |                                                  |
| FR-05      | UC-01 Xác thực người dùng             | `docs/diagrams/login/login-sequence-diagram.puml`                              |                  |                                                  |
| FR-06      | US-06 Đặt đơn hàng                    | `docs/diagrams/sequence-checkout.puml`                                         |                  |                                                  |
| FR-07      | US-07 Thanh toán                      | `docs/diagrams/payment/sequence-checkout.puml`                                 |                  |                                                  |
| FR-08      | US-08 Xác nhận đơn hàng và thanh toán | `docs/diagrams/sequence-checkout.puml`                                         |                  |                                                  |
| FR-09      | US-09 Xem lịch sử đơn hàng            | `docs/diagrams/order-history/sequence-order-history-list.puml`                 |                  |                                                  |
| FR-10      | US-10 Quản lý trạng thái đơn          | `docs/diagrams/order/activity-order.puml`                                      |                  |                                                  |
| FR-11      | US-11 Health check                    | `docs/diagrams/deployment.puml`                                                | `GET /health`    | `apps/api/src/app.service.spec.ts`               |
| NFR-01     | Hiệu năng                             | `docs/diagrams/deployment.puml`                                                |                  |                                                  |
| NFR-02     | Tính khả dụng                         | `docs/architecture/architecture.md`                                            |                  |                                                  |
| NFR-03     | Bảo mật                               | `docs/architecture/architecture.md`                                            |                  |                                                  |
| NFR-04     | Khả năng mở rộng                      | `docs/architecture/architecture.md`                                            |                  |                                                  |
| NFR-05     | Khả năng triển khai                   | `docs/diagrams/deployment.puml`                                                |                  |                                                  |