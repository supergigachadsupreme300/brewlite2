# Tổng hợp thay đổi trong phiên làm việc

## 1. Trạng thái các chức năng MVP

| # | Chức năng | Trạng thái | Ghi chú |
|---|-----------|------------|---------|
| 1 | Chi tiết sản phẩm (Product Detail) | CẬP NHẬT (thiếu) | Chỉ bổ sung validate id + tùy chọn size/đường/đá + test; không tạo mới từ đầu |
| 2 | Lịch sử đơn hàng (Order History) | MỚI (chưa nghiệm thu) | Frontend danh sách/tìm kiếm/lọc + backend sort + test |
| 3 | Đăng nhập / Xác thực (Login / Auth) | MỚI (chưa nghiệm thu) | Backend auth module + frontend trang login + test |
| 4 | Giỏ hàng (Cart) | MỚI (chưa nghiệm thu) | Thư viện logic + trang giỏ hàng + badge header + test |
| 5 | Thực đơn (Product Menu) | HOÀN THIỆN | Đã có sẵn, không chỉnh sửa trong phiên này |
| 6 | Đơn hàng (Order) | CẬP NHẬT (thiếu) | Đã thêm JWT guard + kiểm tra quyền sở hữu; dữ liệu vẫn in-memory |
| 7 | Thanh toán (Payment) | CẬP NHẬT (thiếu) | Đã thêm JWT guard + kiểm tra quyền sở hữu; enum phương thức chưa đồng nhất |

## 2. Chi tiết từng chức năng

### 2.1 Chi tiết sản phẩm (Product Detail) — CẬP NHẬT (thiếu)
- Backend: bổ sung validate id trong findOne (rỗng → 400, không tìm thấy → 404); trang chi tiết đã có sẵn trước.
- Frontend: bổ sung tùy chọn size/đường/đá, số lượng, tổng giá và nút thêm vào giỏ trên trang /products/[id] và modal.
- Kiểm thử: unit (products.service, products.controller) và integration (product-detail.spec.ts).
- Còn thiếu: topping chưa có trong mô hình dữ liệu; chưa có JWT guard.

### 2.2 Lịch sử đơn hàng (Order History) — MỚI (chưa nghiệm thu)
- Frontend: trang /orders hiển thị danh sách đơn hàng sắp xếp mới nhất trước, tìm kiếm theo mã đơn (không phân biệt hoa thường), lọc theo trạng thái, kết hợp cả hai điều kiện, trạng thái loading/empty/no-results/error + retry.
- Kết hợp dữ liệu từ API GET /orders và dữ liệu mock trong localStorage (brewlite_mock_orders), API ưu tiên khi trùng mã.
- Backend: findAll() sắp xếp theo createdAt giảm dần (có tie-break theo thứ tự chèn).
- Kiểm thử: unit (orders.service) và integration (orders.spec.ts).

### 2.3 Đăng nhập / Xác thực (Login / Auth) — MỚI (chưa nghiệm thu)
- Backend: module auth với POST /auth/register, POST /auth/login, GET /auth/me; hash mật khẩu bằng scrypt; phát hành và xác minh JWT (HMAC-SHA256, không cần thư viện ngoài).
- Frontend: trang /login hỗ trợ đăng ký/đăng nhập, lưu JWT vào localStorage (token, brewlite_jwt) để checkout sử dụng.
- Kiểm thử: unit (auth.service.spec.ts) và integration (auth.spec.ts).

### 2.4 Giỏ hàng (Cart) — MỚI (chưa nghiệm thu)
- Tách logic giỏ hàng thành thư viện thuần apps/web/src/lib/cart.ts (read/write/add/update/remove/clear/subtotal/totalItems) với storage injectable để dễ kiểm thử.
- Trang /cart quản lý giỏ hàng: xem, tăng/giảm số lượng, xóa món, xóa toàn bộ, tổng tiền, trạng thái rỗng, chuyển sang thanh toán.
- Header hiển thị badge số lượng sản phẩm trong giỏ.
- Kiểm thử: unit (cart.spec.ts, 11 test).

### 2.5 Thực đơn (Product Menu) — HOÀN THIỆN
- Đã có sẵn trước phiên này, không chỉnh sửa.
- Chức năng: GET /products, trang menu với tìm kiếm/lọc, trạng thái empty/error.

### 2.6 Đơn hàng (Order) — CẬP NHẬT (thiếu)
- Hoàn thiện: tạo đơn, validation, state machine, trừ kho, frontend checkout.
- Đã thêm: JWT guard (OptionalAuthGuard) trên controller, kiểm tra quyền sở hữu khi xem/cập nhật/hủy đơn, lọc danh sách theo user khi có token.
- Còn thiếu: dữ liệu lưu in-memory (chưa có bảng/migration Prisma); chưa user-scoped đầy đủ.

### 2.7 Thanh toán (Payment) — CẬP NHẬT (thiếu)
- Đã có sẵn: mock payment + idempotency, frontend trang thanh toán.
- Đã thêm: JWT guard (OptionalAuthGuard) trên controller, kiểm tra quyền sở hữu đơn hàng trước khi thanh toán.
- Còn thiếu: enum phương thức thanh toán giữa Order và Payment chưa đồng nhất.

## 3. Các phần còn thiếu ở cấp assignment

- Kiểm thử E2E: thư mục tests/e2e/ còn trống, chưa có test end-to-end từ menu đến xác nhận đơn.
- Cơ sở dữ liệu: orders/payments vẫn in-memory; chưa có migration Prisma (chỉ products được seed qua docker init.sql).
- CI/CD: chưa có bước migration an toàn trong CD; chưa build/push image web.
- Triển khai production: chưa có URL production, release/tag, release notes, video demo, Sprint Review/Retrospective.
- Ma trận truy vết: docs/traceability-matrix.md còn nhiều ô Code/API và Test trống (FR-03, FR-04, FR-05, FR-06, FR-09, FR-10).

