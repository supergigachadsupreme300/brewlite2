# Software Requirements Specification (SRS)

## 1\. Mục tiêu hệ thống

Module xác thực của BrewLite cho phép người dùng đăng ký tài khoản, đăng nhập, nhận token JWT, và duy trì trạng thái đăng nhập trên web (Next.js) trong khi backend (NestJS) băm mật khẩu bằng bcrypt, lưu trong PostgreSQL và xác minh token cho các route cần bảo vệ. Mục tiêu là tạo trải nghiệm đăng nhập đơn giản, an toàn, đáng tin cậy và làm nền tảng để các module đặt hàng, thanh toán biết người dùng đang thao tác.

## 2\. Yêu cầu chức năng

### FR-01: Đăng ký tài khoản (Register)

Hệ thống cho phép người dùng mới tạo tài khoản bằng email và mật khẩu (kèm họ tên nếu có).

**Tiêu chí chấp nhận**

-   Gửi POST /auth/register với dữ liệu hợp lệ thì tạo thành công bản ghi trong bảng users và trả về mã.
-   Response không chứa mật khẩu hay mật khẩu đã băm.

### FR-02: Kiểm tra dữ liệu đăng ký

Hệ thống kiểm tra định dạng email, độ mạnh mật khẩu và không cho phép email trùng.

**Tiêu chí chấp nhận**

-   Email sai định dạng hoặc mật khẩu ngắn hơn 8 ký tự thì trả về kèm thông báo lỗi rõ ràng.
-   Đăng ký với email đã tồn tại thì trả về và không tạo thêm bản ghi.

### FR-03: Đăng nhập (Login)

Hệ thống xác thực email và mật khẩu của người dùng đã đăng ký.

**Tiêu chí chấp nhận**

-   Người dùng hợp lệ gửi POST /auth/login nhận mã kèm access token.
-   Email không tồn tại hoặc mật khẩu sai đều trả về mãvới cùng một thông báo chung, không tiết lộ email có tồn tại hay không.

### FR-04: Băm mật khẩu bằng bcrypt

Hệ thống băm mật khẩu bằng bcrypt (có salt) trước khi lưu và so sánh bằng bcrypt khi đăng nhập.

**Tiêu chí chấp nhận**

-   Cột mật khẩu trong bảng users chỉ chứa chuỗi hash bcrypt (bắt đầu bằng $2b$), không có mật khẩu thô.
-   Hai tài khoản dùng cùng một mật khẩu có hash khác nhau.
-   Salt rounds được cấu hình trong khoảng 10–12.

### FR-05: Cấp JWT

Sau khi đăng nhập thành công, hệ thống cấp access token JWT có thời hạn.

**Tiêu chí chấp nhận**

-   Token giải mã được có sub (id người dùng), email, iat và exp.
-   Token được ký bằng JWT\_SECRET lấy từ biến môi trường; thời hạn mặc định là 1 giờ.
-   Payload không chứa mật khẩu.

### FR-06: Xác minh JWT và bảo vệ route (backend)

Backend dùng Guard để xác minh token cho mọi route cần đăng nhập.

**Tiêu chí chấp nhận**

-   Request có header Authorization: Bearer <token> hợp lệ thì truy cập được route.
-   Request thiếu token, token sai chữ ký hoặc token hết hạn thì trả về mã.

### FR-07: Lấy thông tin người dùng hiện tại

Hệ thống cung cấp endpoint trả về thông tin người dùng đang đăng nhập.

**Tiêu chí chấp nhận**

-   GET /auth/me với token hợp lệ trả về id, email và họ tên của đúng người dùng.
-   Response không chứa trường mật khẩu.

### FR-08: Lưu trạng thái đăng nhập phía client

Frontend lưu token sau khi đăng nhập và tự động gắn token vào các request gọi API.

**Tiêu chí chấp nhận**

-   Sau khi đăng nhập, giao diện hiển thị trạng thái đã đăng nhập (ví dụ tên người dùng, nút đăng xuất).
-   Mọi request tới API cần bảo vệ đều có header Authorization mà không cần người dùng thao tác thêm.

### FR-09: Bảo vệ trang và khôi phục phiên khi tải lại trang

Frontend chặn truy cập các trang cần đăng nhập và khôi phục trạng thái đăng nhập khi người dùng tải lại trang.

**Tiêu chí chấp nhận**

