const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Cho phép kết nối từ client React
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json()); // Middleware để đọc JSON body

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'admin', // Đổi nếu bạn dùng user khác
  password: 'admin123', // Đổi nếu bạn có mật khẩu
  database: 'btlshop',
});

const handleDbError = (err, res, context) => {
  console.error(`${context} ERROR:`, err);
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).send('Lỗi: Dữ liệu bị trùng lặp (ví dụ: email hoặc số điện thoại đã tồn tại).');
  }
  res.status(500).send('Đã có lỗi xảy ra phía máy chủ.');
};

// === CUSTOMERS API ===
app.get('/api/customers', async (req, res) => {
  try {
    const { search, limit = 100 } = req.query;
    let query = 'SELECT * FROM KhachHang';
    const params = [];

    if (search) {
      query += ' WHERE TenKH LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY MaKH DESC LIMIT ?';
    params.push(parseInt(limit, 10));

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    handleDbError(err, res, 'CUSTOMERS GET');
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const { TenKH, Email, SDT } = req.body;
    const [result] = await pool.query('INSERT INTO KhachHang (TenKH, Email, SDT) VALUES (?, ?, ?)', [TenKH, Email, SDT]);
    res.status(201).json({ MaKH: result.insertId, TenKH, Email, SDT });
    io.emit('data-changed', { table: 'customers' });
  } catch (err) {
    handleDbError(err, res, 'CUSTOMER POST');
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { TenKH, Email, SDT } = req.body;
    await pool.query('UPDATE KhachHang SET TenKH = ?, Email = ?, SDT = ? WHERE MaKH = ?', [TenKH, Email, SDT, id]);
    res.sendStatus(200);
    io.emit('data-changed', { table: 'customers' });
  } catch (err) {
    handleDbError(err, res, 'CUSTOMER PUT');
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Cần kiểm tra ràng buộc khóa ngoại trước khi xóa
    await pool.query('DELETE FROM HoaDonBan WHERE MaKH = ?', [id]);
    await pool.query('DELETE FROM KhachHang WHERE MaKH = ?', [id]);
    res.sendStatus(204);
    io.emit('data-changed', { table: 'customers' });
  } catch (err) {
    handleDbError(err, res, 'CUSTOMER DELETE');
  }
});


// === STORES API ===
app.get('/api/stores', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM CuaHang');
    res.json(rows);
  } catch (err) {
    handleDbError(err, res, 'STORES GET');
  }
});

app.post('/api/stores', async (req, res) => {
  try {
    const { TenCH, DiaChi, SDT } = req.body;
    const [result] = await pool.query('INSERT INTO CuaHang (TenCH, DiaChi, SDT) VALUES (?, ?, ?)', [TenCH, DiaChi, SDT]);
    res.status(201).json({ MaCH: result.insertId, TenCH, DiaChi, SDT });
    io.emit('data-changed', { table: 'stores' });
  } catch (err) {
    handleDbError(err, res, 'STORES POST');
  }
});

app.put('/api/stores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { TenCH, DiaChi, SDT } = req.body;
    await pool.query('UPDATE CuaHang SET TenCH = ?, DiaChi = ?, SDT = ? WHERE MaCH = ?', [TenCH, DiaChi, SDT, id]);
    res.sendStatus(200);
    io.emit('data-changed', { table: 'stores' });
  } catch (err) {
    handleDbError(err, res, 'STORES PUT');
  }
});

app.delete('/api/stores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Cần kiểm tra ràng buộc khóa ngoại trước khi xóa
    await pool.query('DELETE FROM NhanVien WHERE MaCH = ?', [id]);
    await pool.query('DELETE FROM CuaHang WHERE MaCH = ?', [id]);
    res.sendStatus(204);
    io.emit('data-changed', { table: 'stores' });
  } catch (err) {
    handleDbError(err, res, 'STORES DELETE');
  }
});


app.get('/api/summary', async (req, res) => {
  try {
    const [customers] = await pool.query('SELECT COUNT(*) as total FROM KhachHang');
    const [stores] = await pool.query('SELECT COUNT(*) as total FROM CuaHang');
    const [products] = await pool.query('SELECT COUNT(*) as total FROM SanPham');
    const [employees] = await pool.query('SELECT COUNT(*) as total FROM NhanVien');
    const [revenue] = await pool.query("SELECT SUM(TongTienThu) as total FROM HoaDonBan WHERE MONTH(NgayBan) = MONTH(CURDATE())");
    // Tạm thời hardcode tăng trưởng, bạn có thể tính toán lại sau
    res.json({
      totalCustomers: customers[0].total,
      totalStores: stores[0].total,
      totalProducts: products[0].total,
      totalEmployees: employees[0].total,
      monthlyRevenue: revenue[0].total || 0,
      growth: 15
    });
  } catch (err) {
    console.error('SUMMARY ERROR:', err);
    res.status(500).send(err.message);
  }
});