## 4. Danh sách file thay đổi theo từng chức năng

### A. Chi tiết sản phẩm (Product Detail) — CẬP NHẬT (thiếu)
Backend (cập nhật)
- apps/api/src/products/products.service.ts — validate id trong findOne (rỗng → 400, không tìm thấy → 404)
Frontend (cập nhật / mới)
- apps/web/src/app/products/[id]/page.tsx — viết lại trang chi tiết sản phẩm
- apps/web/src/components/ProductDetailModal.tsx — thêm số lượng và nút thêm vào giỏ
Kiểm thử (cập nhật / mới)
- tests/unit/products.service.spec.ts — thêm test findOne với id rỗng/khoảng trắng
- tests/unit/products.controller.spec.ts — thêm test findOne với id rỗng
- tests/integration/product-detail.spec.ts — thêm test 400 và 200 với đầy đủ trường

### B. Lịch sử đơn hàng (Order History) — MỚI (chưa nghiệm thu)
Backend (cập nhật)
- apps/api/src/orders/orders.service.ts — findAll() sắp xếp theo createdAt giảm dần (có tie-break theo thứ tự chèn)
Frontend (mới)
- apps/web/src/app/orders/page.tsx — trang lịch sử đơn hàng (danh sách, tìm kiếm, lọc trạng thái, trạng thái loading/empty/no-results/error + retry, kết hợp API + mock localStorage)
Kiểm thử (cập nhật)
- tests/unit/orders.service.spec.ts — thêm test sắp xếp findAll mới nhất trước
- tests/integration/orders.spec.ts — thêm test GET /orders trả về danh sách

### C. Đăng nhập / Xác thực (Login / Auth) — MỚI (chưa nghiệm thu)
Backend (mới)
- apps/api/src/auth/auth.service.ts — đăng ký/đăng nhập, hash mật khẩu scrypt, phát hành và xác minh JWT (HMAC-SHA256)
- apps/api/src/auth/auth.controller.ts — POST /auth/register, POST /auth/login, GET /auth/me
- apps/api/src/auth/auth.module.ts — khai báo module
- apps/api/src/auth/auth.guard.ts — guard xác thực Bearer token
- apps/api/src/auth/optional-auth.guard.ts — guard tùy chọn (không bắt buộc token)
- apps/api/src/auth/dto/register.dto.ts — DTO đăng ký
- apps/api/src/auth/dto/login.dto.ts — DTO đăng nhập
- apps/api/src/app.module.ts — import AuthModule
Frontend (mới)
- apps/web/src/app/login/page.tsx — trang đăng nhập/đăng ký, lưu JWT vào localStorage
Kiểm thử (mới)
- tests/unit/auth.service.spec.ts — 6 test cho AuthService
- tests/integration/auth.spec.ts — 4 test cho Auth API

### D. Giỏ hàng (Cart) — MỚI (chưa nghiệm thu)
Frontend (mới / cập nhật)
- apps/web/src/lib/cart.ts (mới) — thư viện logic giỏ hàng thuần (read/write/add/update/remove/clear/subtotal/totalItems) với storage injectable
- apps/web/src/app/cart/page.tsx (mới) — trang giỏ hàng (xem, tăng/giảm, xóa, xóa toàn bộ, tổng tiền, trạng thái rỗng, chuyển thanh toán)
- apps/web/src/components/Header.tsx (cập nhật) — thêm badge số lượng sản phẩm trong giỏ
- apps/web/src/app/page.tsx (cập nhật) — truyền cartCount cho Header
Kiểm thử (mới)
- tests/unit/cart.spec.ts — 11 test cho thư viện cart

### E. Thực đơn (Product Menu) — HOÀN THIỆN
- Không chỉnh sửa trong phiên này.

### F. Đơn hàng (Order) — CẬP NHẬT (thiếu)
- Backend: apps/api/src/orders/orders.controller.ts — thêm OptionalAuthGuard, truyền userId
- Backend: apps/api/src/orders/orders.service.ts — findAll/findOne/updateStatus hỗ trợ userId, lưu userId vào order
- Backend: apps/api/src/orders/orders.module.ts — import AuthModule
- Backend: apps/api/src/orders/dto/create-order.dto.ts — thêm trường userId tùy chọn
- Còn thiếu: persistence DB, user-scoped đầy đủ.

### G. Thanh toán (Payment) — CẬP NHẬT (thiếu)
- Backend: apps/api/src/payments/payments.controller.ts — thêm OptionalAuthGuard, truyền userId
- Backend: apps/api/src/payments/payments.service.ts — kiểm tra quyền sở hữu đơn hàng
- Backend: apps/api/src/payments/payments.module.ts — import AuthModule
- Còn thiếu: enum phương thức chưa đồng nhất.

## 5. Docker / Full stack

- docker-compose.yml: thêm mount init.sql cho db; đổi image postgres:15 (cached).
- docker/postgres/init.sql (mới): tạo bảng products và seed 9 sản phẩm.
- apps/api/Dockerfile: thêm `npx prisma generate` trước build.
- Đã chạy thành công: 3 container healthy, health endpoint OK, DB có 9 sản phẩm.

## 6. Kết quả kiểm thử

- Tổng số: 12 test suites, 65 tests — tất cả đều pass.
- TypeScript biên dịch không lỗi cho cả apps/api và apps/web.