-   Người dùng chưa đăng nhập mở trang được bảo vệ sẽ bị chuyển hướng về trang đăng nhập.
-   Người dùng đã đăng nhập tải lại trang (F5) vẫn giữ được trạng thái đăng nhập khi token còn hạn.

### FR-10: Xử lý token hết hạn

Khi API trả về lỗi 401 do token hết hạn hoặc không hợp lệ, frontend xử lý phiên đăng nhập.

**Tiêu chí chấp nhận**

-   Token bị xóa khỏi nơi lưu trữ và người dùng được chuyển về trang đăng nhập kèm thông báo phiên đã hết hạn.

### FR-11: Đăng xuất (Logout)

Hệ thống cho phép người dùng kết thúc phiên đăng nhập.

**Tiêu chí chấp nhận**

-   Sau khi bấm đăng xuất, token bị xóa phía client và giao diện trở về trạng thái chưa đăng nhập.
-   Truy cập lại trang được bảo vệ sau đăng xuất sẽ bị chuyển về trang đăng nhập.

## 3\. Yêu cầu phi chức năng

### NFR-01: Bảo mật mật khẩu và dữ liệu nhạy cảm

Hệ thống không lưu, ghi log hay trả về mật khẩu thô hoặc hash mật khẩu.

**Tiêu chí chấp nhận**

-   Kiểm tra log và response của mọi endpoint xác thực: không xuất hiện mật khẩu hay hash.

### NFR-02: Bảo mật secret và token

Hệ thống không lưu secret, credential hay private key trong repository; JWT luôn có thời hạn.

**Tiêu chí chấp nhận**

-   JWT\_SECRET nằm trong .env (có trong .gitignore); repository chỉ có .env.example với giá trị mẫu.
-   Mọi token được cấp đều có exp.

### NFR-03: Hiệu năng

Các thao tác đăng ký, đăng nhập và xác minh token phản hồi nhanh.

**Tiêu chí chấp nhận**

-   Trong môi trường local/demo, POST /auth/login phản hồi dưới 1 giây và GET /auth/me dưới 300 ms trong điều kiện bình thường.

### NFR-04: Tính khả dụng và khả năng triển khai

Hệ thống chạy ổn định trên môi trường local bằng Docker Compose và sẵn sàng triển khai lên EC2 / container host.

**Tiêu chí chấp nhận**

-   Chạy docker compose up khởi động được frontend, backend và PostgreSQL; luồng đăng ký và đăng nhập chạy được mà không lỗi.

### NFR-05: Khả năng kiểm thử

Mỗi chức năng chính có thể kiểm tra bằng test tự động.

**Tiêu chí chấp nhận**

-   Có unit test cho service xác thực (hash, so sánh, sinh token) và integration test cho register, login, /auth/me; tất cả test đều pass.

### NFR-06: Khả năng mở rộng

Module xác thực được tách lớp rõ ràng (controller, service, guard, DTO) để thêm tính năng sau này.

**Tiêu chí chấp nhận**

-   Có thể thêm refresh token hoặc phân quyền theo vai trò mà không phải sửa luồng register/login hiện có; các module khác tái sử dụng Guard bằng một decorator.

### NFR-07: Tính dễ dùng

Thông báo lỗi rõ ràng, giao diện đăng ký và đăng nhập đơn giản.

**Tiêu chí chấp nhận**

-   Form hiển thị lỗi theo từng trường (email sai định dạng, mật khẩu quá ngắn, sai thông tin đăng nhập); người dùng hoàn tất đăng ký trong không quá một form.

## 4\. Phân loại ưu tiên theo MoSCoW

### Must Have

-   FR-01 Đăng ký tài khoản
-   FR-02 Kiểm tra dữ liệu đăng ký
-   FR-03 Đăng nhập
-   FR-04 Băm mật khẩu bằng bcrypt
-   FR-05 Cấp JWT
-   FR-06 Xác minh JWT và bảo vệ route
-   FR-08 Lưu trạng thái đăng nhập phía client
-   FR-11 Đăng xuất
-   NFR-01 Bảo mật mật khẩu và dữ liệu nhạy cảm
-   NFR-02 Bảo mật secret và token

### Should Have

-   FR-07 Lấy thông tin người dùng hiện tại
-   FR-09 Bảo vệ trang và khôi phục phiên khi tải lại
-   FR-10 Xử lý token hết hạn
-   NFR-03 Hiệu năng
-   NFR-04 Tính khả dụng và khả năng triển khai
-   NFR-05 Khả năng kiểm thử

### Could Have

