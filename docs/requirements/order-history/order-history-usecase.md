# USE CASE SPECIFICATION – ORDER HISTORY

# USE CASE SPECIFICATION – ORDER HISTORY

## 1. Use Case Diagram

![Order History Use Case Diagram](./order_history.png)

## 2. Use Case Specifications

## UC-OH-01 – View Order History

**Mã Use Case:** UC-OH-01

**Tên Use Case:** View Order History (Xem lịch sử đơn hàng)

**Actor chính:** Customer (Khách hàng)

**Mục tiêu:**

Cho phép khách hàng xem danh sách các đơn hàng đã được tạo trong hệ thống, bao gồm thông tin cơ bản của từng đơn hàng để theo dõi lịch sử mua hàng.

**Trigger:**

Khách hàng truy cập trang Order History thông qua route `/orders`.

**Tiền điều kiện:**

- Khách hàng có thể truy cập giao diện BrewLite.
- Hệ thống có thể thực hiện yêu cầu lấy dữ liệu đơn hàng từ API hoặc dữ liệu mock trong quá trình phát triển.

**Hậu điều kiện:**

- Danh sách đơn hàng được hiển thị nếu tải dữ liệu thành công.
- Danh sách được sắp xếp theo thời gian tạo mới nhất.
- Nếu không có dữ liệu, hệ thống hiển thị trạng thái danh sách trống hoặc thông báo lỗi tương ứng.

**Luồng chính:**

1. Khách hàng truy cập chức năng Order History.
2. Hệ thống gửi yêu cầu lấy danh sách đơn hàng thông qua API `GET /orders`.
3. Hệ thống nhận dữ liệu đơn hàng.
4. Hệ thống xử lý và sắp xếp danh sách theo thời gian tạo mới nhất.
5. Hệ thống hiển thị danh sách đơn hàng.
6. Khách hàng xem thông tin cơ bản của các đơn hàng, bao gồm mã đơn hàng, ngày tạo, trạng thái, tổng số lượng sản phẩm và tổng tiền.

**Luồng thay thế:**

- **4a.** Nếu API trả về dữ liệu thành công và có dữ liệu mock, hệ thống kết hợp hai nguồn dữ liệu, loại bỏ các đơn hàng trùng mã và ưu tiên dữ liệu từ API.
- **4b.** Nếu danh sách đơn hàng rỗng, hệ thống hiển thị thông báo chưa có đơn hàng và cung cấp liên kết để khách hàng tiếp tục mua hàng.

**Luồng ngoại lệ:**

- **2a.** Nếu API không thể truy xuất dữ liệu, hệ thống chuyển sang sử dụng dữ liệu mock nếu có.
- **2b.** Nếu API gặp lỗi và không có dữ liệu mock, hệ thống hiển thị thông báo lỗi và cung cấp chức năng thử tải lại.

**Yêu cầu liên quan:**

- FR-OH-01 – View Order History.
- FR-OH-02 – Sort Orders by Creation Date.
- FR-OH-07 – Handle Loading, Empty, Error and No-Result States.
- FR-OH-08 – Support API and Local Mock Data.

---

## UC-OH-02 – Search Orders by ID

**Mã Use Case:** UC-OH-02

**Tên Use Case:** Search Orders by ID (Tìm kiếm đơn hàng theo mã)

**Actor chính:** Customer (Khách hàng)

**Mục tiêu:**

Cho phép khách hàng tìm kiếm một hoặc nhiều đơn hàng dựa trên mã đơn hàng để nhanh chóng xác định đơn hàng cần xem.

**Trigger:**

Khách hàng nhập từ khóa vào ô tìm kiếm trên trang Order History.

**Tiền điều kiện:**

- Khách hàng đang ở trang Order History.
- Danh sách đơn hàng đã được tải thành công.

**Hậu điều kiện:**

- Danh sách đơn hàng được cập nhật theo từ khóa tìm kiếm.
- Nếu không có kết quả phù hợp, hệ thống hiển thị thông báo không tìm thấy đơn hàng.

**Luồng chính:**

