# Bối cảnh, stakeholder và phạm vi

## 1. Vấn đề nghiệp vụ cần giải quyết

Trong BrewLite, khách hàng cần một nơi tập hợp các món đã chọn trước khi chuyển sang đặt hàng và thanh toán. Nếu thông tin món, số lượng và giá tạm tính không được quản lý tập trung, khách hàng có thể đặt sai số lượng hoặc không nắm được số tiền dự kiến; nhân viên và hệ thống cũng khó đối chiếu nội dung đơn.

Module Cart giải quyết nhu cầu này bằng cách cho phép khách hàng thêm món từ menu/chi tiết sản phẩm, xem lại các món đã chọn, thay đổi số lượng, xóa món và theo dõi thành tiền cùng tổng tiền tạm tính. Cart cung cấp dữ liệu đầu vào cho Checkout. Việc xác thực người dùng thuộc Login; thông tin và tồn kho sản phẩm thuộc Product; tạo đơn và xử lý thanh toán thuộc Checkout/Payment.

## 2. Stakeholder

| Stakeholder | Vai trò| Mục tiêu và kỳ vọng |
|---|---|---|
| Khách hàng | Người sử dụng giỏ hàng | Thêm đúng món, sửa/xóa món dễ dàng, xem số lượng và tổng tiền rõ ràng trước khi checkout. |
| Nhân viên quầy | Tiếp nhận và chuẩn bị đơn | Nhận được đơn có danh sách món và số lượng chính xác sau khi khách hoàn tất đặt hàng. |
| Quản lý cửa hàng | Giám sát hoạt động cửa hàng | Giảm sai lệch giữa món khách chọn và đơn được tạo; dữ liệu đơn có thể đối chiếu. |
| Giảng viên/khách hàng nghiệm thu | Đánh giá sản phẩm | Kiểm tra được các luồng thêm, xem, sửa, xóa, tính tiền và các trường hợp dữ liệu không hợp lệ. |
| Nhóm phát triển | Phân tích, xây dựng, kiểm thử | Cart có giao diện, dữ liệu và quy tắc rõ ràng; tích hợp được Product, Login và Checkout. |
| Đơn vị thanh toán | Xử lý giao dịch ở bước sau Cart | Nhận số tiền và thông tin đơn đã được Checkout xác nhận; không làm việc trực tiếp với Cart. |


## 3. In-scope

| Mục | Mô tả |
|---|---|
| Xem giỏ hàng | Hiển thị các món đã chọn, đơn giá, số lượng, tùy chọn size/topping (nếu có) và thành tiền. |
| Thêm sản phẩm | Nhận sản phẩm từ trang chi tiết/menu và thêm vào giỏ; xử lý sản phẩm đã có theo cùng lựa chọn. |
| Cập nhật số lượng | Tăng/giảm số lượng với điều kiện số nguyên dương và không vượt tồn kho được cung cấp. |
| Xóa sản phẩm | Xóa một món hoặc làm trống giỏ hàng. |
| Kiểm tra dữ liệu | Kiểm tra productId, số lượng, tồn kho và thông tin giá/sản phẩm hợp lệ. |
| Tính tiền tạm tính | Tính thành tiền từng dòng và tổng tiền giỏ hàng. |
| Lưu trạng thái giỏ | Ở frontend hiện tại, lưu giỏ trong localStorage để khôi phục khi tải lại trang. |
| Chuyển sang Checkout | Cung cấp danh sách sản phẩm và số lượng để Checkout kiểm tra lại trước khi tạo đơn. |

### 4. Out-of-scope