-   NFR-06 Khả năng mở rộng (tách lớp chuẩn để mở rộng sau này)
-   NFR-07 Tính dễ dùng (thông báo lỗi chi tiết theo từng trường)
-   Hiển thị độ mạnh mật khẩu khi đăng ký
-   Ghi nhớ đăng nhập (remember me)

### Won't Have (trong MVP)

-   Refresh token
-   Phân quyền theo vai trò (RBAC)
-   Quên / đặt lại mật khẩu và xác thực email
-   Đăng nhập mạng xã hội (OAuth)
-   Xác thực hai lớp (2FA)
-   Microservice hóa module xác thực ngay từ đầu

## 5\. Tiêu chí chấp nhận tổng quát

1.  Người dùng thực hiện đầy đủ luồng đăng ký → đăng nhập → truy cập trang/API được bảo vệ → đăng xuất.
2.  Mật khẩu luôn được lưu dưới dạng hash bcrypt; không response hay log nào chứa mật khẩu.
3.  Mọi route cần bảo vệ từ chối request thiếu token, sai token hoặc token hết hạn bằng HTTP 401.
4.  Mỗi chức năng chính có ít nhất một test case (unit hoặc integration) kiểm chứng được, cả trường hợp thành công và thất bại.
5.  Hệ thống chạy được bằng Docker Compose với frontend, backend và PostgreSQL.

## 6\. Sơ đồ use-case tổng quát

Các actor: **Khách hàng** (người dùng chính), **Nhân viên quầy** (đăng nhập nội bộ), **Module đặt hàng / thanh toán** (hệ thống phía trong, dùng JWT để nhận biết người dùng).

@startuml  
left to right direction  
skinparam packageStyle rectangle  
  
actor Customer as "Khách hàng"  
actor Staff as "Nhân viên quầy"  
actor OrderModule as "Module đặt hàng / thanh toán"  
  
rectangle "BrewLite - Module Xác thực" {  
usecase "Đăng ký" as UC1  
usecase "Đăng nhập" as UC2  
usecase "Đăng xuất" as UC3  
usecase "Xem thông tin cá nhân (/auth/me)" as UC4  
usecase "Truy cập trang / API được bảo vệ" as UC5  
usecase "Khôi phục phiên khi tải lại trang" as UC6  
usecase "Kiểm tra dữ liệu đầu vào" as UC7  
usecase "Băm mật khẩu (bcrypt)" as UC8  
usecase "Cấp JWT" as UC9  
usecase "Xác minh JWT" as UC10  
usecase "Xử lý token hết hạn" as UC11  
}  
  
Customer --> UC1  
Customer --> UC2  
Customer --> UC3  
Customer --> UC4  
Customer --> UC5  
Customer --> UC6  
Staff --> UC2  
Staff --> UC3  
Staff --> UC5  
OrderModule --> UC10  
  
UC1 .> UC7 : <<include>>  
UC1 .> UC8 : <<include>>  
UC2 .> UC8 : <<include>>  
UC2 .> UC9 : <<include>>  
UC4 .> UC10 : <<include>>  
UC5 .> UC10 : <<include>>  
UC6 .> UC10 : <<include>>  
UC11 .> UC5 : <<extend>>  
@enduml

### Bảng ánh xạ use-case và yêu cầu

| Use-case | Actor | Yêu cầu liên quan |
| --- | --- | --- |
| Đăng ký | Khách hàng | FR-01, FR-02, FR-04 |
| Đăng nhập | Khách hàng, Nhân viên quầy | FR-03, FR-04, FR-05 |
| Đăng xuất | Khách hàng, Nhân viên quầy | FR-11 |
| Xem thông tin cá nhân | Khách hàng | FR-07 |
| Truy cập trang / API được bảo vệ | Khách hàng, Nhân viên quầy | FR-06, FR-08, FR-09 |
| Khôi phục phiên khi tải lại trang | Khách hàng | FR-08, FR-09 |
| Xử lý token hết hạn | Khách hàng | FR-10 |
| Xác minh JWT | Module đặt hàng / thanh toán | FR-06 |

## 7\. Kết luận

SRS này tập trung vào các yêu cầu cốt lõi của module xác thực BrewLite: đăng ký, đăng nhập, băm mật khẩu bằng bcrypt, cấp và xác minh JWT, quản lý trạng thái đăng nhập. Mục tiêu là đảm bảo module có thể kiểm thử, triển khai và làm nền tảng cho các module đặt hàng, thanh toán trong giai đoạn MVP mà không mở rộng phạm vi quá xa.