// === PRODUCTS API ===
app.get('/api/products', async (req, res) => {
  try {
    const { search, limit = 100 } = req.query;
    let query = 'SELECT * FROM SanPham';
    const params = [];

    if (search) {
      query += ' WHERE TenSP LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY MaSP DESC LIMIT ?';
    params.push(parseInt(limit, 10));

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    handleDbError(err, res, 'PRODUCTS GET');
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { TenSP, GiaBan, MaLoai, MaNCC } = req.body;
    const [result] = await pool.query(
      'INSERT INTO SanPham (TenSP, GiaBan, MaLoai, MaNCC) VALUES (?, ?, ?, ?)', 
      [TenSP, GiaBan, MaLoai, MaNCC]
    );
    res.status(201).json({ MaSP: result.insertId, TenSP, GiaBan, MaLoai, MaNCC });
    io.emit('data-changed', { table: 'products' });
  } catch (err) {
    handleDbError(err, res, 'PRODUCT POST');
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { TenSP, GiaBan, MaLoai, MaNCC } = req.body;
    await pool.query(
      'UPDATE SanPham SET TenSP = ?, GiaBan = ?, MaLoai = ?, MaNCC = ? WHERE MaSP = ?', 
      [TenSP, GiaBan, MaLoai, MaNCC, id]
    );
    res.sendStatus(200);
    io.emit('data-changed', { table: 'products' });
  } catch (err) {
    handleDbError(err, res, 'PRODUCT PUT');
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Cần kiểm tra ràng buộc khóa ngoại trước khi xóa
    await pool.query('DELETE FROM ChiTietHoaDonBan WHERE MaSP = ?', [id]);
    await pool.query('DELETE FROM ChiTietHoaDonNhap WHERE MaSP = ?', [id]);
    await pool.query('DELETE FROM SanPham WHERE MaSP = ?', [id]);
    res.sendStatus(204);
    io.emit('data-changed', { table: 'products' });
  } catch (err) {
    handleDbError(err, res, 'PRODUCT DELETE');
  }
});

// === EMPLOYEES API ===
app.get('/api/employees', async (req, res) => {
  try {
    const { search, limit = 100 } = req.query;
    let query = 'SELECT * FROM NhanVien';
    const params = [];

    if (search) {
      query += ' WHERE TenNV LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY MaNV DESC LIMIT ?';
    params.push(parseInt(limit, 10));

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    handleDbError(err, res, 'EMPLOYEES GET');
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const { TenNV, Email, SDT, MaCH } = req.body;
    const [result] = await pool.query(
      'INSERT INTO NhanVien (TenNV, Email, SDT, MaCH) VALUES (?, ?, ?, ?)', 
      [TenNV, Email, SDT, MaCH]
    );
    res.status(201).json({ MaNV: result.insertId, TenNV, Email, SDT, MaCH });
    io.emit('data-changed', { table: 'employees' });
  } catch (err) {
    handleDbError(err, res, 'EMPLOYEE POST');
  }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { TenNV, Email, SDT, MaCH } = req.body;
    await pool.query(
      'UPDATE NhanVien SET TenNV = ?, Email = ?, SDT = ?, MaCH = ? WHERE MaNV = ?', 
      [TenNV, Email, SDT, MaCH, id]
    );
    res.sendStatus(200);
    io.emit('data-changed', { table: 'employees' });
  } catch (err) {
    handleDbError(err, res, 'EMPLOYEE PUT');
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM NhanVien WHERE MaNV = ?', [id]);
    res.sendStatus(204);
    io.emit('data-changed', { table: 'employees' });
  } catch (err) {
    handleDbError(err, res, 'EMPLOYEE DELETE');
  }
});

// === UTILITIES API ===
app.get('/api/product-types', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM LoaiSanPham');
    res.json(rows);
  } catch (err) {
    handleDbError(err, res, 'PRODUCT TYPES GET');
  }
});

app.get('/api/suppliers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM NhaCungCap');
    res.json(rows);
  } catch (err) {
    handleDbError(err, res, 'SUPPLIERS GET');
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(5000, () => console.log('API running on port 5000')); 