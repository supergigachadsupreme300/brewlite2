# Bối cảnh, stakeholder và phạm vi

## 1. Vấn đề nghiệp vụ cần giải quyết

BrewLite cần giải quyết vấn đề đặt đồ uống và thanh toán một cách nhanh, rõ ràng và ít lỗi trong môi trường quán cà phê. Hiện nay, quy trình đặt hàng thủ công hoặc tách rời giữa menu, giỏ hàng và thanh toán có thể dẫn đến:

- khách hàng mất thời gian tìm món và xác nhận đơn hàng;
- nhân viên quầy phải xử lý thủ công hoặc đối chiếu thêm nhiều bước;
- khả năng nhầm đơn, sai tổng tiền hoặc chưa xác nhận trạng thái đơn hàng;
- thiếu minh bạch trong theo dõi đơn và thanh toán.

BrewLite nhằm cung cấp một quy trình đặt hàng trực tuyến, tối giản nhưng đủ chức năng để hỗ trợ việc phục vụ nhanh, kiểm soát đơn hàng và giảm sai sót trong giao dịch.

## 2. Stakeholder

### 2.1 Stakeholder chính

| Stakeholder | Vai trò | Mục tiêu và kỳ vọng |
| --- | --- | --- |
| Khách hàng | Người đặt món | Dễ dàng xem menu, chọn món, kiểm tra tổng tiền, thanh toán và nhận xác nhận đơn hàng. |
| Nhân viên quầy | Thực hiện và phục vụ đơn | Nhận đơn nhanh, xác nhận trạng thái, chuẩn bị món đúng và giảm sai sót trong phục vụ. |
| Quản lý cửa hàng | Giám sát hoạt động | Theo dõi quy trình đặt hàng, kết quả thanh toán, tối ưu hiệu suất phục vụ và dễ quản lý đơn hàng. |
| Giảng viên / khách hàng nghiệm thu | Người đánh giá sản phẩm | Kiểm tra hệ thống có đáp ứng yêu cầu nghiệp vụ, luồng đặt hàng và thanh toán rõ ràng, có thể thực thi và kiểm thử. |
| Nhóm phát triển | Thiết kế và xây dựng hệ thống | Có cấu trúc rõ ràng, dễ phát triển, unit test, integration test và deployment local. |
| Đơn vị thanh toán | Cung cấp phương thức thanh toán / mô phỏng giao dịch | Nhận dữ liệu giao dịch rõ ràng, xác nhận trạng thái thanh toán và đảm bảo quy trình an toàn. |

### 2.2 Mục tiêu theo stakeholder

- Khách hàng: đặt món nhanh, giao diện dễ hiểu, thanh toán rõ ràng.
- Nhân viên quầy: nhận thông tin đơn nhanh, giảm sai xót khi phục vụ.
- Quản lý cửa hàng: theo dõi hiệu suất và trạng thái đơn hàng.
- Giảng viên / người nghiệm thu: xác minh yêu cầu chức năng và tính khả thi của hệ thống.
- Nhóm phát triển: xây dựng theo cấu trúc rõ ràng và dễ kiểm thử.
- Đơn vị thanh toán: nhận và xử lý giao dịch theo flow chuẩn.

## 3. In Scope

| Mục | Mô tả |
| --- | --- |
| Menu | Hiển thị danh sách sản phẩm và thông tin cơ bản của từng món. |
| Chi tiết sản phẩm | Xem mô tả, giá, hình ảnh và thông tin bổ sung. |
| Giỏ hàng | Thêm, sửa số lượng, xóa món và xem tổng tiền. |
| Xác thực | Đăng nhập cơ bản cho khách hàng hoặc người dùng hợp lệ. |
| Đặt đơn | Tạo đơn hàng từ giỏ hàng và xác nhận. |
| Thanh toán | Gửi thanh toán và nhận kết quả xác nhận. |
| Lịch sử đơn | Xem đơn hàng đã đặt trong thời gian ngắn. |
| Quản lý trạng thái đơn | Hiển thị trạng thái đơn hàng từ chờ xử lý đến hoàn tất. |
| Health check | API cung cấp trạng thái hệ thống để giám sát cơ bản. |

## 4. Out of Scope

| Nội dung | Mô tả |
| --- | --- |
| Thanh toán ngân hàng thật | Không tích hợp cổng thanh toán thực tế trong MVP. |
| Quản lý chuỗi cửa hàng | Không cần multi-store hoặc nhiều địa điểm. |
| Khuyến mãi nâng cao | Không triển khai loyalty, voucher phức tạp. |
| Báo cáo doanh thu nâng cao | Không cần BI, dashboard phân tích sâu. |
| Tích hợp logistics / giao hàng | Không chứa đơn vị vận chuyển hoặc giao hàng tận nơi. |
| Microservices | Không tách hệ thống thành nhiều service riêng biệt trong giai đoạn này. |

## 5. Assumptions

- Hệ thống phục vụ mô hình một cửa hàng hoặc một đơn vị vận hành nhỏ.
- Người dùng có thể truy cập dưới dạng web và thao tác đơn giản.
- Dữ liệu sản phẩm và đơn hàng được lưu trong cơ sở dữ liệu quan hệ.
- PostgreSQL và JavaScript/TypeScript là nền tảng phù hợp cho dự án.
- Quá trình thanh toán trong MVP là mô phỏng hoặc giả lập.
- Hệ thống sẽ được triển khai theo cấu trúc dễ mở rộng nhưng không cần thiết kế microservice ngay từ đầu.

## 6. Constraints

- Không được sử dụng credential thật, private key hoặc secret production trong repository.
- Không thay đổi công nghệ chính: Next.js, NestJS, PostgreSQL.
- Không xóa mã nguồn hoặc tài liệu hiện có mà không có lý do rõ ràng.
- Repository cần hỗ trợ phát triển frontend/backend song song và kiểm thử rõ ràng.
- Phải có tài liệu requirements, architecture và deployment rõ ràng để phục vụ đánh giá và nộp bài.
- Scope cần tập trung vào MVP đặt hàng và thanh toán, không mở rộng quá xa khỏi mục tiêu ban đầu.

## 7. Rủi ro ban đầu

| Rủi ro | Mô tả | Ảnh hưởng |
| --- | --- | --- |
| Thanh toán giả lập chưa phản ánh thực tế | Có thể thiếu độ tin cậy nếu cần tích hợp cổng thanh toán thật sau này. | Có thể cần thay đổi API hoặc flow. |
| Quy mô hệ thống tăng nhanh | Nếu thêm nhiều tính năng, kiến trúc hiện tại có thể cần refactor. | Tăng độ phức tạp và thời gian phát triển. |
| Bất đồng trong nghiệp vụ giữa các stakeholder | Mỗi nhóm có kỳ vọng khác nhau về product scope. | Có thể làm chậm phát triển hoặc làm sai scope. |
| Thiếu kiểm thử đầy đủ | Nếu không có unit/integration/e2e, lỗi luồng đặt hàng dễ bị sót. | Ảnh hưởng chất lượng hệ thống. |

## 8. Tóm tắt phạm vi

BrewLite tập trung vào việc cung cấp một quy trình đặt món và thanh toán rõ ràng, dễ dùng và có thể kiểm thử. MVP tập trung vào luồng cốt lõi: menu, giỏ hàng, đặt hàng, thanh toán và trạng thái đơn. Các tính năng mở rộng và tích hợp phức tạp sẽ được xem xét sau khi MVP đã ổn định.
