# Đặc tả use-case trọng tâm – Quản lý giỏ hàng và chuyển Checkout

## 1. Thông tin use-case

| Thuộc tính | Nội dung |
|---|---|
| Mã use-case | UC-CART-01 |
| Tên | Quản lý giỏ hàng |
| Mục tiêu | Khách hàng quản lý các món đã chọn và chuyển dữ liệu giỏ hàng sang Checkout để tiếp tục đặt hàng. |
| Actor chính | Khách hàng |
| Actor/hệ thống liên quan | Product (cung cấp thông tin sản phẩm/tồn kho), Login/Auth (xác thực khi cần checkout), Checkout/Orders (tiếp nhận dữ liệu giỏ hàng). |
| Trigger | Khách hàng chọn thêm sản phẩm hoặc mở biểu tượng/trang giỏ hàng. |

## 2. Tiền điều kiện

- Sản phẩm đã được hiển thị từ Menu/Product.
- Thông tin sản phẩm cần thiết như productId, tên, giá và tồn kho có thể được truy xuất.
- Khách hàng có thể xem và thao tác giỏ hàng; đăng nhập được yêu cầu theo chính sách của luồng Checkout, không phải điều kiện bắt buộc để thao tác giỏ ở frontend hiện tại.

## 3. Hậu điều kiện

- Giỏ hàng phản ánh các sản phẩm, lựa chọn và số lượng sau thao tác hợp lệ.
- Thành tiền từng dòng, tổng số lượng và tổng tiền được cập nhật.
- Dữ liệu giỏ có thể được lưu ở localStorage theo hiện trạng frontend.
- Khi khách chọn Checkout, danh sách sản phẩm và số lượng được chuyển sang bước Checkout; chưa có đơn hàng hoặc giao dịch thanh toán nào được tạo chỉ bởi use-case Cart.

## 4. Luồng chính

1. Khách hàng chọn một sản phẩm từ Menu/chi tiết sản phẩm.
2. Giao diện gửi productId, quantity và tùy chọn sản phẩm (nếu có) đến logic Cart.
3. Cart lấy/nhận thông tin sản phẩm và tồn kho từ Product.
4. Cart kiểm tra productId, quantity, giá và tồn kho.
5. Nếu dữ liệu hợp lệ, Cart thêm dòng mới hoặc cộng số lượng vào dòng có cùng sản phẩm và tùy chọn.
6. Hệ thống cập nhật biểu tượng giỏ hàng và lưu trạng thái giỏ.
7. Khách hàng mở trang giỏ hàng.
8. Hệ thống hiển thị tên món, đơn giá, lựa chọn, số lượng, thành tiền và tổng tiền.
9. Khách hàng có thể thay đổi số lượng hoặc xóa sản phẩm; hệ thống kiểm tra và tính lại tổng tiền.
10. Khách hàng chọn “Tiến hành thanh toán”.
11. Nếu cần đăng nhập, hệ thống chuyển khách hàng qua Login rồi quay lại Checkout sau khi xác thực thành công.
12. Hệ thống chuyển danh sách sản phẩm và số lượng sang Checkout để kiểm tra lại dữ liệu phía server.

## 5. Luồng thay thế

- **A1 – Sản phẩm đã có trong giỏ:** Tại bước 5, nếu productId và tùy chọn giống dòng hiện có, Cart cộng quantity vào dòng đó nếu tổng số lượng không vượt tồn kho.
- **A2 – Thay đổi số lượng:** Tại bước 9, khách tăng/giảm quantity; Cart chấp nhận nếu quantity là số nguyên từ 1 đến stock, sau đó tính lại thành tiền và tổng tiền.
- **A3 – Xóa sản phẩm:** Tại bước 9, khách xóa một dòng; Cart loại dòng đó và tính lại tổng tiền.
- **A4 – Xóa toàn bộ:** Khách chọn xóa giỏ; Cart đặt danh sách về rỗng, tổng số lượng và tổng tiền bằng 0.
- **A5 – Chưa đăng nhập:** Khi chọn Checkout, nếu chính sách hệ thống yêu cầu đăng nhập và khách chưa đăng nhập, chuyển sang Login. Sau đăng nhập thành công, tiếp tục Checkout; Cart không tự xác thực.

## 6. Luồng ngoại lệ

- **E1 – Sản phẩm hết hàng:** Ở bước 4, stock = 0; từ chối thêm và hiển thị thông báo sản phẩm hết hàng.
- **E2 – Số lượng không hợp lệ:** Quantity không phải số nguyên dương hoặc vượt stock; từ chối thao tác, giữ nguyên giỏ và hiển thị lỗi.
- **E3 – Không tìm thấy sản phẩm/ID không hợp lệ:** Từ chối thêm và thông báo sản phẩm không hợp lệ.
- **E4 – Tồn kho thay đổi trước Checkout:** Checkout kiểm tra lại và phát hiện không đủ hàng; không tạo đơn, trả lỗi cho khách cập nhật giỏ.
- **E5 – Giá thay đổi:** Checkout lấy giá mới từ database, tính lại tổng và yêu cầu khách xác nhận số tiền mới trước khi tiếp tục.
- **E6 – Thanh toán thất bại:** Đây là ngoại lệ của Checkout/Payment, không phải Cart. Hệ thống hiển thị lỗi thanh toán và giữ đơn/giỏ theo quy tắc Checkout đã thống nhất; không coi Cart là bên xử lý giao dịch.
- **E7 – Lỗi lưu localStorage:** Không thể khôi phục dữ liệu; giao diện thông báo phù hợp và không làm ứng dụng dừng hoạt động.

## 7. Liên kết yêu cầu

| Mã yêu cầu | Vai trò trong use-case |
|---|---|
| FR-CART-01 | Hiển thị nội dung giỏ hàng. |
| FR-CART-02/03 | Thêm sản phẩm và kiểm tra dữ liệu. |
| FR-CART-04 | Cập nhật số lượng. |
| FR-CART-05/06 | Xóa một hoặc toàn bộ sản phẩm. |
| FR-CART-07/08 | Tính thành tiền và tổng tiền. |
| FR-CART-09/11 | Lưu giỏ và cập nhật badge. |
| FR-CART-10 | Chuyển dữ liệu sang Checkout. |
| NFR-CART-01/02 | Bảo đảm tính chính xác, validate và không tin dữ liệu giá từ client. |

## 8. Tiêu chí nghiệm thu

- Khách có thể thêm, xem, cập nhật và xóa sản phẩm.
- Quantity không hợp lệ hoặc vượt tồn kho bị từ chối và không làm thay đổi giỏ.
- Thành tiền và tổng tiền được tính đúng sau mỗi thao tác.
- Giỏ trống hiển thị trạng thái phù hợp và tổng tiền bằng 0.
- Checkout nhận danh sách productId/quantity và kiểm tra lại giá, tồn kho ở server.
- Use-case Cart không tự tạo Order, không trừ tồn kho chính thức và không thực hiện thanh toán.
