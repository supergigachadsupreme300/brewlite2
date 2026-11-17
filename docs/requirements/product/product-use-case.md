# Đặc tả Use-Case trọng tâm – Xem thực đơn, tra cứu sản phẩm và chọn món vào giỏ

## 1. Thông tin Use-Case

| Thuộc tính | Nội dung |
| --- | --- |
| **Mã use-case** | UC-PROD-01 |
| **Tên use-case** | Xem thực đơn (Menu), tra cứu chi tiết sản phẩm và chọn món vào giỏ hàng |
| **Mục tiêu** | Giúp khách hàng xem danh sách đồ uống trong thực đơn, tìm kiếm/lọc món theo nhu cầu, xem thông tin chi tiết cùng trạng thái tồn kho và chọn sản phẩm hợp lệ để đưa vào giỏ hàng (Cart). |
| **Actor chính** | Khách hàng (Customer) |
| **Actor / Hệ thống liên quan** | - **Next.js Frontend (Menu & Product UI):** Hiển thị danh sách, bộ lọc và chi tiết món.<br>- **NestJS Backend (Product API):** Xử lý truy vấn sản phẩm và kiểm tra dữ liệu.<br>- **PostgreSQL (Prisma ORM):** Lưu trữ và truy xuất bảng `Product`.<br>- **Module Cart:** Tiếp nhận thông tin sản phẩm và số lượng khách chọn. |
| **Trigger** | Khách hàng truy cập vào trang chủ / trang Thực đơn (`/menu` hoặc `/products`) trên ứng dụng web BrewLite. |

## 2. Tiền điều kiện (Preconditions)

- Hệ thống Frontend (Next.js) và Backend API (NestJS) đang hoạt động và kết nối thành công với cơ sở dữ liệu PostgreSQL.
- Dữ liệu danh mục và sản phẩm (`Product`) đã được khởi tạo (seed/insert) trong cơ sở dữ liệu.
- Khách hàng truy cập hệ thống bằng trình duyệt web (không bắt buộc phải đăng nhập để xem Menu và chi tiết sản phẩm).

## 3. Hậu điều kiện (Postconditions)

- **Thành công:**
  - Danh sách sản phẩm và thông tin chi tiết của sản phẩm được hiển thị chính xác theo dữ liệu trong cơ sở dữ liệu (tên, mô tả, hình ảnh, đơn giá, tồn kho).
  - Khi khách hàng chọn thêm món còn hàng với số lượng hợp lệ (`1 <= quantity <= stock`), thông tin sản phẩm (`productId`, `name`, `price`, `imageUrl`, `stock`, `quantity`, tùy chọn nếu có) được chuyển giao thành công sang module **Cart**.
- **Thất bại / Ngoại lệ:**
  - Nếu sản phẩm hết hàng (`stock = 0`) hoặc không tồn tại, hệ thống hiển thị thông báo rõ ràng và không thêm dữ liệu sai lệch vào giỏ hàng.

## 4. Luồng chính (Main Success Scenario)

1. Khách hàng mở trang Thực đơn (Menu) của ứng dụng **BrewLite**.
2. Frontend gửi yêu cầu `GET /products` đến Backend Product API.
3. Backend truy vấn danh sách các sản phẩm đang mở bán từ bảng `Product` trong cơ sở dữ liệu PostgreSQL và trả về kết quả (`HTTP 200 OK`).
4. Giao diện Menu hiển thị danh sách sản phẩm gồm hình ảnh, tên món, đơn giá (VND) và trạng thái tồn kho.
5. Khách hàng chọn một sản phẩm bất kỳ trên Menu để xem chi tiết.
6. Frontend gửi yêu cầu `GET /products/:id` đến Backend Product API.
7. Backend truy vấn thông tin chi tiết của sản phẩm theo `id` từ PostgreSQL và trả về dữ liệu chi tiết (`HTTP 200 OK`).
8. Hệ thống hiển thị giao diện Chi tiết sản phẩm (Product Detail) bao gồm tên, hình ảnh, mô tả chi tiết, đơn giá, số lượng tồn kho hiện có (`stock`) và khung chọn số lượng/tùy chọn.
9. Khách hàng chọn số lượng muốn mua (nằm trong khoảng từ `1` đến `stock`) và nhấn nút **"Thêm vào giỏ hàng"**.
10. Hệ thống kiểm tra điều kiện số lượng hợp lệ so với `stock` hiện tại của sản phẩm.
11. Hệ thống chuyển dữ liệu sản phẩm và số lượng đã chọn sang module **Cart**, cập nhật số lượng trên biểu tượng giỏ hàng và hiển thị thông báo "Đã thêm món vào giỏ hàng".

## 5. Luồng thay thế (Alternative Flows)

- **A1 – Tìm kiếm và lọc sản phẩm trên Menu:**
  - Tại bước 4, khách hàng nhập từ khóa vào thanh tìm kiếm hoặc chọn bộ lọc danh mục (ví dụ: *Cà phê*, *Trà trái cây*, *Đá xay*).
  - Frontend gửi yêu cầu `GET /products?search=...&category=...` (hoặc lọc trực tiếp trên danh sách đã tải).
  - Hệ thống cập nhật lại danh sách hiển thị chỉ gồm các món khớp điều kiện, sau đó tiếp tục bước 5.
