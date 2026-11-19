# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
# BrewLite – Order History Module

## 1. Introduction

### 1.1. Purpose

Tài liệu này mô tả các yêu cầu chức năng và phi chức năng của phân hệ Order History trong hệ thống BrewLite.

Phân hệ Order History cho phép khách hàng xem danh sách các đơn hàng đã đặt, tìm kiếm đơn hàng theo mã, lọc đơn hàng theo trạng thái và xem thông tin chi tiết của từng đơn hàng.

Tài liệu được xây dựng nhằm xác định phạm vi, yêu cầu và tiêu chí chấp nhận của phân hệ, đồng thời đối chiếu với tình trạng triển khai hiện tại trong source code.

### 1.2. Scope

Phân hệ Order History bao gồm các chức năng:

- Hiển thị danh sách đơn hàng.
- Sắp xếp đơn hàng theo thời gian tạo mới nhất.
- Tìm kiếm đơn hàng theo mã đơn hàng.
- Lọc đơn hàng theo trạng thái.
- Xem thông tin chi tiết của một đơn hàng.
- Hiển thị các trạng thái loading, empty, error và no results.
- Hỗ trợ tải dữ liệu đơn hàng từ API và dữ liệu mock trong quá trình phát triển.

Các chức năng thanh toán, tạo đơn hàng, quản lý trạng thái đơn hàng và xác thực người dùng thuộc phạm vi của các phân hệ khác. Order History chỉ sử dụng dữ liệu do các thành phần liên quan cung cấp.

### 1.3. Definitions and Abbreviations

| Thuật ngữ | Ý nghĩa |
|---|---|
| Order History | Lịch sử đơn hàng |
| Order | Đơn hàng |
| API | Application Programming Interface |
| UI | User Interface |
| FR | Functional Requirement |
| NFR | Non-functional Requirement |
| MoSCoW | Phương pháp phân loại mức độ ưu tiên yêu cầu |
| Mock Data | Dữ liệu giả lập dùng trong quá trình phát triển và kiểm thử |

## 2. Overall Description

### 2.1. Product Perspective

Order History là một phân hệ thuộc hệ thống BrewLite, được xây dựng bằng Next.js và TypeScript ở frontend, kết nối với backend thông qua REST API.

Phân hệ sử dụng các API liên quan đến đơn hàng:

- `GET /orders`: Lấy danh sách đơn hàng.
- `GET /orders/:id`: Lấy thông tin chi tiết của một đơn hàng.

Trong quá trình phát triển, frontend còn hỗ trợ đọc dữ liệu đơn hàng từ `localStorage` thông qua khóa `brewlite_mock_orders`.

### 2.2. User Classes and Characteristics

**Customer (Khách hàng)**

- Có nhu cầu xem lại các đơn hàng đã đặt.
- Có thể tìm kiếm đơn hàng theo mã đơn hàng.
- Có thể lọc đơn hàng theo trạng thái.
- Có thể mở một đơn hàng để xem thông tin chi tiết.

### 2.3. Operating Environment

- Frontend: Next.js, React, TypeScript.
- Backend: NestJS.
- Database: Prisma ORM.
- Trình duyệt web có hỗ trợ các công nghệ frontend được sử dụng trong dự án.
- Dữ liệu được trao đổi giữa frontend và backend thông qua REST API.

### 2.4. Design and Implementation Constraints

- Phân hệ sử dụng các kiểu dữ liệu đơn hàng được định nghĩa trong module Order.
- Phân hệ không tự quản lý việc tạo đơn hàng hoặc cập nhật trạng thái đơn hàng.
- Việc hiển thị thông tin chi tiết phụ thuộc vào dữ liệu API trả về.
- Dữ liệu mock được sử dụng như nguồn dữ liệu hỗ trợ trong quá trình phát triển.
- Các thay đổi đối với backend hoặc module Order nằm ngoài phạm vi chỉnh sửa trực tiếp của phân hệ Order History.

## 3. Functional Requirements

### 3.1. FR-OH-01 – View Order History

**Priority:** Must

**Status:** Implemented

**Description:**

Hệ thống phải cho phép khách hàng xem danh sách các đơn hàng đã được tạo.

