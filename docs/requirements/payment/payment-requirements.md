# Payment – Bối cảnh, stakeholder và phạm vi

> Phạm vi tài liệu: phần **thanh toán** do thành viên phụ trách trong Assignment 2 BrewLite. Tài liệu này bổ sung cho tài liệu yêu cầu cấp hệ thống của nhóm, không thay thế `docs/requirements/context-and-scope.md`.

## 1. Bối cảnh nghiệp vụ

BrewLite hỗ trợ khách hàng đặt đồ uống trực tuyến. Sau khi khách hàng chọn sản phẩm và tạo đơn, hệ thống cần cung cấp bước thanh toán không tiền mặt bằng phương thức Ví hoặc Thẻ. Trong phạm vi MVP của Assignment 2, việc xử lý thanh toán sử dụng **Mock Payment Service** để mô phỏng kết quả, không kết nối ngân hàng hoặc cổng thanh toán thật.

Chức năng thanh toán cần giúp khách hàng biết giao dịch thành công hay thất bại, đồng thời giúp hệ thống lưu lại kết quả để quản lý trạng thái đơn hàng và hỗ trợ kiểm tra lịch sử giao dịch.

## 2. Stakeholder liên quan đến thanh toán

| Stakeholder | Vai trò / mối quan tâm | Kỳ vọng |
|---|---|---|
| Khách hàng | Chọn phương thức và thực hiện thanh toán | Thao tác dễ hiểu; biết rõ kết quả; không bị tính tiền hoặc ghi nhận thanh toán trùng |
| Nhân viên quầy | Tiếp nhận và xử lý đơn đã được hệ thống ghi nhận | Nhìn thấy trạng thái thanh toán rõ ràng để xử lý đơn chính xác |
| Quản lý cửa hàng | Theo dõi đơn và giao dịch | Có thông tin trạng thái thanh toán để đối soát và xử lý sự cố |
| Đơn vị thanh toán / Mock Payment Service | Mô phỏng hoặc cung cấp kết quả xử lý giao dịch | Nhận yêu cầu hợp lệ và trả kết quả theo giao ước tích hợp |
| Nhóm phát triển | Phân tích, xây dựng, kiểm thử và bảo trì chức năng | Luồng thanh toán có thể kiểm thử, xử lý lỗi và tránh yêu cầu trùng |
| Giảng viên / người nghiệm thu | Đánh giá chức năng theo yêu cầu Assignment 2 | Có tài liệu, sơ đồ và tiêu chí chấp nhận có thể kiểm chứng |

## 3. Mục tiêu

- Cho phép khách hàng chọn một trong hai phương thức mô phỏng: `WALLET` hoặc `CARD`.
- Kiểm tra đơn hàng và số tiền trước khi gửi yêu cầu thanh toán.
- Gọi Mock Payment Service để nhận kết quả mô phỏng.
- Lưu kết quả giao dịch và cập nhật trạng thái liên quan của đơn hàng theo quy tắc thống nhất của nhóm.
- Xử lý yêu cầu gửi lại bằng `idempotencyKey` để tránh tạo nhiều giao dịch cho cùng một yêu cầu logic.
- Hiển thị kết quả thành công hoặc thất bại cho khách hàng.

## 4. Phạm vi

### 4.1 In-scope – Trong phạm vi MVP

- Chọn phương thức thanh toán Ví (`WALLET`) hoặc Thẻ (`CARD`).
- Xác nhận thanh toán cho một đơn hàng đã được tạo.
- Kiểm tra đơn hàng tồn tại, quyền truy cập đơn hàng và số tiền phải thanh toán.
- Gửi yêu cầu đến Mock Payment Service.
- Mô phỏng hai kết quả: thành công (`SUCCESS`) và thất bại (`FAILED`).
- Lưu thông tin giao dịch, phương thức, số tiền và trạng thái.
- Xử lý yêu cầu lặp bằng `idempotencyKey`.
- Trả kết quả để frontend hiển thị thông báo phù hợp.

