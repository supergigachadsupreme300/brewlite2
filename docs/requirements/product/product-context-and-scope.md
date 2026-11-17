# Bối cảnh, stakeholder và phạm vi – Module Product & Menu

## 1. Vấn đề nghiệp vụ cần giải quyết

Trong hệ thống đặt đồ uống trực tuyến và thanh toán tại quầy **BrewLite**, khách hàng cần tiếp cận danh sách thực đơn (Menu) một cách trực quan, nhanh chóng và chính xác trước khi quyết định chọn món. Nếu thông tin sản phẩm (tên món, phân loại, mô tả, hình ảnh, đơn giá, tùy chọn kích cỡ/topping và trạng thái tồn kho/khả dụng) không được cung cấp rõ ràng hoặc thiếu đồng bộ giữa Frontend và Backend API:

- Khách hàng mất nhiều thời gian tìm kiếm món hoặc chọn nhầm món đã hết hàng (`stock = 0` hoặc `isAvailable = false`);
- Giỏ hàng (Cart) và Đặt đơn (Checkout/Order) thiếu dữ liệu chuẩn xác về đơn giá gốc và số lượng tồn kho để kiểm tra hợp lệ;
- Nhân viên quầy và quản lý cửa hàng gặp khó khăn khi cập nhật thực đơn, điều chỉnh giá bán hoặc kiểm soát số lượng tồn kho theo thời gian thực.

Module **Product & Menu** giải quyết bài toán này bằng cách cung cấp hệ thống API sản phẩm (`Product API`), giao diện hiển thị danh sách sản phẩm (`Menu`), tìm kiếm/lọc theo danh mục, xem chi tiết sản phẩm (`Product Detail`) và cung cấp dữ liệu tồn kho/đơn giá gốc đáng tin cậy cho các phân hệ **Cart** và **Checkout/Order**.

## 2. Stakeholder

### 2.1 Stakeholder chính

| Stakeholder | Vai trò | Mục tiêu và kỳ vọng |
| --- | --- | --- |
| **Khách hàng** | Người xem menu và chọn món | Dễ dàng duyệt danh sách sản phẩm trên menu, tìm kiếm/lọc món theo danh mục, xem chi tiết mô tả, hình ảnh, giá cả, trạng thái còn hàng và chọn món đưa vào giỏ hàng. |
| **Nhân viên quầy / Barista** | Phục vụ và kiểm soát tình trạng món | Nắm bắt đúng danh sách món đang mở bán; hạn chế tình trạng khách đặt món đã hết nguyên liệu hoặc ngừng phục vụ. |
| **Quản lý cửa hàng (Admin)** | Quản lý danh mục thực đơn và tồn kho | Quản lý thông tin sản phẩm (thêm, sửa, cập nhật giá, cập nhật tồn kho `stock`, bật/tắt trạng thái hiển thị) đảm bảo dữ liệu menu luôn chính xác. |
| **Giảng viên / Khách hàng nghiệm thu** | Đánh giá và nghiệm thu sản phẩm | Kiểm tra tính đầy đủ, rõ ràng của tài liệu yêu cầu, thiết kế UML và khả năng hoạt động thực tế của Product API cùng giao diện Menu. |
| **Nhóm phát triển (Dev Team)** | Thiết kế, xây dựng và kiểm thử | Có đặc tả API, schema dữ liệu `Product` rõ ràng để tích hợp mượt mà với module **Cart** (kiểm tra sơ bộ) và **Order/Checkout** (kiểm tra tồn kho và tính tiền phía server). |
| **Phân hệ Cart & Order/Checkout** | Hệ thống/Module tiêu thụ dữ liệu | Truy xuất đúng `productId`, `name`, `price`, `imageUrl` và `stock` thực tế từ CSDL để hiển thị giỏ hàng và thực thi giao dịch đặt đơn an toàn. |

### 2.2 Mục tiêu theo stakeholder