Mỗi đơn hàng trong danh sách phải hiển thị các thông tin cơ bản:

- Mã đơn hàng.
- Ngày và thời gian tạo đơn.
- Trạng thái đơn hàng.
- Tổng số lượng sản phẩm trong đơn hàng.
- Tổng tiền đơn hàng.

Danh sách đơn hàng được hiển thị thông qua route `/orders`.

Nếu không có đơn hàng nào, hệ thống phải hiển thị thông báo phù hợp và cung cấp điều hướng để khách hàng có thể tiếp tục mua hàng.

**Implementation Notes:**

- Trang `/orders` sử dụng component `OrderHistoryList`.
- Dữ liệu được lấy thông qua `orderHistoryApi`.
- Danh sách có thể kết hợp dữ liệu từ API và dữ liệu mock trong `localStorage`.
- Backend hiện chưa giới hạn danh sách theo người dùng đăng nhập. Vì vậy, yêu cầu về việc mỗi khách hàng chỉ nhìn thấy đơn hàng của chính mình chưa được bảo đảm.

### 3.2. FR-OH-02 – Sort Orders by Creation Date

**Priority:** Must

**Status:** Implemented

**Description:**

Hệ thống phải sắp xếp danh sách đơn hàng theo thời gian tạo, trong đó đơn hàng mới nhất được hiển thị trước.

Việc sắp xếp phải được áp dụng cho danh sách đơn hàng sau khi dữ liệu được tải từ các nguồn dữ liệu hiện có.

**Acceptance Criteria:**

- Các đơn hàng được sắp xếp theo thời gian tạo giảm dần.
- Đơn hàng có thời gian tạo mới hơn phải xuất hiện trước đơn hàng cũ hơn.
- Việc sắp xếp được áp dụng đối với dữ liệu được trả về từ API và dữ liệu mock.

### 3.3. FR-OH-03 – Search Orders by Order ID

**Priority:** Should

**Status:** Implemented

**Description:**

Hệ thống phải cho phép khách hàng tìm kiếm đơn hàng bằng cách nhập mã đơn hàng vào ô tìm kiếm.

Kết quả tìm kiếm phải được cập nhật dựa trên từ khóa mà khách hàng nhập.

Quy tắc tìm kiếm:

- Tìm kiếm dựa trên mã đơn hàng.
- Không phân biệt chữ hoa và chữ thường.
- Hỗ trợ tìm kiếm một phần mã đơn hàng.
- Loại bỏ khoảng trắng ở đầu và cuối từ khóa tìm kiếm.

Nếu không tìm thấy đơn hàng phù hợp, hệ thống phải hiển thị thông báo không có kết quả và cung cấp chức năng xóa bộ lọc tìm kiếm.

**Acceptance Criteria:**

- Khách hàng có thể nhập mã đơn hàng vào ô tìm kiếm.
- Hệ thống trả về các đơn hàng có mã phù hợp với từ khóa.
- Từ khóa tìm kiếm không phân biệt chữ hoa và chữ thường.
- Hệ thống hiển thị trạng thái không có kết quả nếu không tìm thấy đơn hàng phù hợp.

### 3.4. FR-OH-04 – Filter Orders by Status

**Priority:** Should

**Status:** Implemented

**Description:**

Hệ thống phải cho phép khách hàng lọc danh sách đơn hàng theo trạng thái.

Các trạng thái đơn hàng được hỗ trợ:

- PENDING
- PAID
- PREPARING
- READY
- COMPLETED
- PAYMENT_FAILED
- CANCELLED

Khách hàng có thể chọn một trạng thái cụ thể hoặc chọn ALL để hiển thị tất cả đơn hàng.

Khi sử dụng đồng thời chức năng tìm kiếm và lọc trạng thái, hệ thống phải hiển thị những đơn hàng đáp ứng cả hai điều kiện.

**Acceptance Criteria:**

- Khách hàng có thể chọn trạng thái muốn lọc.
- Hệ thống chỉ hiển thị đơn hàng có trạng thái phù hợp.
- Khi chọn ALL, hệ thống hiển thị tất cả đơn hàng.
- Tìm kiếm và lọc trạng thái có thể được sử dụng đồng thời.
- Nếu không có đơn hàng phù hợp, hệ thống hiển thị thông báo tương ứng.

