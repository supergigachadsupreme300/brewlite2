### Bổ sung Mục 2.1: Stakeholder chính

| Stakeholder | Vai trò | Mục tiêu và kỳ vọng |
| :--- | :--- | :--- |
| **Khách hàng** | Người đặt món | Dễ dàng xem menu; xem lại đơn hàng rõ ràng tại `/checkout`; tăng/giảm (+/-) số lượng hoặc xóa món; nhập thông tin nhận nước (SĐT 10 số, mang đi hoặc số bàn); thanh toán không tiền mặt và nhận xác nhận đơn ngay lập tức. |
| **Nhân viên quầy** | Thực hiện và phục vụ đơn | Nhận thông tin đơn chính xác (size S/M/L, ghi chú đá/ngọt, số bàn); kiểm soát trạng thái đơn hàng tuần tự theo đúng quy trình pha chế (`PENDING` $\to$ `PAID` $\to$ `PREPARING` $\to$ `READY` $\to$ `COMPLETED`) để không nhầm hoặc sót đơn. |

### Bổ sung Mục 3: In Scope

| Mục | Mô tả |
| :--- | :--- |
| **Đặt đơn** | Giao diện `/checkout` cho phép xem lại món, tùy chỉnh số lượng (+/-) hoặc xóa món, áp mã ưu đãi; nhập thông tin nhận tại quầy (SĐT 10 số, Mang đi hoặc Số bàn); tính giá an toàn phía server; kiểm tra tồn kho và trừ kho nguyên tử trong Prisma transaction (`$transaction`); bàn giao sang cổng thanh toán. |
| **Quản lý trạng thái đơn** | Hiện thực Cỗ máy trạng thái (Section 9.1) quản lý chu trình đơn hàng qua hàm `assertTransition`, khởi tạo trạng thái `PENDING` và xử lý các nhánh ngoại lệ `PAYMENT_FAILED`, `CANCELLED`. |

### Bổ sung Mục 6: Constraints

- Đơn hàng mới khởi tạo bắt buộc phải ở trạng thái ban đầu là `PENDING`.
- Thao tác kiểm tra số lượng tồn kho, tạo đơn hàng và trừ kho sản phẩm bắt buộc phải nằm trong cùng một cơ chế giao dịch CSDL (`prisma.$transaction`) để bảo toàn tính toàn vẹn dữ liệu.
- Việc chuyển đổi trạng thái đơn hàng phải tuân thủ nghiêm ngặt ma trận chuyển tiếp Mục 9.1; mọi yêu cầu nhảy cóc sai quy trình đều bị chặn bằng mã lỗi `HTTP 400 Bad Request`.

### Bổ sung Mục 7: Rủi ro ban đầu

| Rủi ro | Mô tả | Ảnh hưởng |
| :--- | :--- | :--- |
| **Xung đột tồn kho (Race condition)** | Nhiều người cùng bấm đặt món cuối cùng tại cùng một thời điểm khi kho sắp hết. | Sử dụng `prisma.$transaction` để kiểm tra tồn kho và trừ kho nguyên tử (`stock decrement`) ngay trong cùng một giao dịch. |
| **Gian lận đơn giá (Price tampering)** | Người dùng can thiệp sửa giá tiền sản phẩm trong payload gửi lên API. | Backend tự động truy vấn giá gốc trực tiếp từ bảng `Product` trong CSDL để tính tổng tiền, không tin cậy giá client gửi lên. |
| **Gửi trùng đơn hàng (Double submit)** | Khách hàng bấm nút đặt hàng nhiều lần liên tiếp do gián đoạn mạng. | Vô hiệu hóa nút bấm (`disabled`) và bật hiệu ứng xoay loading ngay lần bấm đầu tiên để ngăn chặn tạo đơn trùng lặp. |