- **Khách hàng:** Xem menu mượt mà, thông tin minh bạch, nhận biết ngay món còn hàng hay hết hàng.
- **Nhân viên quầy & Quản lý:** Đồng bộ dữ liệu món ăn/đồ uống và tồn kho giữa quầy pha chế và giao diện đặt món.
- **Nhóm phát triển:** Tách biệt rõ trách nhiệm của module Product (cung cấp và quản lý dữ liệu sản phẩm) với Cart (lưu tạm lựa chọn) và Order (tạo đơn và trừ kho trong transaction).

## 3. In Scope (Trong phạm vi)

| Mục | Mô tả |
| --- | --- |
| **Danh sách sản phẩm (Menu UI)** | Hiển thị danh sách các đồ uống/sản phẩm trong thực đơn kèm tên, hình ảnh, giá bán, danh mục và trạng thái còn hàng/hết hàng. |
| **Tìm kiếm & Lọc thực đơn** | Hỗ trợ khách hàng tìm kiếm sản phẩm theo từ khóa tên món hoặc lọc theo danh mục đồ uống (Cà phê, Trà, Đá xay, Bánh ngọt,...) và sắp xếp theo giá. |
| **Chi tiết sản phẩm (Product Detail)** | Hiển thị thông tin chi tiết của một sản phẩm cụ thể (`GET /products/:id`), bao gồm mô tả chi tiết, hình ảnh, đơn giá gốc, lượng tồn kho hiện tại và các tùy chọn cơ bản (size/đá/đường nếu có). |
| **Product API (Backend REST API)** | Cung cấp các endpoint chuẩn RESTful (`GET /products`, `GET /products/:id`, và các API quản trị/cập nhật sản phẩm cơ bản) kết nối với PostgreSQL qua Prisma ORM. |
| **Kiểm tra khả dụng & Tồn kho** | Phản ánh chính xác số lượng tồn kho (`stock`) và trạng thái mở bán; vô hiệu hóa nút "Thêm vào giỏ" trên giao diện nếu `stock <= 0`. |
| **Cung cấp dữ liệu cho Cart & Order** | Cung cấp thông tin sản phẩm và giá gốc từ CSDL để Cart hiển thị tạm tính và Order/Checkout xác thực lại đơn giá, kiểm tra tồn kho khi tạo đơn. |

## 4. Out of Scope (Ngoài phạm vi)

| Nội dung | Mô tả |
| --- | --- |
| **Xác thực người dùng & cấp phát JWT** | Thuộc phạm vi của module **Login/Auth**. Module Product cho phép khách xem Menu công khai và chỉ dùng quyền từ Auth khi thực hiện thao tác quản trị (nếu có). |
| **Quản lý trạng thái giỏ hàng & tính tổng tạm tính** | Thuộc phạm vi của module **Cart**. Product chỉ cung cấp dữ liệu món và tồn kho để Cart tham chiếu. |
| **Khởi tạo đơn hàng & trừ kho giao dịch (`$transaction`)** | Việc khóa dòng dữ liệu, trừ tồn kho nguyên tử (`stock decrement`) khi đặt hàng và quản lý trạng thái đơn thuộc phạm vi của module **Order/Checkout**. |
| **Xử lý thanh toán (MoMo, VietQR, Thẻ)** | Thuộc phạm vi của module **Payment**. |
| **Quản lý công thức pha chế (BOM) & kho nguyên liệu thô** | MVP chỉ quản lý tồn kho theo đơn vị thành phẩm (`Product.stock`), không quản lý định lượng nguyên liệu chi tiết (sữa, hạt cà phê, đường,...). |
| **Gợi ý món bằng AI / Cá nhân hóa nâng cao** | Không nằm trong phạm vi MVP của BrewLite. |

## 5. Assumptions (Giả định)