### 3.5. FR-OH-05 – View Order Details

**Priority:** Must

**Status:** Partially Implemented

**Description:**

Hệ thống phải cho phép khách hàng xem thông tin chi tiết của một đơn hàng bằng cách truy cập route `/orders/[id]`.

Thông tin chi tiết bao gồm:

**Thông tin đơn hàng:**

- Mã đơn hàng.
- Ngày và thời gian tạo.
- Trạng thái hiện tại.
- Tổng tiền đơn hàng.

**Thông tin nhận hàng (nếu dữ liệu được cung cấp):**

- Tên người nhận.
- Số điện thoại người nhận.
- Hình thức nhận hàng.
- Số bàn (đối với hình thức dùng tại bàn, nếu có).
- Ghi chú đơn hàng (nếu có).

**Thông tin sản phẩm:**

- Tên sản phẩm.
- Hình ảnh sản phẩm nếu có.
- Kích thước sản phẩm nếu có.
- Đơn giá.
- Số lượng.
- Thành tiền của từng sản phẩm.

**Thông tin tổng kết đơn hàng:**

- Tổng tiền sản phẩm.
- Tổng tiền đơn hàng.

**Acceptance Criteria:**

- Khách hàng có thể truy cập trang chi tiết thông qua mã đơn hàng.
- Hệ thống hiển thị thông tin cơ bản của đơn hàng.
- Hệ thống hiển thị danh sách sản phẩm thuộc đơn hàng.
- Mỗi sản phẩm hiển thị tên, đơn giá, số lượng và thành tiền.
- Hình ảnh và kích thước sản phẩm được hiển thị khi có dữ liệu.
- Hệ thống hiển thị thông tin nhận hàng nếu dữ liệu tương ứng được cung cấp.
- Nếu không tìm thấy đơn hàng, hệ thống hiển thị thông báo lỗi phù hợp.
- Khách hàng có thể quay lại trang danh sách đơn hàng.

**Implementation Notes:**

Chức năng xem chi tiết và hiển thị thông tin sản phẩm đã được triển khai.

Tuy nhiên, thông tin `customerInfo` chưa được backend lưu đầy đủ khi tạo đơn hàng. Vì vậy, thông tin người nhận, hình thức nhận hàng, số bàn và ghi chú có thể không có trong dữ liệu trả về.

Ngoài ra, backend hiện chưa kiểm tra quyền sở hữu đơn hàng khi truy cập chi tiết theo ID. Việc bảo đảm khách hàng chỉ xem được đơn hàng của mình vẫn là yêu cầu cần hoàn thiện ở backend.

### 3.6. FR-OH-06 – Continue Payment from Order Details

**Priority:** Should

**Status:** Not Implemented

**Description:**

Hệ thống cần hỗ trợ khách hàng tiếp tục thực hiện thanh toán đối với những đơn hàng chưa thanh toán hoặc có trạng thái thanh toán thất bại, nếu quy trình thanh toán của hệ thống cho phép.

Chức năng này dự kiến cung cấp một thao tác điều hướng từ trang chi tiết đơn hàng đến quy trình thanh toán tương ứng.

Chức năng cần tuân theo trạng thái đơn hàng và quy trình thanh toán do module Order và Payment quản lý.

**Acceptance Criteria (Target):**

- Hệ thống chỉ hiển thị thao tác tiếp tục thanh toán đối với các đơn hàng phù hợp với quy tắc thanh toán.
- Khách hàng có thể chuyển đến quy trình thanh toán khi chọn thao tác tương ứng.
- Đơn hàng đã thanh toán thành công không được cung cấp thao tác thanh toán lại nếu quy trình hệ thống không cho phép.

**Implementation Notes:**

Chức năng này chưa được triển khai trong Order History.

Trang chi tiết đơn hàng hiện chưa có nút hoặc liên kết điều hướng đến thanh toán. Route `/payment` hiện chỉ là trang placeholder, do đó chưa thể xác nhận quy trình thanh toán hoạt động hoàn chỉnh.

### 3.7. FR-OH-07 – Handle Loading, Empty, Error and No-Result States

