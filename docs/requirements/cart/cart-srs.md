# Software Requirements Specification (SRS)

## 1. Mục tiêu hệ thống

Cart hỗ trợ khách hàng tập hợp và điều chỉnh sản phẩm đã chọn, kiểm tra số lượng và xem tổng tiền tạm tính trước khi chuyển sang Checkout.

## 2. Yêu cầu chức năng

### FR-CART-01: Xem giỏ hàng
**Tiêu chí chấp nhận**
Khi mở trang giỏ hàng, hệ thống hiển thị từng sản phẩm cùng tên, đơn giá, số lượng và thành tiền; nếu không có sản phẩm thì hiển thị thông báo giỏ trống và tổng tiền bằng 0.
### FR-CART-02: Thêm sản phẩm vào giỏ
**Tiêu chí chấp nhận**
Khi nhận productId hợp lệ và quantity hợp lệ, sản phẩm được thêm vào giỏ; số lượng hiển thị tăng đúng. Nếu sản phẩm cùng productId và cùng tùy chọn đã tồn tại, hệ thống cộng dồn số lượng thay vì tạo dòng trùng.
### FR-CART-03: Kiểm tra dữ liệu thêm giỏ
**Tiêu chí chấp nhận**
Hệ thống từ chối productId rỗng/không hợp lệ, quantity không phải số nguyên dương, tồn kho âm/không hợp lệ hoặc sản phẩm hết hàng; thao tác thất bại không làm thay đổi giỏ.
### FR-CART-04: Cập nhật số lượng
**Tiêu chí chấp nhận**
Khách hàng có thể tăng/giảm số lượng; hệ thống chỉ chấp nhận số nguyên từ 1 đến tồn kho hiện có. Số lượng không hợp lệ bị từ chối và có thông báo.
### FR-CART-05: Xóa sản phẩm
**Tiêu chí chấp nhận**
Khi khách hàng chọn xóa một dòng, dòng đó biến mất khỏi giỏ và tổng tiền được tính lại.
### FR-CART-06: Xóa toàn bộ giỏ
**Tiêu chí chấp nhận**
Khi khách hàng chọn xóa giỏ, danh sách trở thành rỗng, tổng số lượng và tổng tiền đều bằng 0.
### FR-CART-07: Tính thành tiền từng dòng **Tiêu chí chấp nhận**
Với mỗi dòng, thành tiền bằng đơn giá × số lượng; kết quả thay đổi đúng sau khi số lượng thay đổi.
### FR-CART-08: Tính tổng tiền giỏ hàng
**Tiêu chí chấp nhận**
Tổng tiền bằng tổng thành tiền của các dòng trong giỏ; hệ thống tính lại sau khi thêm, cập nhật hoặc xóa sản phẩm.
### FR-CART-09: Lưu và khôi phục giỏ hàng
**Tiêu chí chấp nhận**
Trong cùng trình duyệt, sau khi tải lại trang, giỏ hàng đã lưu được khôi phục; nếu không có dữ liệu lưu thì khởi tạo giỏ rỗng.
### FR-CART-10: Chuyển dữ liệu sang Checkout
**Tiêu chí chấp nhận**
Khi khách chọn tiến hành thanh toán, hệ thống chuyển sang Checkout với danh sách productId và quantity; Checkout phải kiểm tra lại giá và tồn kho từ server trước khi tạo đơn.
### FR-CART-11: Hiển thị số lượng trên biểu tượng giỏ
**Tiêu chí chấp nhận**
Biểu tượng giỏ hiển thị tổng số đơn vị sản phẩm; con số cập nhật sau thao tác thêm, cập nhật hoặc xóa.

## 3. Yêu cầu phi chức năng

| Mã | Yêu cầu | Ưu tiên | Tiêu chí chấp nhận có thể kiểm chứng |
|---|---|---|---|
| NFR-CART-01 | Tính chính xác | Must | Với bộ dữ liệu kiểm thử cho trước, thành tiền và tổng tiền khớp phép tính đơn giá × số lượng; không phát sinh dòng có quantity nhỏ hơn 1. |
| NFR-CART-02 | Bảo mật và toàn vẹn dữ liệu | Must | Backend (khi triển khai API Cart/Checkout) xác thực người dùng và kiểm tra lại productId, quantity, giá và tồn kho; không tin giá gửi từ trình duyệt. |
| NFR-CART-03 | Hiệu năng thao tác | Should | Các thao tác cập nhật state giỏ hàng trên giao diện phản hồi tức thời trong điều kiện dữ liệu giỏ hàng MVP thông thường; không cần tải lại toàn trang. |
| NFR-CART-04 | Khả dụng và khả năng phục hồi | Should | Nếu localStorage chưa có hoặc không đọc được dữ liệu hợp lệ, giao diện vẫn mở được và hiển thị giỏ rỗng/thông báo phù hợp, không làm hỏng trang. |
| NFR-CART-05 | Khả năng bảo trì | Should | Logic kiểm tra dữ liệu, state giỏ hàng và giao diện được tách thành các module riêng để có thể kiểm thử và thay đổi độc lập. |
| NFR-CART-06 | Khả năng triển khai | Should | Cart chạy trong frontend BrewLite hiện tại và tích hợp với API Checkout mà không yêu cầu thay đổi nền tảng Next.js/NestJS/PostgreSQL. |