### 4.2 Out-of-scope – Ngoài phạm vi MVP

- Kết nối ngân hàng, ví điện tử hoặc cổng thanh toán thật.
- Thu thập, lưu trữ số thẻ thật, CVV, mật khẩu hoặc thông tin xác thực thanh toán.
- Hoàn tiền tự động, thanh toán định kỳ, trả góp hoặc nhiều lần thanh toán cho một đơn.
- Đối soát giao dịch tự động với nhà cung cấp thanh toán thật.
- Xử lý tranh chấp hoặc chargeback.

### 4.3 Phụ thuộc và ranh giới

- Chức năng thanh toán phụ thuộc vào việc đơn hàng đã được tạo và có số tiền hợp lệ.
- Mock Payment Service chỉ mô phỏng kết quả; không chứng minh tiền thật đã được chuyển.
- Quy tắc cập nhật trạng thái `Order` phải thống nhất với tài liệu và code của module Order. Không tự giả định tên trạng thái đơn hàng nếu nhóm đã định nghĩa enum khác.

## 5. Giả định

1. Khách hàng đã đăng nhập và có quyền thanh toán đơn hàng của mình.
2. Đơn hàng được tạo trước khi bắt đầu thanh toán.
3. Tổng tiền thanh toán được backend xác định từ dữ liệu đơn hàng, không tin cậy số tiền do frontend tự gửi.
4. Mock Payment Service có thể trả về kết quả thành công hoặc thất bại phục vụ kiểm thử.
5. `idempotencyKey` được tạo ở phía client cho một lần yêu cầu logic và được backend dùng để nhận diện yêu cầu gửi lại.
6. Tên trạng thái và cách liên kết `Payment` với `Order` sẽ tuân theo schema/enum thực tế của repository.

## 6. Ràng buộc

- Backend bắt buộc sử dụng NestJS và dữ liệu được lưu trong PostgreSQL theo kiến trúc chung của đề.
- Không xử lý giao dịch tiền thật trong MVP.
- Không lưu dữ liệu thẻ nhạy cảm.
- API phải validate dữ liệu đầu vào và kiểm tra quyền truy cập.
- Yêu cầu thanh toán lặp không được tạo thêm giao dịch logic ngoài ý muốn.
- Tài liệu Payment phải nhất quán với SRS, use-case, sơ đồ, API và mô hình dữ liệu chung của nhóm.

## 7. Rủi ro ban đầu

| Rủi ro | Ảnh hưởng | Hướng giảm thiểu |
|---|---|---|
| Frontend gửi sai số tiền | Sai lệch số tiền thanh toán | Backend lấy số tiền từ đơn hàng trong database |
| Client gửi lại request do timeout | Có thể tạo giao dịch trùng | Dùng `idempotencyKey` và kiểm tra kết quả đã xử lý |
| Mock service lỗi hoặc không phản hồi | Không xác định được kết quả ngay | Trả lỗi phù hợp; không tự kết luận giao dịch thành công |
| Payment và Order cập nhật không đồng nhất | Đơn có thể sai trạng thái | Xác định rõ thứ tự xử lý và quy tắc cập nhật; kiểm thử integration |
| Tài liệu khác với enum/API thực tế | Sơ đồ và code mâu thuẫn | Đối chiếu schema, DTO, service và controller trước khi merge |

## 8. Tiêu chí hoàn thành phần Payment

- Có tài liệu mô tả rõ phạm vi, stakeholder, giả định và ràng buộc.
- Có yêu cầu chức năng/phi chức năng với mã định danh, ưu tiên và tiêu chí kiểm chứng.
- Có use-case thanh toán với luồng chính, thay thế và ngoại lệ.
- Nội dung được đối chiếu với API, DTO, service và schema thực tế trước khi nhóm nghiệm thu.