1. Khách hàng truy cập trang Order History.
2. Hệ thống hiển thị danh sách đơn hàng và ô tìm kiếm.
3. Khách hàng nhập mã đơn hàng hoặc một phần mã đơn hàng vào ô tìm kiếm.
4. Hệ thống tiếp nhận và chuẩn hóa từ khóa tìm kiếm bằng cách loại bỏ khoảng trắng ở đầu và cuối, chuyển từ khóa về chữ thường.
5. Hệ thống tìm kiếm các đơn hàng có mã phù hợp với từ khóa.
6. Hệ thống hiển thị danh sách đơn hàng phù hợp với điều kiện tìm kiếm.

**Luồng thay thế:**

- **3a.** Khách hàng nhập một phần mã đơn hàng, hệ thống vẫn tìm kiếm và trả về các đơn hàng có mã chứa từ khóa đó.
- **4a.** Nếu khách hàng xóa từ khóa tìm kiếm, hệ thống hiển thị lại danh sách đơn hàng theo điều kiện lọc hiện tại.

**Luồng ngoại lệ:**

- **5a.** Nếu không tìm thấy đơn hàng phù hợp, hệ thống hiển thị thông báo không có kết quả và cung cấp thao tác xóa bộ lọc tìm kiếm.

**Yêu cầu liên quan:**

- FR-OH-03 – Search Orders by Order ID.
- FR-OH-07 – Handle Loading, Empty, Error and No-Result States.

---

## UC-OH-03 – Filter Orders by Status

**Mã Use Case:** UC-OH-03

**Tên Use Case:** Filter Orders by Status (Lọc đơn hàng theo trạng thái)

**Actor chính:** Customer (Khách hàng)

**Mục tiêu:**

Cho phép khách hàng lọc danh sách đơn hàng theo trạng thái để dễ dàng theo dõi tiến trình xử lý của từng đơn hàng.

**Trigger:**

Khách hàng chọn một trạng thái trong danh sách bộ lọc trạng thái trên trang Order History.

**Tiền điều kiện:**

- Khách hàng đang ở trang Order History.
- Danh sách đơn hàng đã được tải thành công.

**Hậu điều kiện:**

- Danh sách đơn hàng được cập nhật theo trạng thái đã chọn.
- Nếu không có đơn hàng phù hợp, hệ thống hiển thị thông báo không có kết quả.

**Luồng chính:**

1. Khách hàng truy cập trang Order History.
2. Hệ thống hiển thị danh sách đơn hàng và bộ lọc trạng thái.
3. Khách hàng chọn trạng thái muốn lọc.
4. Hệ thống tiếp nhận trạng thái được chọn.
5. Hệ thống lọc danh sách đơn hàng theo trạng thái tương ứng.
6. Hệ thống hiển thị danh sách đơn hàng phù hợp.

**Luồng thay thế:**

- **3a.** Khách hàng chọn ALL, hệ thống hiển thị tất cả đơn hàng.
- **3b.** Khách hàng thay đổi trạng thái lọc, hệ thống cập nhật danh sách theo trạng thái mới.
- **4a.** Nếu khách hàng đồng thời sử dụng tìm kiếm theo mã đơn hàng, hệ thống kết hợp cả hai điều kiện để xác định kết quả.

**Luồng ngoại lệ:**

- **5a.** Nếu không có đơn hàng nào phù hợp với trạng thái đã chọn, hệ thống hiển thị thông báo không có kết quả và cho phép khách hàng xóa bộ lọc.

**Các trạng thái hỗ trợ:**

- PENDING
- PAID
- PREPARING
- READY
- COMPLETED
- PAYMENT_FAILED
- CANCELLED

**Yêu cầu liên quan:**

- FR-OH-04 – Filter Orders by Status.
- FR-OH-07 – Handle Loading, Empty, Error and No-Result States.

---

## UC-OH-04 – View Order Details

**Mã Use Case:** UC-OH-04

**Tên Use Case:** View Order Details (Xem chi tiết đơn hàng)

**Actor chính:** Customer (Khách hàng)

**Mục tiêu:**

Cho phép khách hàng xem thông tin chi tiết của một đơn hàng cụ thể, bao gồm thông tin đơn hàng, sản phẩm và tổng tiền.

**Trigger:**

Khách hàng chọn một đơn hàng trong danh sách Order History.

**Tiền điều kiện:**

- Khách hàng đang ở trang Order History hoặc có đường dẫn đến trang chi tiết đơn hàng.
- Mã đơn hàng cần xem được cung cấp.

**Hậu điều kiện:**

