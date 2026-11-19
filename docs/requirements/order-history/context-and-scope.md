# Bối cảnh, Stakeholder và Phạm vi – Order History

## 1. Bối cảnh nghiệp vụ (Business Context)

Trong hệ thống BrewLite, sau khi khách hàng hoàn tất quá trình đặt hàng, họ cần có khả năng tra cứu lại những đơn hàng đã được ghi nhận trên hệ thống. Khách hàng cần biết đơn hàng được tạo vào thời điểm nào, đang ở trạng thái nào, bao gồm những sản phẩm gì và tổng số tiền cần thanh toán.

Nếu không có chức năng lịch sử đơn hàng, khách hàng sẽ gặp khó khăn khi muốn kiểm tra lại thông tin đơn đã đặt, theo dõi quá trình xử lý hoặc tìm lại một đơn hàng cụ thể. Đồng thời, việc thiếu trang chi tiết đơn hàng cũng khiến khách hàng khó kiểm tra các thông tin liên quan đến sản phẩm và thanh toán.

Phân hệ Order History được xây dựng nhằm giải quyết những nhu cầu trên thông qua hai trang chính:

- `/orders`: Cho phép người dùng xem danh sách các đơn hàng đã được ghi nhận, tìm kiếm theo mã đơn hàng và lọc theo trạng thái.
- `/orders/[id]`: Cho phép người dùng xem thông tin chi tiết của một đơn hàng được lựa chọn.

Danh sách đơn hàng được sắp xếp theo thời gian tạo từ mới nhất đến cũ nhất. Người dùng có thể kết hợp điều kiện tìm kiếm và lọc trạng thái để nhanh chóng xác định đơn hàng cần tra cứu.

Ngoài ra, đối với các đơn hàng chưa thanh toán hoặc thanh toán thất bại, hệ thống cung cấp chức năng điều hướng đến trang thanh toán để người dùng tiếp tục thực hiện thanh toán.

Phân hệ sử dụng dữ liệu từ API của hệ thống làm nguồn dữ liệu chính. Trong quá trình phát triển và trình diễn, hệ thống cũng hỗ trợ sử dụng dữ liệu đơn hàng mẫu được lưu trong localStorage để duy trì khả năng hiển thị khi API không khả dụng.

## 2. Stakeholder

| Stakeholder | Vai trò | Mục tiêu và kỳ vọng |
|---|---|---|
| Khách hàng (Customer) | Người sử dụng phân hệ Order History | Xem danh sách đơn hàng, tìm kiếm theo mã đơn, lọc theo trạng thái, xem thông tin chi tiết và tiếp tục thanh toán khi cần thiết. |
| Nhân viên quầy (Staff) | Tiếp nhận và xử lý đơn hàng | Có thể dựa trên thông tin đơn hàng đã được ghi nhận để hỗ trợ khách hàng tra cứu và đối chiếu thông tin đơn. |
| Quản lý cửa hàng (Store Manager) | Giám sát hoạt động cửa hàng | Theo dõi tình trạng đơn hàng và hỗ trợ kiểm tra thông tin khi phát sinh vấn đề trong quá trình phục vụ. |
| Giảng viên/Người nghiệm thu | Đánh giá sản phẩm | Kiểm tra khả năng hiển thị lịch sử, tìm kiếm, lọc, xem chi tiết và xử lý các tình huống lỗi của phân hệ. |
| Nhóm phát triển (Development Team) | Phân tích, xây dựng và bảo trì hệ thống | Đảm bảo phân hệ hoạt động đúng yêu cầu, tái sử dụng kiểu dữ liệu đơn hàng hiện có và tích hợp với API của hệ thống. |
| Đơn vị thanh toán (Payment Service Provider) | Hỗ trợ xử lý thanh toán | Tiếp nhận yêu cầu thanh toán từ chức năng thanh toán của hệ thống đối với các đơn hàng cần tiếp tục thanh toán. |

## 3. In-scope (Phạm vi thực hiện)

Phân hệ Order History chịu trách nhiệm thực hiện các chức năng sau:

