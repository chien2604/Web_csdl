# Hệ thống Quản lý Chuỗi Cửa hàng Thời trang

## Mô tả
Hệ thống quản lý chuỗi cửa hàng thời trang với các tính năng:
- Quản lý khách hàng
- Quản lý cửa hàng
- Quản lý sản phẩm
- Quản lý nhân viên
- Dashboard phân tích dữ liệu
- Tích hợp Power BI

## Công nghệ sử dụng
- **Frontend**: React.js, Material-UI
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Analytics**: Power BI

## Cài đặt

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình Database
- Tạo database MySQL tên `btlshop`
- Import các file CSV từ thư mục `database_csv/` vào database
- Cập nhật thông tin kết nối trong `server.js`:
  ```javascript
  const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'admin', // Thay đổi username
    password: 'admin123', // Thay đổi password
    database: 'btlshop',
  });
  ```

### 3. Chạy ứng dụng

#### Chạy cả Frontend và Backend cùng lúc:
```bash
npm run dev
```

#### Hoặc chạy riêng lẻ:

**Backend (Server):**
```bash
npm run server
```

**Frontend (React):**
```bash
npm start
```

## Cấu trúc dự án

```
├── src/
│   ├── components/
│   │   ├── Dashboard.js      # Trang tổng quan
│   │   ├── Customers.js      # Quản lý khách hàng
│   │   ├── Stores.js         # Quản lý cửa hàng
│   │   ├── Products.js       # Quản lý sản phẩm
│   │   ├── Employees.js      # Quản lý nhân viên
│   │   ├── Analytics.js      # Phân tích dữ liệu
│   │   └── Layout.js         # Layout chung
│   ├── App.js               # Component chính
│   └── index.js             # Entry point
├── database_csv/            # Dữ liệu CSV
├── server.js               # Backend API
├── package.json
└── README.md
```

## API Endpoints

### Khách hàng
- `GET /api/customers` - Lấy danh sách khách hàng
- `POST /api/customers` - Thêm khách hàng mới
- `PUT /api/customers/:id` - Cập nhật khách hàng
- `DELETE /api/customers/:id` - Xóa khách hàng

### Cửa hàng
- `GET /api/stores` - Lấy danh sách cửa hàng
- `POST /api/stores` - Thêm cửa hàng mới
- `PUT /api/stores/:id` - Cập nhật cửa hàng
- `DELETE /api/stores/:id` - Xóa cửa hàng

### Sản phẩm
- `GET /api/products` - Lấy danh sách sản phẩm
- `POST /api/products` - Thêm sản phẩm mới
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm

### Nhân viên
- `GET /api/employees` - Lấy danh sách nhân viên
- `POST /api/employees` - Thêm nhân viên mới
- `PUT /api/employees/:id` - Cập nhật nhân viên
- `DELETE /api/employees/:id` - Xóa nhân viên

### Thống kê
- `GET /api/summary` - Lấy thống kê tổng quan

## Tính năng

### Dashboard
- Hiển thị thống kê tổng quan
- Tích hợp Power BI dashboard
- Chuyển đổi giữa chế độ sáng/tối

### Quản lý dữ liệu
- CRUD operations cho tất cả entities
- Tìm kiếm và lọc dữ liệu
- Validation dữ liệu
- Xử lý lỗi

### Analytics
- Tích hợp Power BI reports
- Phân tích dữ liệu theo thời gian thực
- Biểu đồ và báo cáo tương tác

## Lưu ý
- Đảm bảo MySQL server đang chạy
- Cập nhật thông tin kết nối database trong `server.js`
- Cài đặt Power BI để xem các dashboard phân tích

## Tác giả
Hệ thống được phát triển cho bài tập lớn môn Cơ sở dữ liệu. 