## 4. Ưu tiên MoSCoW

- **Must:** FR-CART-01 đến FR-CART-05, FR-CART-07, FR-CART-08, FR-CART-10; NFR-CART-01, NFR-CART-02.
- **Should:** FR-CART-06, FR-CART-09, FR-CART-11; NFR-CART-03 đến NFR-CART-06.
- **Could:** Đồng bộ giỏ hàng giữa nhiều thiết bị; lưu giỏ hàng theo tài khoản trên server; áp dụng mã giảm giá sau khi có module Promotion.
- **Won't (trong MVP):** Cart tự tạo đơn hàng, tự xử lý thanh toán, tự trừ tồn kho chính thức, quản lý vận chuyển hoặc xử lý hoàn tiền.

## 5. Quy tắc nghiệp vụ

1. Số lượng sản phẩm phải là số nguyên an toàn và lớn hơn 0.
2. Số lượng trong một dòng không được vượt quá tồn kho mà Product cung cấp tại thời điểm kiểm tra.
3. Khi cùng productId và cùng lựa chọn size/topping được thêm lần nữa, số lượng được cộng dồn; nếu lựa chọn khác nhau thì có thể được xem là dòng riêng.
4. Thành tiền dòng = đơn giá × số lượng.
5. Tổng tiền giỏ = tổng thành tiền của tất cả dòng.
6. Giá và tồn kho hiển thị trong Cart chỉ mang tính tạm tính; Checkout phải xác minh lại ở server.
7. Cart không giữ chỗ hàng và không trừ tồn kho chính thức.

## 6. Use-case Cart

@startuml
left to right direction
skinparam packageStyle rectangle
skinparam shadowing false

actor Customer as "Khách hàng"
actor Product as "Module Product"
actor Auth as "Module Login/Auth"
actor Checkout as "Module Checkout"

rectangle "BrewLite – Cart" {
  usecase "Xem giỏ hàng" as UC1
  usecase "Thêm sản phẩm" as UC2
  usecase "Kiểm tra dữ liệu và tồn kho" as UC3
  usecase "Cập nhật số lượng" as UC4
  usecase "Xóa sản phẩm" as UC5
  usecase "Xóa toàn bộ giỏ" as UC6
  usecase "Tính thành tiền và tổng tiền" as UC7
  usecase "Lưu/khôi phục giỏ hàng" as UC8
  usecase "Chuyển sang Checkout" as UC9
  usecase "Xác thực người dùng" as UC10
  usecase "Kiểm tra lại giá và tồn kho" as UC11
}

Customer --> UC1
Customer --> UC2
Customer --> UC4
Customer --> UC5
Customer --> UC6
Customer --> UC9
Product --> UC3
Product --> UC11
Auth --> UC10
Checkout --> UC9
Checkout --> UC11

UC2 .> UC3 : <<include>>
UC2 .> UC7 : <<include>>
UC4 .> UC3 : <<include>>
UC4 .> UC7 : <<include>>
UC5 .> UC7 : <<include>>
UC6 .> UC7 : <<include>>
UC1 .> UC8 : <<include>>
UC9 .> UC11 : <<include>>
UC10 ..> UC9 : <<extend>>\n[khi yêu cầu đăng nhập]
@enduml


## 7. Liên kết yêu cầu và kiểm thử

| Yêu cầu | Kiểm thử gợi ý |
|---|---|
| FR-CART-01 | Mở giỏ có nhiều món; mở giỏ rỗng. |
| FR-CART-02/03 | Thêm món hợp lệ; thêm món hết hàng; quantity bằng 0, âm, thập phân hoặc lớn hơn tồn kho; thêm trùng lựa chọn. |
| FR-CART-04 | Tăng/giảm hợp lệ; nhập 0, số âm, số thập phân và vượt tồn kho. |
| FR-CART-05/06 | Xóa một món; xóa món cuối; xóa toàn bộ giỏ. |
| FR-CART-07/08 | Đối chiếu thành tiền và tổng tiền trước/sau thêm, sửa, xóa. |
| FR-CART-09 | Tải lại trang và kiểm tra khôi phục localStorage. |
| FR-CART-10 | Chuyển checkout với giỏ có món; thử checkout với giỏ rỗng; thay đổi tồn kho trước checkout. |
| NFR-CART-02 | Thử gửi quantity/price/productId bị chỉnh sửa từ client và xác minh backend từ chối hoặc tính lại. |
