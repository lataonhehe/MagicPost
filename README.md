# MagicPost

Link Youtube: https://youtu.be/cPRyM-0XzmQ
https://itest.com.vn/lects/webappdev/mockproj/magic-post.htm

## Frontend

Lưu ý: đảm bải rằng bạn đã cài đặt <code><a href="https://nodejs.org/en/download/">nodejs</a></code>

Để xem trước và chạy trên máy cá nhân của bạn

1. Mở thư mục của project trong <a href="https://code.visualstudio.com/download">Visual Studio Code</a>
2. Ở trong terminal, chạy câu lệnh npm install
3. Chạy câu lệnh npm start để quan sát project trên browser

## Chạy Server

### 1. Tạo Môi Trường Ảo

Trước tiên, bạn cần tạo môi trường ảo để cách lý các thư viện và phụ thuộc của dự án.

python -m venv venv

### 2. Kích hoạt môi trường ảo

- Trên windows

.\venv\Scripts\activate

- Trên MacOS/Linux

source venv/bin/activate

### 3. Cài đặt thư viện

Sử dụng pip để cài đặt các thư viện cần thiết từ file requirements.txt.

pip install -r requirements.txt

### 4. Chạy server

Đầu tiên, ta cần chuyển địa chỉ sang folder backend, sau đó chạy server.

cd Backend
python manage.py runserver

Server sẽ chạy ở địa chỉ mặc định http://127.0.0.1:8000/. Truy cập đường dẫn này trong trình duyệt để kiểm tra ứng dụng của bạn.

## Phân chia công việc

- Nguyễn Minh Tuấn - 21020395: Backend/Frontend - Login,Logout, Register(Backend). FetchData từ Backend sang Frontend, chia bảng Frontend.
- Hà Sơn Tùng - 21020398: Backend - Các chức năng còn lại của backend
- Lý Trường Thành - 21020790: Frontend - Các chức năng còn lại của frontend

# Superuser

username: admin
password: 123456