- Mỗi sản phẩm trong hệ thống có mã định danh duy nhất (`id` dạng UUID/CUID), tên sản phẩm, đơn giá (`price` > 0) và số lượng tồn kho (`stock` >= 0) được lưu trữ trong PostgreSQL.
- Khách hàng có thể truy cập và xem Menu, tìm kiếm sản phẩm và xem chi tiết món mà không bắt buộc phải đăng nhập trước.
- Đơn vị tiền tệ sử dụng thống nhất trên toàn bộ Menu và Product API là Việt Nam Đồng (VND).
- Hình ảnh sản phẩm (`imageUrl`) được cung cấp dưới dạng đường dẫn URL hợp lệ hoặc ảnh tĩnh (placeholder) khi chưa có ảnh riêng.
- Số lượng tồn kho hiển thị trên Menu/Product Detail là số lượng tại thời điểm truy vấn; khi khách hàng tiến hành đặt đơn, module Checkout/Order sẽ kiểm tra lại tồn kho thực tế trong Database Transaction.

## 6. Constraints (Ràng buộc)

- **Công nghệ bắt buộc:** Frontend sử dụng Next.js (TypeScript), Backend sử dụng NestJS (TypeScript), ORM là Prisma kết nối cơ sở dữ liệu PostgreSQL.
- **Bảo mật:** Không lưu trữ thông tin nhạy cảm, credential hoặc secret thật trong mã nguồn repository.
- **Toàn vẹn dữ liệu giá và tồn kho:** Giá sản phẩm (`price`) phải là số dương và tồn kho (`stock`) phải là số nguyên không âm (`stock >= 0`). Mọi thao tác tính tiền đơn hàng chính thức ở bước sau phải lấy `price` từ bảng `Product` trên Backend, tuyệt đối không tin tưởng giá từ phía client gửi lên.
- **Kiến trúc:** Tuân thủ cấu trúc Modular Monolith của dự án BrewLite, đảm bảo module `ProductsModule` độc lập, dễ viết Unit Test và Integration Test.

## 7. Rủi ro ban đầu

| Rủi ro | Mô tả | Giải pháp giảm thiểu / Ảnh hưởng |
| --- | --- | --- |
| **Độ trễ đồng bộ tồn kho trên giao diện Menu** | Khi khách đang xem Menu thì một khách hàng khác vừa đặt hết sản phẩm đó, dẫn đến số lượng hiển thị trên màn hình cũ chưa kịp cập nhật. | Hiển thị rõ số lượng tồn kho khi tải trang; kết hợp kiểm tra lại tồn kho ở Cart và bắt buộc kiểm tra nguyên tử trong `prisma.$transaction` tại bước Checkout/Order. |
| **Dữ liệu đầu vào tìm kiếm/lọc không hợp lệ** | Người dùng nhập ký tự đặc biệt hoặc tham số phân trang/lọc sai định dạng trên URL query. | Thực hiện validate và chuẩn hóa query params (`search`, `category`, `page`, `limit`) bằng DTO/Pipe ở NestJS Backend và xử lý an toàn qua Prisma. |
| **Ảnh sản phẩm bị lỗi đường dẫn (Broken Image)** | Đường dẫn `imageUrl` của sản phẩm không tải được hoặc bị trống khiến giao diện Menu bị vỡ bố cục. | Thiết lập ảnh mặc định (fallback/placeholder image) trên giao diện Next.js khi `imageUrl` rỗng hoặc tải lỗi. |
| **Hiệu năng tải danh sách khi số lượng món tăng** | Truy vấn toàn bộ danh sách sản phẩm không giới hạn có thể làm chậm thời gian phản hồi API. | Hỗ trợ lọc theo trạng thái khả dụng, phân trang hoặc giới hạn số bản ghi hợp lý, đánh chỉ mục (index) các trường truy vấn thường xuyên. |

## 8. Tóm tắt phạm vi

Module **Product & Menu** đóng vai trò là điểm chạm đầu tiên trong hành trình trải nghiệm khách hàng trên **BrewLite**. Phân hệ chịu trách nhiệm quản lý, truy xuất và hiển thị danh sách thực đơn, tìm kiếm/lọc món, cung cấp thông tin chi tiết sản phẩm cũng như trạng thái tồn kho và đơn giá chuẩn xác làm nền tảng đầu vào cho **Cart** và **Order/Checkout**.

