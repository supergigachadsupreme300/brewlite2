# Bối cảnh, stakeholder và phạm vi - Chi tiết sản phẩm

## Vấn đề nghiệp vụ
Khách hàng cần xem đầy đủ thông tin chi tiết của một món trong thực đơn trước khi quyết định thêm vào giỏ hàng, bao gồm tên món, hình ảnh, mô tả chi tiết, đơn giá, số lượng tồn kho và các tùy chọn đi kèm.

## Stakeholder
- Khách hàng
- Nhân viên quầy
- Quản lý cửa hàng
- Nhóm phát triển

## Trong phạm vi MVP
- Xem chi tiết sản phẩm theo mã sản phẩm
- Hiển thị tên món, hình ảnh, mô tả chi tiết, đơn giá, số lượng tồn kho và tùy chọn đi kèm nếu có
- Hiển thị trạng thái còn hàng/hết hàng dựa trên `stock`
- Xử lý trường hợp `id` không tồn tại hoặc không hợp lệ với mã lỗi `HTTP 404 Not Found`

## Ngoài phạm vi
- Đánh giá và bình luận sản phẩm
- Gợi ý sản phẩm liên quan
- Quản lý công thức nguyên liệu thô

## Giả định và ràng buộc
- Dữ liệu sản phẩm được cung cấp từ API `GET /products/:id`
- Giao diện mobile-first
- Không yêu cầu đăng nhập để xem chi tiết sản phẩm
- Đơn giá sử dụng đơn vị VND và tồn kho là số nguyên không âm