- Thông tin chi tiết của đơn hàng được hiển thị nếu tìm thấy đơn hàng.
- Nếu không tìm thấy đơn hàng, hệ thống hiển thị thông báo phù hợp.

**Luồng chính:**

1. Khách hàng chọn một đơn hàng trong danh sách.
2. Hệ thống điều hướng đến route `/orders/[id]` tương ứng với mã đơn hàng.
3. Hệ thống gửi yêu cầu lấy thông tin chi tiết thông qua API `GET /orders/:id`.
4. Hệ thống nhận dữ liệu chi tiết đơn hàng.
5. Hệ thống xử lý dữ liệu và hiển thị thông tin đơn hàng.
6. Hệ thống hiển thị danh sách sản phẩm thuộc đơn hàng, bao gồm tên sản phẩm, hình ảnh nếu có, kích thước nếu có, đơn giá, số lượng và thành tiền.
7. Hệ thống hiển thị tổng tiền đơn hàng.
8. Khách hàng xem thông tin chi tiết và có thể quay lại danh sách đơn hàng.

**Luồng thay thế:**

- **3a.** Nếu API không truy xuất được dữ liệu, hệ thống tìm đơn hàng tương ứng trong dữ liệu mock.
- **5a.** Nếu đơn hàng có thông tin nhận hàng được cung cấp, hệ thống hiển thị tên người nhận, số điện thoại, hình thức nhận hàng, số bàn và ghi chú tương ứng.
- **8a.** Khách hàng chọn chức năng quay lại danh sách đơn hàng, hệ thống điều hướng về `/orders`.

**Luồng ngoại lệ:**

- **3b.** Nếu API gặp lỗi và không tìm thấy đơn hàng tương ứng trong dữ liệu mock, hệ thống hiển thị thông báo không tìm thấy đơn hàng.
- **3c.** Nếu không thể tải dữ liệu chi tiết, hệ thống hiển thị trạng thái lỗi và cung cấp chức năng thử lại.

**Yêu cầu liên quan:**

- FR-OH-05 – View Order Details.
- FR-OH-07 – Handle Loading, Empty, Error and No-Result States.
- FR-OH-08 – Support API and Local Mock Data.

---

## UC-OH-05 – Retry Loading Data

**Mã Use Case:** UC-OH-05

**Tên Use Case:** Retry Loading Data (Thử tải lại dữ liệu)

**Actor chính:** Customer (Khách hàng)

**Mục tiêu:**

Cho phép khách hàng yêu cầu hệ thống tải lại dữ liệu khi quá trình tải danh sách đơn hàng hoặc chi tiết đơn hàng gặp lỗi.

**Trigger:**

Khách hàng chọn nút thử lại khi hệ thống hiển thị trạng thái lỗi.

**Tiền điều kiện:**

- Khách hàng đang ở trang danh sách đơn hàng hoặc trang chi tiết đơn hàng.
- Hệ thống đã xảy ra lỗi trong quá trình tải dữ liệu.
- Giao diện đang hiển thị chức năng thử tải lại.

**Hậu điều kiện:**

- Nếu tải dữ liệu thành công, hệ thống hiển thị dữ liệu tương ứng.
- Nếu tiếp tục thất bại, hệ thống hiển thị trạng thái lỗi để khách hàng có thể thử lại.

**Luồng chính:**

1. Hệ thống hiển thị thông báo lỗi khi không thể tải dữ liệu.
2. Khách hàng chọn chức năng thử tải lại.
3. Hệ thống gửi lại yêu cầu lấy dữ liệu tương ứng.
4. Hệ thống nhận kết quả trả về.
5. Hệ thống hiển thị dữ liệu nếu yêu cầu thành công.

**Luồng thay thế:**

- **3a.** Nếu API tiếp tục lỗi nhưng dữ liệu mock có sẵn, hệ thống sử dụng dữ liệu mock để hiển thị.
- **5a.** Nếu dữ liệu tải thành công nhưng danh sách rỗng, hệ thống hiển thị trạng thái danh sách trống.

**Luồng ngoại lệ:**

- **4a.** Nếu yêu cầu tiếp tục thất bại và không có dữ liệu mock phù hợp, hệ thống hiển thị thông báo lỗi và cho phép khách hàng thử lại sau.

**Yêu cầu liên quan:**

- FR-OH-07 – Handle Loading, Empty, Error and No-Result States.
- FR-OH-08 – Support API and Local Mock Data.