**Priority:** Must

**Status:** Implemented

**Description:**

Hệ thống phải cung cấp các trạng thái giao diện phù hợp trong quá trình tải và hiển thị dữ liệu lịch sử đơn hàng.

Các trạng thái bao gồm:

**Loading State:**

- Hiển thị khi hệ thống đang tải dữ liệu đơn hàng hoặc chi tiết đơn hàng.

**Empty State:**

- Hiển thị khi không có đơn hàng nào trong danh sách.
- Cung cấp điều hướng để khách hàng tiếp tục mua hàng.

**No-Result State:**

- Hiển thị khi danh sách có dữ liệu nhưng không có đơn hàng phù hợp với điều kiện tìm kiếm hoặc lọc.

**Error State:**

- Hiển thị khi hệ thống không thể tải dữ liệu và không có dữ liệu mock phù hợp để sử dụng.
- Cung cấp thao tác thử tải lại dữ liệu.

**Acceptance Criteria:**

- Hệ thống hiển thị loading state trong quá trình tải dữ liệu.
- Hệ thống hiển thị empty state khi danh sách đơn hàng rỗng.
- Hệ thống hiển thị no-result state khi không có kết quả phù hợp với điều kiện tìm kiếm hoặc lọc.
- Hệ thống hiển thị error state khi tải dữ liệu thất bại và không thể sử dụng dữ liệu dự phòng.
- Khách hàng có thể chọn thao tác thử lại khi xảy ra lỗi tải dữ liệu.

### 3.8. FR-OH-08 – Support API and Local Mock Data

**Priority:** Should

**Status:** Implemented

**Description:**

Trong quá trình phát triển, hệ thống phải hỗ trợ sử dụng dữ liệu đơn hàng từ API và dữ liệu mock được lưu trong `localStorage`.

Đối với danh sách đơn hàng:

- Hệ thống gọi API `GET /orders`.
- Hệ thống đọc dữ liệu mock từ khóa `brewlite_mock_orders`.
- Khi API trả về dữ liệu thành công, hệ thống kết hợp dữ liệu API và dữ liệu mock.
- Nếu hai nguồn có đơn hàng trùng mã, dữ liệu từ API được ưu tiên.
- Danh sách sau khi kết hợp được sắp xếp theo thời gian tạo mới nhất.
- Nếu API gặp lỗi, hệ thống sử dụng dữ liệu mock nếu có.
- Nếu API gặp lỗi và không có dữ liệu mock, hệ thống trả về lỗi để giao diện xử lý.

Đối với chi tiết đơn hàng:

- Hệ thống gọi API `GET /orders/:id`.
- Nếu API gặp lỗi, hệ thống tìm đơn hàng tương ứng trong dữ liệu mock.
- Nếu không tìm thấy đơn hàng trong dữ liệu mock, hệ thống trả về lỗi không tìm thấy đơn hàng.

**Acceptance Criteria:**

- Hệ thống có thể tải danh sách đơn hàng từ API.
- Hệ thống có thể đọc dữ liệu mock từ `localStorage`.
- Khi API trả về thành công, dữ liệu API được ưu tiên khi trùng mã đơn hàng.
- Khi API gặp lỗi, dữ liệu mock được sử dụng nếu có.
- Khi không có dữ liệu từ cả hai nguồn, hệ thống xử lý lỗi phù hợp.
- Chi tiết đơn hàng có thể được tìm trong dữ liệu mock khi API không truy xuất được.

**Implementation Notes:**

Đây là cơ chế hỗ trợ phát triển và kiểm thử. Việc sử dụng dữ liệu mock không thay thế yêu cầu về dữ liệu thật và phân quyền người dùng trong môi trường triển khai chính thức.

## 4. Non-Functional Requirements

### 4.1. NFR-OH-01 – Security

**Priority:** Must

**Status:** Not Implemented / Backend Dependency

**Description:**

Hệ thống phải bảo đảm khách hàng chỉ có thể truy cập danh sách và thông tin chi tiết của những đơn hàng thuộc quyền sở hữu của mình.

Các yêu cầu bảo mật bao gồm:

- API lấy danh sách đơn hàng phải giới hạn dữ liệu theo người dùng đã xác thực.
- API lấy chi tiết đơn hàng phải kiểm tra quyền sở hữu trước khi trả về dữ liệu.
- Không cho phép khách hàng truy cập thông tin đơn hàng của người dùng khác chỉ bằng cách thay đổi mã đơn hàng trên URL.

**Implementation Notes:**

Trong code backend hiện tại:

- `GET /orders` chưa truyền thông tin người dùng để lọc danh sách đơn hàng.
- `GET /orders/:id` chưa thực hiện kiểm tra quyền sở hữu đơn hàng.
- Chưa thấy cơ chế guard xác thực và phân quyền được áp dụng tại controller đơn hàng.

Do đó, yêu cầu bảo mật này chưa được đáp ứng đầy đủ và cần được xử lý ở backend.

### 4.2. NFR-OH-02 – Usability

**Priority:** Must

**Status:** Partially Implemented

**Description:**

Giao diện Order History phải dễ sử dụng và giúp khách hàng dễ dàng tìm kiếm, lọc và xem thông tin đơn hàng.

Các yêu cầu bao gồm:

- Các thông tin đơn hàng phải được trình bày rõ ràng.
- Các thao tác tìm kiếm và lọc phải dễ nhận biết.
- Các trạng thái loading, empty, error và no-result phải có thông báo phù hợp.
- Khách hàng phải có thể quay lại danh sách đơn hàng từ trang chi tiết.
- Giao diện cần cung cấp hướng xử lý khi không có đơn hàng hoặc xảy ra lỗi.

**Implementation Notes:**

Các thành phần giao diện và trạng thái xử lý chính đã được triển khai. Tuy nhiên, khả năng sử dụng tổng thể trên các thiết bị và kích thước màn hình khác nhau chưa được xác minh bằng kiểm thử thực tế.

### 4.3. NFR-OH-03 – Reliability

**Priority:** Must

**Status:** Partially Implemented

**Description:**

Hệ thống phải xử lý phù hợp các tình huống dữ liệu không tải được hoặc API gặp lỗi.

Các yêu cầu bao gồm:

- Không làm gián đoạn toàn bộ giao diện khi xảy ra lỗi tải dữ liệu.
- Hiển thị thông báo phù hợp khi không thể tải dữ liệu.
- Cho phép khách hàng thử tải lại dữ liệu.
- Hỗ trợ dữ liệu mock làm nguồn dự phòng trong quá trình phát triển.
- Không hiển thị dữ liệu không tìm thấy như thể đó là một đơn hàng hợp lệ.

**Implementation Notes:**

Frontend đã có xử lý lỗi, retry và fallback sang dữ liệu mock. Tuy nhiên, độ tin cậy của hệ thống khi vận hành thực tế còn phụ thuộc vào backend, database và cơ chế xác thực.

### 4.4. NFR-OH-04 – Performance

**Priority:** Should

**Status:** Not Verified

**Description:**

Hệ thống cần tải và hiển thị danh sách đơn hàng, thông tin chi tiết trong thời gian hợp lý.

Các yêu cầu bao gồm:

- Không thực hiện các thao tác xử lý dữ liệu không cần thiết.
- Không làm giao diện bị treo trong quá trình tải dữ liệu.
- Cung cấp trạng thái loading để thông báo cho khách hàng khi hệ thống đang xử lý yêu cầu.

**Implementation Notes:**

Code hiện có xử lý trạng thái tải dữ liệu. Tuy nhiên, chưa có kết quả kiểm thử hiệu năng hoặc số liệu thời gian phản hồi để xác nhận hệ thống đáp ứng các mục tiêu hiệu năng cụ thể.

### 4.5. NFR-OH-05 – Maintainability

**Priority:** Should

**Status:** Implemented at Code Structure Level

**Description:**

Phân hệ cần được tổ chức thành các thành phần riêng biệt để thuận tiện cho việc bảo trì và mở rộng.

Các yêu cầu bao gồm:

- Tách biệt giao diện, hooks, services và types.
- Tái sử dụng các kiểu dữ liệu được định nghĩa trong dự án.
- Hạn chế việc đặt toàn bộ logic xử lý trong một component.
- Đặt tên file và component nhất quán với cấu trúc dự án.

