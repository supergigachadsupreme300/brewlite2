### Cập nhật Mục 2: Yêu cầu chức năng

#### FR-06: Đặt đơn hàng và Kiểm soát tồn kho (Order & Checkout)
Hệ thống cho phép khách hàng xem lại danh sách món, tùy chỉnh số lượng (+/-) hoặc xóa món, điền thông tin nhận nước tại quầy (Tên, SĐT, Mang đi hoặc Số bàn) và khởi tạo đơn hàng.

**Tiêu chí chấp nhận**
- Người dùng có thể xem lại chi tiết danh sách đồ uống (tên, size, số lượng, đơn giá, lineTotal) và tùy chỉnh số lượng hoặc xóa món trực tiếp trên trang `/checkout`.
- Bắt buộc nhập đầy đủ Tên (tối thiểu 2 ký tự) và Số điện thoại hợp lệ (chuẩn 10 số di động Việt Nam).
- Nếu chọn "Dùng tại quán", bắt buộc nhập Số bàn.
- Hệ thống từ chối tạo đơn nếu giỏ hàng rỗng hoặc số lượng món bằng 0 theo quy tắc BR-06.
- Máy chủ tự động tính toán tổng tiền dựa trên đơn giá gốc trong cơ sở dữ liệu, ngăn chặn việc can thiệp giá từ máy khách.
- Hệ thống kiểm tra tồn kho từng món trong `prisma.$transaction`; nếu không đủ hàng, từ chối tạo đơn với mã lỗi `HTTP 400 Bad Request`, tự động rollback và không trừ kho.
- Nếu hợp lệ, hệ thống tạo bản ghi đơn hàng ở trạng thái `PENDING`, trừ kho nguyên tử (`stock decrement`) và trả về mã đơn hàng (`orderId`).

#### FR-10: Cỗ máy trạng thái đơn hàng (Order State Machine - Section 9.1)
Hệ thống lưu trữ, kiểm soát và cập nhật trạng thái đơn hàng theo chu trình vòng đời nghiêm ngặt thông qua hàm kiểm soát chuyển tiếp `assertTransition`.

**Tiêu chí chấp nhận**
- Đơn hàng mới khởi tạo bắt buộc ở trạng thái ban đầu là `PENDING`.
- Luồng chuyển tiếp hợp lệ (Happy path): `PENDING` $\to$ `PAID` $\to$ `PREPARING` $\to$ `READY` $\to$ `COMPLETED`.
- Luồng ngoại lệ: `PENDING` $\to$ `PAYMENT_FAILED` (cho phép thử lại sang `PAID` hoặc hủy sang `CANCELLED`); cho phép hủy đơn (`CANCELLED`) khi đơn đang ở trạng thái `PENDING` hoặc `PREPARING`.
- Hai trạng thái kết thúc (Terminal State): `COMPLETED` và `CANCELLED` là trạng thái cuối cùng, không thể chuyển đổi sang bất kỳ trạng thái nào khác.
- Mọi yêu cầu chuyển đổi sai quy trình (ví dụ: `PAID` nhảy cóc sang `READY`, hoặc `COMPLETED` quay ngược về `PENDING`) đều bị chặn và trả về lỗi `HTTP 400 Bad Request`.

---

### Bổ sung Mục 3: Yêu cầu phi chức năng

#### Bổ sung tiêu chí cho NFR-01: Hiệu năng
- Thời gian phản hồi của API tạo đơn hàng `POST /orders` trong điều kiện tải bình thường phải đạt $\le 500\text{ ms}$.

#### Bổ sung tiêu chí cho NFR-03: Bảo mật & Toàn vẹn dữ liệu
- Dữ liệu đầu vào phải được xác thực và lọc thông qua `CreateOrderDto`.
- Thao tác kiểm tra tồn kho, tạo đơn hàng và trừ kho phải đảm bảo tính nguyên tử (Atomicity) trong cùng một transaction của CSDL.