| Chức năng | Mô tả |
|---|---|
| Xem lịch sử đơn hàng | Hiển thị danh sách đơn hàng với mã đơn, ngày giờ tạo, trạng thái, số lượng sản phẩm và tổng tiền. |
| Sắp xếp đơn hàng | Sắp xếp danh sách theo thời gian tạo giảm dần, đơn mới nhất được hiển thị trước. |
| Tìm kiếm đơn hàng | Cho phép tìm kiếm theo toàn bộ hoặc một phần mã đơn hàng, không phân biệt chữ hoa và chữ thường. |
| Lọc theo trạng thái | Cho phép lọc đơn hàng theo các trạng thái PENDING, PAID, PREPARING, READY, COMPLETED, PAYMENT_FAILED và CANCELLED. |
| Kết hợp tìm kiếm và lọc | Cho phép sử dụng đồng thời điều kiện tìm kiếm và trạng thái đơn hàng. |
| Xem chi tiết đơn hàng | Hiển thị thông tin đơn hàng, danh sách sản phẩm, số lượng, kích thước nếu có, đơn giá, thành tiền và tổng tiền. |
| Hiển thị thông tin bổ sung | Hiển thị hình thức nhận hàng, thông tin người nhận, số bàn, ghi chú và phương thức thanh toán khi dữ liệu tương ứng có sẵn. |
| Thanh toán đơn hàng | Cung cấp chức năng điều hướng đến trang thanh toán đối với đơn hàng có trạng thái PENDING hoặc PAYMENT_FAILED. |
| Xử lý trạng thái giao diện | Hiển thị các trạng thái loading, empty, no-results và error trong quá trình tải hoặc hiển thị dữ liệu. |
| Thử tải lại dữ liệu | Cho phép người dùng thực hiện lại yêu cầu tải danh sách hoặc chi tiết đơn hàng khi xảy ra lỗi. |
| Điều hướng giữa các trang | Cho phép chuyển từ danh sách sang trang chi tiết và quay lại trang lịch sử đơn hàng. |
| Hỗ trợ dữ liệu mẫu | Đọc dữ liệu đơn hàng mẫu từ localStorage với khóa `brewlite_mock_orders` khi API không khả dụng. |

## 4. Out-of-scope (Ngoài phạm vi thực hiện)

Các chức năng sau không thuộc trách nhiệm triển khai của phân hệ Order History:

| Chức năng | Phân hệ chịu trách nhiệm |
|---|---|
| Đăng ký, đăng nhập và quản lý tài khoản | Authentication |
| Phát hành và xác minh JWT | Authentication |
| Hiển thị menu và quản lý sản phẩm | Product/Menu |
| Quản lý giỏ hàng và cập nhật số lượng sản phẩm | Cart |
| Tạo đơn hàng mới và xác định thông tin đơn hàng ban đầu | Order/Checkout |
| Chỉnh sửa hoặc xóa đơn hàng đã tạo | Order Management |
| Cập nhật trạng thái xử lý đơn hàng | Order Management |
| Thực hiện giao dịch thanh toán và xử lý kết quả giao dịch | Payment |
| Quản lý tồn kho và trừ số lượng sản phẩm | Product/Inventory |
| Quản lý khuyến mãi và tích điểm | Promotion/Loyalty |

Order History chỉ sử dụng dữ liệu đơn hàng được cung cấp bởi các thành phần liên quan. Phân hệ không trực tiếp thực hiện nghiệp vụ tạo đơn, cập nhật trạng thái đơn, quản lý tồn kho hoặc xử lý giao dịch thanh toán.

Chức năng thanh toán trong Order History chỉ đảm nhiệm việc điều hướng người dùng đến trang thanh toán với mã đơn hàng tương ứng.

## 5. Assumptions (Các giả định)

- Hệ thống đã có nguồn dữ liệu đơn hàng được cung cấp thông qua API.
- API hỗ trợ truy xuất danh sách đơn hàng và thông tin chi tiết của một đơn hàng theo mã đơn.
- Mỗi đơn hàng có một mã định danh duy nhất để phục vụ tìm kiếm và truy xuất chi tiết.
- Dữ liệu đơn hàng có các thông tin cơ bản như mã đơn, thời gian tạo, trạng thái, danh sách sản phẩm và tổng tiền.
- Các thông tin bổ sung như hình thức nhận hàng, người nhận, số điện thoại, số bàn, ghi chú và phương thức thanh toán có thể không tồn tại trong một số bản ghi.
- API được xem là nguồn dữ liệu chính của phân hệ.
- Dữ liệu đơn hàng mẫu trong localStorage được sử dụng để hỗ trợ phát triển và trình diễn khi API không khả dụng.
- Khi dữ liệu API và dữ liệu mẫu có cùng mã đơn hàng, dữ liệu API được ưu tiên.
- Người dùng có thể truy cập trang lịch sử và chi tiết đơn hàng thông qua các đường dẫn tương ứng của ứng dụng.
- Việc xử lý và lưu trữ giao dịch thanh toán được thực hiện bởi phân hệ Payment.

## 6. Constraints (Các ràng buộc)