**Implementation Notes:**

Phân hệ hiện đã được chia thành các thư mục `components`, `hooks`, `services` và `types`. Đây là đánh giá dựa trên cấu trúc source code, không phải kết quả kiểm thử chất lượng bảo trì dài hạn.

## 5. MoSCoW Priorities

Các yêu cầu được phân loại theo mức độ ưu tiên như sau:

| Requirement ID | Requirement | Priority |
|---|---|---|
| FR-OH-01 | View Order History | Must |
| FR-OH-02 | Sort Orders by Creation Date | Must |
| FR-OH-03 | Search Orders by Order ID | Should |
| FR-OH-04 | Filter Orders by Status | Should |
| FR-OH-05 | View Order Details | Must |
| FR-OH-06 | Continue Payment from Order Details | Should |
| FR-OH-07 | Handle Loading, Empty, Error and No-Result States | Must |
| FR-OH-08 | Support API and Local Mock Data | Should |
| NFR-OH-01 | Security | Must |
| NFR-OH-02 | Usability | Must |
| NFR-OH-03 | Reliability | Must |
| NFR-OH-04 | Performance | Should |
| NFR-OH-05 | Maintainability | Should |

**MoSCoW Definitions:**

- **Must:** Yêu cầu bắt buộc, cần có để phân hệ đáp ứng các chức năng cốt lõi.
- **Should:** Yêu cầu quan trọng nhưng có thể được ưu tiên triển khai sau các chức năng Must.
- **Could:** Yêu cầu có thể bổ sung nếu còn thời gian và nguồn lực.
- **Won't:** Yêu cầu không nằm trong phạm vi triển khai của phiên bản hiện tại.

## 6. Acceptance Criteria

Các tiêu chí chấp nhận dưới đây được dùng để đánh giá khả năng đáp ứng yêu cầu của phân hệ Order History.

| Requirement ID | Acceptance Criteria | Current Implementation |
|---|---|---|
| FR-OH-01 | Hiển thị danh sách đơn hàng với thông tin cơ bản | Implemented |
| FR-OH-02 | Đơn hàng mới nhất xuất hiện trước | Implemented |
| FR-OH-03 | Tìm kiếm theo mã đơn hàng, không phân biệt hoa thường | Implemented |
| FR-OH-04 | Lọc theo trạng thái và kết hợp với tìm kiếm | Implemented |
| FR-OH-05 | Xem chi tiết đơn hàng và danh sách sản phẩm | Partially Implemented |
| FR-OH-06 | Điều hướng đến quy trình thanh toán phù hợp | Not Implemented |
| FR-OH-07 | Hiển thị loading, empty, error, no-result và retry | Implemented |
| FR-OH-08 | Kết hợp API và dữ liệu mock theo quy tắc đã mô tả | Implemented |
| NFR-OH-01 | Chỉ cho phép truy cập đơn hàng thuộc quyền sở hữu của khách hàng | Not Implemented |
| NFR-OH-02 | Giao diện rõ ràng, dễ thao tác và có thông báo phù hợp | Partially Implemented |
| NFR-OH-03 | Xử lý lỗi tải dữ liệu và hỗ trợ thử lại | Partially Implemented |
| NFR-OH-04 | Đáp ứng mục tiêu hiệu năng đã xác định qua kiểm thử | Not Verified |
| NFR-OH-05 | Cấu trúc code tách biệt và thuận tiện bảo trì | Implemented at Code Structure Level |

**Lưu ý:** Bảng trên phản ánh tình trạng code tại thời điểm kiểm tra. Những yêu cầu được đánh dấu Not Implemented hoặc Not Verified vẫn là yêu cầu mục tiêu của hệ thống, không có nghĩa là chúng bị loại bỏ khỏi SRS.

## 7. Requirement Traceability

Bảng sau liên kết các yêu cầu với các thành phần source code tương ứng.

