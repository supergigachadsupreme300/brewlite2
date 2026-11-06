# Kế hoạch triển khai BrewLite

## Mục tiêu

Tài liệu này mô tả phương án triển khai mục tiêu của BrewLite trên AWS EC2. Đây là kế hoạch thiết kế và chuẩn bị triển khai, không phải hiện trạng đã được deploy thực tế trên môi trường AWS.

## Trạng thái triển khai

- Chưa có tài nguyên AWS được provision thực tế trong bài tập này.
- Không có private key, credential, secret hay file `.env` production nào được commit lên repository.
- Mọi thông tin về EC2, ECR, EBS, SSH và CloudWatch được hiểu là kế hoạch triển khai dự kiến.

## Kiến trúc mục tiêu

- Amazon EC2 Linux làm máy chủ ứng dụng
- SSH key pair để quản trị an toàn
- Docker và Docker Compose để chạy stack ứng dụng
- Amazon ECR để lưu trữ image
- Amazon EBS để lưu dữ liệu PostgreSQL bền vững
- Nginx làm reverse proxy
- CloudWatch Agent / CloudWatch Logs để thu thập log khi cần

## 1. Tạo EC2 instance

1. Mở AWS Console và vào EC2.
2. Chọn AMI Amazon Linux 2023 hoặc Ubuntu LTS.
3. Chọn instance type phù hợp với quy mô ứng dụng dự kiến.
4. Thiết lập VPC và subnet phù hợp với môi trường chạy.
5. Tạo instance và chờ trạng thái running.

## 2. Tạo hoặc chọn SSH Key Pair

1. Vào EC2 > Network & Security > Key Pairs.
2. Tạo key pair mới hoặc dùng key pair hiện có.
3. Tải file `.pem` xuống thiết bị local.
4. Giới hạn quyền truy cập file local.

```bash
chmod 400 my-brewlite-key.pem
```

5. Lưu private key ở nơi an toàn, không commit vào Git.

## 3. Cấu hình Security Group

Bật các port cần thiết cho môi trường triển khai mục tiêu:

- `22/tcp`: chỉ cho phép IP quản trị
- `80/tcp`: cho HTTP
- `443/tcp`: cho HTTPS

## 4. Kết nối SSH

```bash
ssh -i my-brewlite-key.pem ec2-user@<EC2_PUBLIC_IP>
```

Nếu dùng Ubuntu, user có thể là `ubuntu` thay vì `ec2-user`.

## 5. Cài Docker và Docker Compose

```bash
sudo yum update -y
sudo yum install -y docker
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ec2-user
```

Compose v2:

```bash
sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

Kiểm tra:

```bash
docker --version
docker compose version
```

## 6. Xác thực vào Amazon ECR

```bash
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws-account-id>.dkr.ecr.<region>.amazonaws.com
```

Pull image:

```bash
docker pull <aws-account-id>.dkr.ecr.<region>.amazonaws.com/brewlite:latest
```

## 7. Chạy Docker Compose

```bash
docker compose up -d
```

Dự kiến sẽ chạy:

- `web` cho frontend
- `api` cho backend
- `db` cho PostgreSQL

## 8. Kiểm tra health

```bash
curl http://localhost:3000
curl http://localhost:3001/health
```

## 9. Backup và rollback

- Sử dụng EBS snapshot hoặc backup database cho PostgreSQL.
- Lưu cấu hình ứng dụng cố định trong Git / version control.
- Giữ file `.env` hoặc secret trong nơi bảo mật riêng.
- Quy trình rollback có thể quay về image hoặc config được đánh dấu là ổn định trước đó.

## 10. Ghi chú bảo mật

- Không commit private key `.pem`.
- Không lưu AWS access key, secret hay password thực tế vào repo.
- Hạn chế SSH chỉ cho IP quản trị được phép.
- Mã hóa EBS và tách quyền truy cập theo nguyên tắc an ninh tối thiểu.

## Kết luận

Tài liệu này mô tả kiến trúc và phương án triển khai mục tiêu cho BrewLite. Hiện tại dự án chưa deploy thật lên AWS và chưa tạo resource production, vì vậy các bước trên nên được xem như kế hoạch chuẩn bị triển khai, không phải trạng thái hiện hữu của hệ thống.