| Nội dung | Mô tả |
|---|---|
| Đăng ký, đăng nhập, phát hành và xác minh JWT | Thuộc trách nhiệm của module Login/Auth. Cart chỉ sử dụng trạng thái đăng nhập khi cần chuyển sang đặt hàng. |
| Quản lý danh mục, mô tả, hình ảnh và cập nhật tồn kho gốc | Thuộc trách nhiệm của module Product/quản trị sản phẩm. Cart chỉ đọc thông tin sản phẩm và tồn kho được cung cấp. |
| Tạo đơn hàng chính thức, mã đơn và trạng thái đơn | Thuộc trách nhiệm của module Checkout/Orders. |
| Gọi cổng thanh toán, xử lý kết quả giao dịch, hoàn tiền | Thuộc trách nhiệm của module Payment. |
| Trừ tồn kho chính thức và bảo đảm transaction khi tạo đơn | Thuộc trách nhiệm của Backend Checkout/Orders; Cart không giữ chỗ hoặc trừ kho. |
| Mã giảm giá, khuyến mãi nâng cao, tích điểm/đổi điểm | Ngoài MVP hiện tại; có thể mở rộng sau. |
| Giao hàng, vận chuyển và quản lý nhiều cửa hàng | Ngoài phạm vi MVP. |

## 5. Assumptions

- Sản phẩm được chọn đã tồn tại trong Product và có mã định danh ổn định.
- Product cung cấp tên, giá, hình ảnh và số lượng tồn kho hiện tại để Cart hiển thị/kiểm tra sơ bộ.
- Giá và tồn kho có thể thay đổi giữa thời điểm thêm vào giỏ và checkout; Checkout phải xác minh lại dữ liệu mới nhất ở phía server.
- Trong phiên bản frontend hiện tại, giỏ hàng được lưu cục bộ trên trình duyệt bằng localStorage; không giả định giỏ hàng đã đồng bộ nhiều thiết bị.
- Các lựa chọn size/topping được xem là thuộc tính phân biệt dòng giỏ hàng nếu được bật trong nghiệp vụ.
- Đơn vị tiền tệ hiển thị là VND.

## 6. Constraints

- Công nghệ hiện tại: Next.js/React ở frontend, NestJS ở backend, Prisma ORM và PostgreSQL.
- Không đưa mật khẩu, token, khóa bí mật hoặc thông tin thanh toán thật vào repository.
- Tổng tiền Cart là số tiền tạm tính; Checkout phải tự tính lại từ dữ liệu đáng tin cậy phía server, không tin giá do client gửi lên.
- Số lượng phải là số nguyên an toàn lớn hơn 0 và không vượt quá tồn kho được kiểm tra.
- Cart không tự tạo đơn, không gọi Payment Service và không tự trừ tồn kho chính thức.
- Backend Cart trong mã nguồn được cung cấp hiện là placeholder; API server-side cần được triển khai và kiểm thử trước khi coi là hoàn thành.

## 7. Rủi ro ban đầu

| Rủi ro | Mô tả | Ảnh hưởng |
|---|---|---|
| Tồn kho thay đổi sau khi thêm vào giỏ | Số lượng tồn kho của sản phẩm có thể thay đổi sau khi khách hàng đã thêm sản phẩm vào giỏ hàng. | Checkout có thể không đáp ứng đủ số lượng |
| Giá sản phẩm thay đổi | Giá sản phẩm trong database có thể thay đổi so với thời điểm khách hàng thêm sản phẩm vào giỏ. | Tổng tiền tạm tính khác tổng tiền chính thức |
| Dữ liệu localStorage bị xóa hoặc lỗi |  Dữ liệu giỏ hàng được lưu trên trình duyệt có thể bị xóa, hỏng hoặc không thể truy xuất. | Giỏ hàng trên trình duyệt bị mất |
| Người dùng sửa dữ liệu phía client | Người dùng có thể can thiệp vào dữ liệu phía client như số lượng hoặc đơn giá sản phẩm. | Có thể gửi số lượng/giá không hợp lệ |
| Backend Cart chưa triển khai | Chức năng giỏ hàng hiện chưa có API backend để lưu trữ và quản lý dữ liệu giỏ hàng tập trung. | Chưa có API giỏ hàng dùng chung giữa thiết bị |
## 8. Tóm tắt phạm vi

Cart chịu trách nhiệm quản lý lựa chọn mua hàng và tính tiền tạm tính trước checkout. Ranh giới này giúp tránh trùng lặp với Login, Product, Orders và Payment, đồng thời cho phép kiểm thử riêng các thao tác thêm, xem, cập nhật, xóa và tính tiền.