# Đặc tả use-case trọng tâm:Đăng nhập và quản lý trạng thái đăng nhập (BrewLite)

## 1\. Thông tin use-case

| Thuộc tính | Nội dung |
| --- | --- |
| Mã use-case | UC-AUTH-01 |
| Tên | Đăng nhập và quản lý trạng thái đăng nhập |
| Mục tiêu | Người dùng đã có tài khoản xác thực bằng email và mật khẩu, nhận JWT, và hệ thống duy trì trạng thái đăng nhập để người dùng truy cập các chức năng cần bảo vệ (giỏ hàng khi checkout, đặt đơn, thanh toán, lịch sử đơn) cho đến khi đăng xuất hoặc token hết hạn. |
| Actor chính | Khách hàng (và Nhân viên quầy khi có tài khoản nội bộ) |
| Actor / hệ thống liên quan | PostgreSQL (bảng users), module Register (UC-AUTH-02, tạo tài khoản), Module đặt hàng / thanh toán (dùng JWT để biết người dùng là ai). |
| Trigger | Người dùng chọn “Đăng nhập”, hoặc bị chuyển hướng tới trang đăng nhập khi truy cập trang cần bảo vệ lúc chưa đăng nhập, hoặc mở lại ứng dụng khi còn token đã lưu. |

## 2\. Tiền điều kiện

-   Người dùng đã có tài khoản trong bảng users (đã đăng ký qua UC-AUTH-02); mật khẩu của tài khoản đã được băm bằng bcrypt.
-   Backend (NestJS), frontend (Next.js) và PostgreSQL đang chạy; biến môi trường JWT\_SECRET và thời hạn token đã được cấu hình.
-   Trình duyệt cho phép lưu trữ token ở nơi frontend sử dụng (localStorage hoặc cookie).
-   Người dùng chưa có phiên hợp lệ (nếu đã có phiên hợp lệ thì áp dụng A4).

## 3\. Hậu điều kiện

**Khi thành công:**

-   Hệ thống đã cấp một access token JWT hợp lệ (sub, email, iat, exp) cho người dùng.
-   Token được lưu phía client; trạng thái “đã đăng nhập” được phản ánh trên giao diện (tên người dùng, nút đăng xuất).
-   Các request tiếp theo tới API được bảo vệ tự động mang token và được backend chấp nhận khi token còn hạn.
-   Không có mật khẩu hay hash mật khẩu xuất hiện trong response, log hay token.

**Khi thất bại:**

-   Không có token nào được cấp hoặc lưu; trạng thái vẫn là chưa đăng nhập; dữ liệu trong bảng users không bị thay đổi.
-   Người dùng nhận thông báo lỗi rõ ràng và có thể thử lại.

## 4\. Luồng chính

1.  Người dùng mở trang đăng nhập.
2.  Người dùng nhập email và mật khẩu rồi chọn “Đăng nhập”.
3.  Frontend kiểm tra sơ bộ (email đúng định dạng, các trường không rỗng) và gửi POST /auth/login.
4.  Backend kiểm tra DTO (kiểu dữ liệu, định dạng email, độ dài mật khẩu).
5.  Backend tìm người dùng theo email trong PostgreSQL.
6.  Backend so sánh mật khẩu người dùng nhập với hash đã lưu bằng bcrypt.
7.  Nếu khớp, backend sinh JWT chứa sub (id người dùng), email, iat, exp, ký bằng JWT\_SECRET.
8.  Backend trả HTTP 200 với access token và thông tin người dùng cơ bản (không có mật khẩu).
9.  Frontend lưu token và cập nhật trạng thái đăng nhập (auth state).
10.  Frontend chuyển hướng người dùng tới trang đích (trang trước đó hoặc trang chủ) và hiển thị trạng thái đã đăng nhập.
11.  Với mỗi request tới API được bảo vệ, frontend tự gắn header Authorization: Bearer <token>.
12.  Backend Guard xác minh chữ ký và thời hạn của token; nếu hợp lệ thì cho phép xử lý request.

## 5\. Luồng thay thế

