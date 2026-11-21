#  Bối cảnh, stakeholder và phạm vi

## 1\. Vấn đề nghiệp vụ cần giải quyết

Trong BrewLite ,khách hàng để đặt món, thanh toán và xem lịch sử đơn, hệ thống phải biết ai đang thao tác. Nếu thiếu cơ chế xác thực, sẽ có các vấn đề sau:

-   Không gắn được đơn hàng với đúng khách hàng, nên không có lịch sử đơn cá nhân.
-   Bất kỳ ai cũng có thể xem hoặc thao tác trên dữ liệu của người khác.
-   Mật khẩu lưu dạng thô có nguy cơ bị lộ nếu cơ sở dữ liệu bị truy cập trái phép.
-   Người dùng phải đăng nhập lại liên tục, hoặc phiên đăng nhập không được kiểm soát (không hết hạn, không đăng xuất được).

Xây dựng module xác thực đơn giản, an toàn, gồm đăng ký, đăng nhập, cấp token JWT, băm mật khẩu bằng bcrypt và quản lý trạng thái đăng nhập, làm nền tảng cho các chức năng đặt hàng và thanh toán.

## 2\. Stakeholder

## 2.1 Stakeholder chính

| Stakeholder | Vai trò | Mục tiêu và kỳ vọng đối với module xác thực |
| --- | --- | --- |
| Khách hàng | Người dùng chính của chức năng đăng ký/đăng nhập | Đăng ký nhanh, đăng nhập dễ dàng, giữ được phiên đăng nhập, đăng xuất khi cần, thông tin cá nhân được bảo mật. |
| Nhân viên quầy | Người dùng nội bộ (nếu có tài khoản) | Đăng nhập an toàn để truy cập đúng chức năng được phân quyền. |
| Quản lý cửa hàng | Giám sát hoạt động | Tài khoản được kiểm soát, người dùng không hợp lệ không truy cập được hệ thống. |
| Giảng viên / khách hàng nghiệm thu | Người đánh giá sản phẩm | Kiểm tra được luồng đăng ký, đăng nhập, bảo vệ route bằng JWT, mật khẩu được băm, có thể chạy và kiểm thử. |
| Nhóm phát triển | Thiết kế và xây dựng hệ thống | Module rõ ràng (Next.js, NestJS, PostgreSQL), tách lớp, dễ viết unit test và integration test, tích hợp được với module giỏ hàng và đơn hàng. |

## 2.2 Mục tiêu theo stakeholder

-   **Khách hàng:** đăng ký/đăng nhập nhanh, thông báo lỗi rõ ràng, phiên đăng nhập ổn định.
-   **Nhân viên quầy:** truy cập an toàn, đúng quyền.
-   **Quản lý cửa hàng:** hệ thống chỉ cho phép người dùng hợp lệ truy cập.
-   **Giảng viên / người nghiệm thu:** xác minh được cơ chế bảo mật (bcrypt, JWT) và luồng xác thực.
-   **Nhóm phát triển:** cấu trúc rõ ràng, dễ kiểm thử, dễ mở rộng.

## 3\. Phạm vi

## 3.1 In Scope (MVP)

| Mục | Mô tả |
| --- | --- |
| Register | Tạo tài khoản bằng email (hoặc username) và mật khẩu. Kiểm tra dữ liệu đầu vào, không cho trùng email. |
| Login | Xác thực email và mật khẩu, trả về JWT nếu hợp lệ, trả lỗi chung chung nếu sai. |
| bcrypt | Băm mật khẩu (có salt) trước khi lưu vào PostgreSQL, so sánh bằng bcrypt khi đăng nhập, không bao giờ lưu hoặc trả về mật khẩu thô. |
| JWT | Sinh access token có thời hạn, xác minh token ở backend (NestJS Guard), bảo vệ các route cần đăng nhập. |
| Quản lý trạng thái đăng nhập | Lưu token phía client, tự động gắn token vào request, kiểm tra trạng thái đăng nhập khi tải trang, bảo vệ trang cần đăng nhập, xử lý token hết hạn, đăng xuất (xóa token). |
| Lấy thông tin người dùng hiện tại | Endpoint kiểm tra token và trả về thông tin người dùng đang đăng nhập (ví dụ /auth/me). |

## 3.2 Phạm vi mở rộng (sau MVP)

| Hướng mở rộng | Mô tả |
| --- | --- |
| Refresh token | Cấp lại access token mà không cần đăng nhập lại. |
| Phân quyền theo vai trò (RBAC) | Phân biệt khách hàng, nhân viên, quản lý. |
| Quên / đặt lại mật khẩu | Đặt lại mật khẩu qua email. |
| Xác thực email | Gửi mã hoặc liên kết xác nhận khi đăng ký. |
| Đăng nhập mạng xã hội | Google, Facebook. |
| Xác thực hai lớp (2FA) | Tăng cường bảo mật tài khoản. |
| Giới hạn đăng nhập sai | Rate limiting, khóa tạm thời tài khoản. |