| Requirement ID | Related Source Files |
|---|---|
| FR-OH-01 | `frontend/src/app/orders/page.tsx`; `features/order-history/components/OrderHistoryList.tsx`; `features/order-history/hooks/useOrderHistory.ts` |
| FR-OH-02 | `features/order-history/services/orderHistoryApi.ts` |
| FR-OH-03 | `features/order-history/components/OrderHistoryFilters.tsx`; `features/order-history/hooks/useOrderHistory.ts` |
| FR-OH-04 | `features/order-history/components/OrderHistoryFilters.tsx`; `features/order-history/hooks/useOrderHistory.ts` |
| FR-OH-05 | `frontend/src/app/orders/[id]/page.tsx`; `features/order-history/components/OrderHistoryDetailPageContent.tsx`; `features/order-history/components/OrderHistoryDetail.tsx`; `features/order-history/hooks/useOrderHistoryDetail.ts` |
| FR-OH-06 | Chưa có thành phần điều hướng thanh toán trong Order History |
| FR-OH-07 | `features/order-history/components/OrderHistoryList.tsx`; `features/order-history/components/OrderHistoryDetailState.tsx`; `features/order-history/hooks/useOrderHistory.ts`; `features/order-history/hooks/useOrderHistoryDetail.ts` |
| FR-OH-08 | `features/order-history/services/orderHistoryApi.ts` |
| NFR-OH-01 | Backend: `backend/src/modules/orders/orders.controller.ts`; `backend/src/modules/orders/orders.service.ts` |
| NFR-OH-05 | Toàn bộ cấu trúc `frontend/src/features/order-history/` |

## 8. Dependencies and Limitations

### 8.1. Dependencies

Phân hệ Order History phụ thuộc vào các thành phần khác của hệ thống:

**Order Module:**

- Cung cấp cấu trúc dữ liệu đơn hàng.
- Cung cấp API lấy danh sách đơn hàng và chi tiết đơn hàng.
- Quản lý trạng thái đơn hàng.

**Backend and Database:**

- Cung cấp dữ liệu đơn hàng thông qua REST API.
- Lưu trữ và truy xuất thông tin đơn hàng.
- Cần bổ sung cơ chế xác thực và kiểm tra quyền sở hữu đơn hàng.

**Payment Module:**

- Cung cấp quy trình thanh toán.
- Xác định những trạng thái đơn hàng được phép tiếp tục thanh toán.
- Hỗ trợ chức năng thanh toán lại nếu hệ thống có yêu cầu.

### 8.2. Known Limitations

Các giới hạn được xác định từ source code hiện tại:

1. **User-specific order access:** Backend chưa giới hạn danh sách đơn hàng theo người dùng và chưa kiểm tra quyền sở hữu khi truy cập chi tiết đơn hàng.

2. **Customer information persistence:** `CreateOrderDto` có nhận `customerInfo`, nhưng `OrdersService.create()` hiện chưa lưu thông tin này vào database. Vì vậy, thông tin nhận hàng có thể không được trả về đầy đủ khi xem chi tiết đơn hàng.

3. **Payment information:** `CreateOrderDto` có nhận `paymentMethod`, nhưng service tạo đơn hàng hiện chưa lưu trường này trong quá trình tạo đơn. Phân hệ Order History hiện cũng chưa hiển thị phương thức thanh toán.

4. **Payment navigation:** Trang chi tiết đơn hàng chưa có thao tác điều hướng để tiếp tục thanh toán. Trang `/payment` hiện chỉ là placeholder.

5. **Mock data dependency:** Dữ liệu mock được sử dụng để hỗ trợ phát triển khi API gặp lỗi. Đây không phải giải pháp thay thế cho việc lưu trữ và truy xuất dữ liệu chính thức.

6. **Performance verification:** Chưa có kết quả kiểm thử hiệu năng để xác nhận thời gian phản hồi của các API và giao diện.

### 8.3. Assumptions

- Backend cung cấp dữ liệu đơn hàng theo cấu trúc mà frontend đang sử dụng.
- Trạng thái đơn hàng được quản lý bởi module Order.
- Dữ liệu mock chỉ phục vụ quá trình phát triển và kiểm thử.
- Việc xác thực và phân quyền người dùng được hoàn thiện ở phạm vi backend hoặc module liên quan.
- Quy trình thanh toán được quản lý bởi module Payment, không thuộc trách nhiệm trực tiếp của Order History.

---

**End of Document**