- Frontend sử dụng Next.js và TypeScript theo cấu trúc hiện có của repository.
- Phân hệ phải được triển khai trong phạm vi `frontend/src/features/order-history/` và `frontend/src/app/orders/`.
- Các kiểu dữ liệu Order được tái sử dụng từ `features/order/types`, hạn chế tạo các định nghĩa dữ liệu trùng lặp.
- Phân hệ sử dụng API của hệ thống để truy xuất dữ liệu đơn hàng.
- Dữ liệu mẫu phải sử dụng đúng khóa localStorage `brewlite_mock_orders`.
- Không được để dữ liệu mẫu ghi đè dữ liệu API khi hai nguồn có cùng mã đơn hàng.
- Danh sách đơn hàng phải được sắp xếp theo thời gian tạo giảm dần.
- Việc tìm kiếm mã đơn phải không phân biệt chữ hoa và chữ thường.
- Việc lọc trạng thái phải sử dụng các giá trị trạng thái được hệ thống quy định.
- Chức năng thanh toán chỉ được cung cấp đối với đơn hàng có trạng thái PENDING hoặc PAYMENT_FAILED.
- Các trường dữ liệu bổ sung chỉ được hiển thị khi có dữ liệu tương ứng.
- Phân hệ không tự ý thay đổi cấu trúc database, nghiệp vụ tạo đơn hoặc nghiệp vụ thanh toán thuộc các module khác.
- Dữ liệu đơn hàng cần được bảo vệ theo quyền truy cập của người dùng. Việc xác thực và phân quyền phải được backend hỗ trợ.

## 7. Initial Risks (Các rủi ro ban đầu)

| Rủi ro | Mô tả | Ảnh hưởng | Hướng xử lý |
|---|---|---|---|
| API không khả dụng | Backend gặp lỗi hoặc không phản hồi khi người dùng truy cập lịch sử đơn hàng. | Không thể tải dữ liệu đơn hàng từ nguồn chính. | Hiển thị trạng thái lỗi, cung cấp chức năng thử lại và sử dụng dữ liệu mẫu nếu có. |
| Dữ liệu đơn hàng không đầy đủ | Một số đơn hàng không có thông tin người nhận, hình thức nhận hàng hoặc phương thức thanh toán. | Trang chi tiết có thể thiếu một số thông tin bổ sung. | Chỉ hiển thị các trường có dữ liệu hợp lệ và không giả định các trường tùy chọn luôn tồn tại. |
| Trùng lặp dữ liệu API và mock | Một đơn hàng có thể xuất hiện trong cả API và localStorage. | Danh sách có thể hiển thị trùng đơn hàng. | Đối chiếu theo mã đơn và ưu tiên bản ghi từ API. |
| Dữ liệu mẫu không đồng bộ | Dữ liệu localStorage có thể cũ hoặc không phản ánh trạng thái đơn hàng mới nhất. | Người dùng có thể xem thông tin không còn chính xác. | Xem API là nguồn dữ liệu chính và chỉ sử dụng mock như nguồn dự phòng. |
| Lỗi truy xuất chi tiết | Mã đơn không hợp lệ hoặc đơn hàng không tồn tại trong nguồn dữ liệu. | Không thể hiển thị trang chi tiết tương ứng. | Hiển thị thông báo phù hợp và cung cấp chức năng thử lại hoặc quay về danh sách. |
| Lộ thông tin đơn hàng | API hiện tại có thể trả về danh sách đơn hàng mà chưa giới hạn theo người dùng. | Người dùng có khả năng truy cập thông tin đơn hàng không thuộc quyền của mình. | Cần bổ sung cơ chế xác thực và phân quyền ở backend trước khi triển khai thực tế. |
| Sai lệch trạng thái thanh toán | Trạng thái đơn hàng có thể thay đổi trong quá trình người dùng truy cập trang chi tiết. | Người dùng có thể nhìn thấy thông tin trạng thái cũ hoặc lựa chọn thanh toán không còn phù hợp. | Kiểm tra trạng thái đơn hàng từ nguồn dữ liệu hiện tại trước khi thực hiện bước thanh toán tiếp theo. |

## 8. Tóm tắt phạm vi

Phân hệ Order History chịu trách nhiệm cung cấp khả năng tra cứu lịch sử và thông tin chi tiết của các đơn hàng đã được ghi nhận trên hệ thống BrewLite.

Các chức năng chính bao gồm xem danh sách, sắp xếp, tìm kiếm, lọc theo trạng thái, xem chi tiết và điều hướng đến thanh toán đối với các đơn hàng phù hợp. Phân hệ cũng hỗ trợ xử lý các trạng thái tải dữ liệu, danh sách trống và lỗi truy xuất, đồng thời sử dụng dữ liệu mẫu localStorage làm nguồn dự phòng trong quá trình phát triển.

Phân hệ tái sử dụng dữ liệu và nghiệp vụ từ các module hiện có, không trực tiếp đảm nhiệm việc tạo đơn hàng, quản lý trạng thái, quản lý sản phẩm hoặc xử lý giao dịch thanh toán. Việc phân chia trách nhiệm này giúp hạn chế trùng lặp chức năng và đảm bảo khả năng tích hợp, kiểm thử và bảo trì trong kiến trúc của BrewLite.