## 3.3 Out of Scope (không thực hiện trong giai đoạn này)

| Nội dung | Mô tả |
| --- | --- |
| Menu, chi tiết sản phẩm, giỏ hàng | Thuộc module khác, không nằm trong phạm vi task này. |
| Đặt đơn, thanh toán, lịch sử đơn, trạng thái đơn | Thuộc module khác; module xác thực chỉ cung cấp danh tính người dùng cho các module này. |
| Quên mật khẩu, xác thực email, 2FA | Để sau MVP. |
| Đăng nhập mạng xã hội (OAuth) | Không triển khai. |
| Refresh token và phân quyền chi tiết | Không triển khai trong MVP. |
| Quản lý người dùng nâng cao (trang admin) | Không triển khai. |
| Microservices | Không tách thành service riêng. |

## 4\. Giả định (Assumptions)

1.  Hệ thống phục vụ một cửa hàng hoặc một đơn vị vận hành nhỏ.
2.  Người dùng truy cập qua web (Next.js) và thao tác đơn giản.
3.  Thông tin người dùng được lưu trong PostgreSQL, trong bảng users với mật khẩu đã băm.
4.  Backend dùng NestJS, frontend dùng Next.js, ngôn ngữ TypeScript.
5.  Mỗi người dùng định danh duy nhất bằng email (hoặc username).
6.  Hệ thống chạy trên HTTPS khi triển khai thật; môi trường local có thể dùng HTTP.
7.  Trong MVP chỉ dùng một loại access token có thời hạn cố định (ví dụ 1 giờ).

## 5\. Ràng buộc (Constraints)

1.  Không dùng credential thật, private key hoặc secret production trong repository; JWT\_SECRET đặt trong file .env và không commit.
2.  Không thay đổi công nghệ chính: Next.js, NestJS, PostgreSQL.
3.  Mật khẩu bắt buộc băm bằng bcrypt, không lưu hoặc ghi log mật khẩu thô.
4.  API không trả về trường mật khẩu (hash) trong bất kỳ response nào.
5.  Token JWT phải có thời hạn (exp) và được xác minh ở backend cho mọi route cần bảo vệ.
6.  Không xóa mã nguồn hoặc tài liệu hiện có khi chưa có lý do rõ ràng.
7.  Có tài liệu requirements, architecture và deployment rõ ràng để phục vụ đánh giá và nộp bài.
8.  Phải có unit test và integration test cho các luồng đăng ký, đăng nhập và bảo vệ route.

## 6\. Rủi ro ban đầu

| Rủi ro | Mô tả | Ảnh hưởng | Hướng giảm thiểu |
| --- | --- | --- | --- |
| Lộ JWT\_SECRET hoặc commit nhầm file .env | Kẻ xấu có thể tự tạo token hợp lệ. | Mất an toàn toàn hệ thống. | Dùng .env, thêm vào .gitignore, cung cấp .env.example. |
| Lưu token ở client không an toàn | Lưu trong localStorage có thể bị tấn công XSS. | Lộ phiên đăng nhập. | Cân nhắc cookie httpOnly; escape dữ liệu đầu vào; ghi rõ lựa chọn trong tài liệu. |
| Token hết hạn gây gián đoạn trải nghiệm | Người dùng bị đăng xuất đột ngột khi đang đặt món. | Giảm trải nghiệm người dùng. | Đặt thời hạn hợp lý, xử lý lỗi 401 và chuyển về trang đăng nhập; refresh token ở giai đoạn mở rộng. |
| Cấu hình bcrypt không phù hợp | Cost factor quá thấp thì yếu, quá cao thì chậm. | Giảm bảo mật hoặc hiệu năng. | Dùng salt rounds khoảng 10–12. |
| Thiếu kiểm tra dữ liệu đầu vào | Email sai định dạng, mật khẩu yếu, trùng email. | Dữ liệu rác, lỗ hổng bảo mật. | Dùng validation (class-validator / DTO) ở backend và kiểm tra ở frontend. |
| Thiếu kiểm thử đầy đủ | Lỗi ở luồng đăng ký/đăng nhập dễ bị sót. | Ảnh hưởng chất lượng và các module phụ thuộc. | Viết test cho đăng ký, đăng nhập sai/đúng, route được bảo vệ, token hết hạn. |

## 7\. Tóm tắt phạm vi

Module xác thực của BrewLite tập trung vào bốn việc: đăng ký, đăng nhập, cấp và xác minh JWT, và quản lý trạng thái đăng nhập phía client, với mật khẩu được băm bằng bcrypt. Đây là nền tảng để các module đặt hàng, thanh toán và lịch sử đơn nhận biết người dùng. Các tính năng như refresh token, phân quyền, quên mật khẩu sẽ được xem xét sau khi MVP ổn định.