- **A2 – Thêm nhanh sản phẩm trực tiếp từ danh sách Menu:**
  - Tại bước 4, với sản phẩm còn hàng (`stock > 0`), khách hàng nhấn nút **"Thêm nhanh (+)"** ngay trên thẻ sản phẩm ở trang Menu mà không cần mở trang chi tiết.
  - Hệ thống mặc định `quantity = 1` (và tùy chọn mặc định), kiểm tra tồn kho và chuyển thẳng đến bước 10–11.
- **A3 – Không tìm thấy sản phẩm khớp bộ lọc:**
  - Tại nhánh A1, nếu không có sản phẩm nào khớp từ khóa tìm kiếm, giao diện hiển thị thông báo *"Không tìm thấy món phù hợp"* kèm nút **"Xóa bộ lọc"** để khách hàng quay lại danh sách đầy đủ.

## 6. Luồng ngoại lệ (Exception Flows)

- **E1 – Sản phẩm đã hết hàng (`stock = 0`):**
  - Tại bước 4 hoặc bước 8, nếu sản phẩm có `stock = 0`, giao diện hiển thị nhãn **"Hết hàng"** và khóa (`disabled`) nút **"Thêm vào giỏ hàng"**. Khách hàng không thể thêm sản phẩm này vào giỏ.
- **E2 – Số lượng chọn vượt quá tồn kho (`quantity > stock`) hoặc không hợp lệ (`quantity <= 0`):**
  - Tại bước 9–10, nếu khách hàng nhập số lượng lớn hơn `stock` hiện có hoặc nhỏ hơn 1, hệ thống chặn thao tác, giữ nguyên giỏ hàng và hiển thị cảnh báo *"Số lượng vượt quá tồn kho hiện có (còn X sản phẩm)"*.
- **E3 – Sản phẩm không tồn tại (`404 Not Found`):**
  - Tại bước 6–7, nếu khách hàng truy cập đường dẫn sản phẩm có `id` không tồn tại hoặc đã bị ngừng kinh doanh, Product API trả về `HTTP 404 Not Found`. Giao diện hiển thị thông báo *"Sản phẩm không tồn tại hoặc đã ngừng phục vụ"* và nút quay về Menu.
- **E4 – Lỗi kết nối API hoặc cơ sở dữ liệu (`500 Internal Server Error`):**
  - Tại bước 2–3 hoặc 6–7, nếu Backend hoặc PostgreSQL gặp sự cố kết nối, API trả về mã lỗi tương ứng. Giao diện hiển thị thông báo *"Không thể tải thực đơn lúc này, vui lòng thử lại"* cùng nút **"Tải lại"**.

## 7. Liên kết yêu cầu (Requirements Traceability)

| Mã yêu cầu | Vai trò trong Use-Case |
| --- | --- |
| **FR-PROD-01** | Hiển thị danh sách các sản phẩm trên giao diện Menu (Bước 1–4). |
| **FR-PROD-02** | Tìm kiếm theo từ khóa và lọc sản phẩm theo danh mục (Luồng thay thế A1, A3). |
| **FR-PROD-03** | Xem thông tin chi tiết của một sản phẩm cụ thể (Bước 5–8, Ngoại lệ E3). |
| **FR-PROD-04** | Hiển thị trạng thái tồn kho và chặn chọn món khi hết hàng hoặc vượt tồn kho (Bước 9–10, Ngoại lệ E1, E2). |
| **FR-PROD-05** | Cung cấp endpoint `GET /products` và `GET /products/:id` tại Backend. |
| **FR-PROD-07** | Bàn giao dữ liệu sản phẩm chuẩn xác sang module Cart (Bước 11). |
| **NFR-PROD-01/02** | Đảm bảo tốc độ tải Menu nhanh và dữ liệu giá/tồn kho chính xác. |
| **NFR-PROD-03** | Xử lý an toàn các trường hợp lỗi mạng, rỗng dữ liệu hoặc lỗi ảnh hiển thị. |

## 8. Tiêu chí nghiệm thu (Acceptance Criteria)

- Khách hàng mở trang Menu thấy đầy đủ danh sách sản phẩm với tên, ảnh, giá tiền (VND) và trạng thái còn hàng/hết hàng.
- Tìm kiếm theo tên món và lọc danh mục trả về đúng các sản phẩm tương ứng.
- Khi bấm vào một sản phẩm, trang/modal chi tiết hiển thị đúng mô tả, đơn giá và số lượng tồn kho từ API `GET /products/:id`.
- Sản phẩm có `stock = 0` bị khóa nút thêm vào giỏ; sản phẩm có `stock > 0` chỉ cho phép chọn số lượng nguyên dương không vượt quá `stock`.
- Khi thêm vào giỏ thành công, module Cart nhận đúng thông tin `productId`, `name`, `price` và `quantity`.