-   **A1 – Chưa có tài khoản:** Tại bước 2, người dùng chọn “Đăng ký”; hệ thống chuyển sang UC-AUTH-02. Sau khi đăng ký thành công, người dùng quay lại trang đăng nhập (UC-AUTH-01 không tự đăng ký).
-   **A2 – Khôi phục phiên khi tải lại trang:** Khi người dùng tải lại trang (F5) hoặc mở lại ứng dụng, frontend đọc token đã lưu, gọi GET /auth/me. Nếu token hợp lệ, trạng thái đăng nhập được khôi phục và người dùng không phải đăng nhập lại.
-   **A3 – Đăng xuất:** Khi người dùng chọn “Đăng xuất”, frontend xóa token và reset auth state, giao diện trở về trạng thái chưa đăng nhập; truy cập trang được bảo vệ sau đó bị chuyển về trang đăng nhập.
-   **A4 – Đã đăng nhập mà mở trang đăng nhập:** Nếu có phiên hợp lệ, frontend chuyển thẳng người dùng về trang chủ.
-   **A5 – Truy cập trang được bảo vệ khi chưa đăng nhập:** Frontend chuyển người dùng tới trang đăng nhập và ghi nhớ trang đích; sau khi đăng nhập thành công (bước 10) người dùng được đưa về đúng trang đó.

## 6\. Luồng ngoại lệ

-   **E1 – Dữ liệu không hợp lệ:** Ở bước 3 hoặc 4, email sai định dạng hoặc trường rỗng; trả HTTP 400 (hoặc báo lỗi ngay trên form), không truy vấn mật khẩu, hiển thị lỗi theo từng trường.
-   **E2 – Sai thông tin đăng nhập:** Ở bước 5 hoặc 6, email không tồn tại hoặc mật khẩu sai; trả HTTP 401 với cùng một thông báo chung (“Email hoặc mật khẩu không đúng”), không tiết lộ email có tồn tại hay không, không cấp token.
-   **E3 – Token hết hạn:** Ở bước 12 hoặc A2, token quá exp; backend trả 401, frontend xóa token, chuyển về trang đăng nhập kèm thông báo phiên đã hết hạn.
-   **E4 – Token không hợp lệ:** Token bị sửa, sai chữ ký hoặc sai định dạng; backend trả 401, frontend xử lý như E3.
-   **E5 – Thiếu token:** Request tới route được bảo vệ không có header Authorization; backend trả 401.
-   **E6 – Lỗi máy chủ hoặc cơ sở dữ liệu:** Không truy vấn được PostgreSQL; backend trả HTTP 500 với thông báo chung, không lộ chi tiết kỹ thuật, không cấp token; frontend hiển thị lỗi và cho thử lại.
-   **E7 – Không lưu được token ở client:** Trình duyệt chặn lưu trữ; giao diện thông báo phù hợp, ứng dụng không bị dừng, người dùng vẫn ở trạng thái chưa đăng nhập.
-   **E8 – Thiếu cấu hình JWT\_SECRET:** Backend không khởi động hoặc báo lỗi cấu hình rõ ràng khi chạy; không cấp token bằng secret mặc định.

## 7\. Liên kết yêu cầu

| Mã yêu cầu | Vai trò trong use-case |
| --- | --- |
| FR-01 | Tạo tài khoản |
| FR-02 | Kiểm tra dữ liệu đầu vào Đăng nhập: xác thực email và mật khẩu, trả 401 chung khi sai |
| FR-03 | Đăng nhập xác thực email và mật khẩu |
| FR-04 | Bcrypt: so sánh mật khẩu với hash; hash được tạo khi đăng ký |
| FR-05 | Cấp JWT có sub, email, iat, exp |
| FR-06 | Xác minh JWT và bảo vệ route ở backend |
| FR-07 | Lấy thông tin người dùng và khôi phục phiên |
| FR-08 | Lưu token và tự gắn vào request |
| FR-09 | Bảo vệ trang và khôi phục phiên khi tải lại |
| FR-10 | Xử lý token hết hạn |
| FR-11 | Đăng xuất |
| NFR-01 | Không lưu, ghi log hay trả về mật khẩu / hash |
| NFR-02 | JWT\_SECRET từ biến môi trường, token luôn có exp |
| NFR-03 | Thời gian phản hồi của đăng nhập và /auth/me trong ngưỡng chấp nhận. |
| NFR-05 | Mỗi luồng ở trên có thể viết thành test |
| NFR-07 | Thông báo lỗi rõ ràng theo từng trường và thông báo chung khi sai thông tin đăng nhập. |

## 8\. Tiêu chí nghiệm thu

-   Cho phép tạo tài khoản mới và lưu trữ an toàn bằng bcrypt.
-   Xác thực thông tin định danh và cấp phát JWT token.
-   Quản lý trạng thái phiên đăng nhập thông qua việc lưu trữ và kiểm tra token hợp lệ.
-   Điều hướng bảo vệ route (Route Guard) và xử lý xóa phiên khi đăng xuất/hết hạn.
-   Lưu trữ token phía client, tự động gắn vào request và khôi phục phiên qua /auth/me.