import mysql.connector
from faker import Faker
import random

fake = Faker('vi_VN')
conn = mysql.connector.connect(
    host='localhost',
    user='admin',
    password='admin123',
    database='btlshop'
)
cursor = conn.cursor()

# # 1. LoaiCuaHang
# loai_cua_hang = [
#     ('LCH001', 'Cửa hàng độc lập'),
#     ('LCH002', 'Trong TTTM'),
#     ('LCH003', 'Online Store'),
#     ('LCH004', 'Cửa hàng nhượng quyền')
# ]
# cursor.executemany("INSERT IGNORE INTO LoaiCuaHang (MaLoaiCH, TenLoaiCH) VALUES (%s, %s)", loai_cua_hang)

# 2. LoaiSanPham
# loai_san_pham = [
#     ('LSP001', 'Áo', 'Mặc hàng ngày'),
#     ('LSP002', 'Quần', 'Mặc hàng ngày'),
#     ('LSP003', 'Váy', 'Dự tiệc'),
#     ('LSP004', 'Áo khoác', 'Giữ ấm'),
#     ('LSP005', 'Đồ lót', 'Mặc bên trong')
# ]
# cursor.executemany("INSERT IGNORE INTO LoaiSanPham (MaLoai, TenLoai, CongDung) VALUES (%s, %s, %s)", loai_san_pham)

# 3. LoaiTheThanhVien
loai_the = [
    ('TT', 'Thân Thiết', '0 điểm tích lũy'),
    ('B', 'Bạc', '500 điểm tích lũy'),
    ('V', 'Vàng', '2000 điểm tích lũy'),
    ('KC', 'Kim Cương', '5000 điểm tích lũy')
]
cursor.executemany("INSERT IGNORE INTO LoaiTheThanhVien (MaLoaiThe, TenLoaiThe, DieuKien) VALUES (%s, %s, %s)", loai_the)

# # 4. KhuyenMai
# for i in range(20):
#     MaKM = f"KM{str(i+1).zfill(3)}"
#     MoTa = fake.sentence(nb_words=6)
#     start = fake.date_between(start_date='-1y', end_date='today')
#     end = fake.date_between(start_date=start, end_date='+30d')
#     cursor.execute("INSERT IGNORE INTO KhuyenMai (MaKM, MoTaKhuyenMai, Thoigianbatdau, Thoigianketthuc) VALUES (%s, %s, %s, %s)", (MaKM, MoTa, start, end))

# # 5. NhaCungCap
# for i in range(50):
#     MaNCC = f"NCC{str(i+1).zfill(3)}"
#     TenNCC = fake.company()
#     SDT = fake.msisdn()[:10]
#     Email = fake.company_email()
#     cursor.execute("INSERT IGNORE INTO NhaCungCap (MaNCC, TenNCC, SDT, Email) VALUES (%s, %s, %s, %s)", (MaNCC, TenNCC, SDT, Email))

# # 6. CuaHang
# for i in range(32):
#     MaCH = f"CH{str(i+1).zfill(3)}"
#     MaLoaiCH = random.choice(loai_cua_hang)[0]
#     TenCH = f"Cửa hàng {fake.street_name()}"
#     TongNV = random.randint(5, 20)
#     ThanhPho = fake.city()
#     Quan = fake.city_suffix()
#     Duong = fake.street_name()
#     SoNha = fake.building_number()
#     cursor.execute("INSERT IGNORE INTO CuaHang (MaCH, MaLoaiCH, TenCH, TongNV, ThanhPho, Quan, Duong, SoNha) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", (MaCH, MaLoaiCH, TenCH, TongNV, ThanhPho, Quan, Duong, SoNha))

# 7. TheThanhVien & KhachHang
for i in range(6000):
    MaSoThe = f"TTV{str(i+1).zfill(7)}"
    MaLoaiThe = random.choice(loai_the)[0]
    Diemtichluy = random.randint(0, 10000)
    cursor.execute("INSERT IGNORE INTO TheThanhVien (MaSoThe, MaLoaiThe, Diemtichluy) VALUES (%s, %s, %s)", (MaSoThe, MaLoaiThe, Diemtichluy))

    MaKH = f"KH{str(i+1).zfill(8)}"
    TenKH = fake.name()
    GioiTinh = random.randint(0, 1)
    NgaySinh = fake.date_of_birth(minimum_age=18, maximum_age=60)
    ThanhPho = fake.city()
    Quan = fake.city_suffix()
    Email = fake.email()
    SDT = fake.msisdn()[:10]
    cursor.execute("INSERT IGNORE INTO KhachHang (MaKH, TenKH, MaSoThe, GioiTinh, NgaySinh, ThanhPho, Quan, Email, SDT) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", (MaKH, TenKH, MaSoThe, GioiTinh, NgaySinh, ThanhPho, Quan, Email, SDT))

# # 8. SanPham
# for i in range(200):
#     MaSP = f"SP{str(i+1).zfill(8)}"
#     TenSP = fake.word().capitalize() + " " + fake.word()
#     MaLoai = random.choice(loai_san_pham)[0]
#     MaNCC = f"NCC{str(random.randint(1, 50)).zfill(3)}"
#     GiaBan = random.randint(100000, 1000000)
#     GiaGoc = GiaBan - random.randint(10000, 50000)
#     TonKho = random.randint(10, 200)
#     Size = random.choice(['S', 'M', 'L', 'XL', 'Freesize', '29', '30', '31', '32'])
#     cursor.execute("INSERT IGNORE INTO SanPham (MaSP, TenSP, MaLoai, MaNCC, GiaBan, GiaGoc, TonKho, Size) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", (MaSP, TenSP, MaLoai, MaNCC, GiaBan, GiaGoc, TonKho, Size))

# 9. NhanVien
for i in range(300):
    MaNV = f"NV{str(i+1).zfill(8)}"
    TenNV = fake.name()
    MaCH = f"CH{str(random.randint(1, 32)).zfill(3)}"
    NgaySinh = fake.date_of_birth(minimum_age=18, maximum_age=60)
    GioiTinh = random.randint(0, 1)
    Email = fake.email()
    SDT = fake.msisdn()[:10]
    ThanhPho = fake.city()
    Quan = fake.city_suffix()
    Duong = fake.street_name()
    SoNha = fake.building_number()
    cursor.execute("INSERT IGNORE INTO NhanVien (MaNV, TenNV, MaCH, NgaySinh, GioiTinh, Email, SDT, ThanhPho, Quan, Duong, SoNha) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (MaNV, TenNV, MaCH, NgaySinh, GioiTinh, Email, SDT, ThanhPho, Quan, Duong, SoNha))

# 10. HoaDonBan
for i in range(3000):
    MaHDB = f"HDB{str(i+1).zfill(8)}"
    MaCH = f"CH{str(random.randint(1, 32)).zfill(3)}"
    MaKH = f"KH{str(random.randint(1, 200)).zfill(8)}"
    MaNV = f"NV{str(random.randint(1, 200)).zfill(8)}"
    NgayBan = fake.date_time_this_year()
    TongTienThu = random.randint(500000, 30000000)
    MaKM = f"KM{str(random.randint(1, 20)).zfill(3)}"
    cursor.execute("INSERT IGNORE INTO HoaDonBan (MaHDB, MaCH, MaKH, MaNV, NgayBan, TongTienThu, MaKM) VALUES (%s, %s, %s, %s, %s, %s, %s)", (MaHDB, MaCH, MaKH, MaNV, NgayBan, TongTienThu, MaKM))

# 11. HoaDonNhap
for i in range(200):
    MaHDN = f"HDN{str(i+1).zfill(8)}"
    MaCH = f"CH{str(random.randint(1, 32)).zfill(3)}"
    MaNCC = f"NCC{str(random.randint(1, 50)).zfill(3)}"
    MaNV = f"NV{str(random.randint(1, 200)).zfill(8)}"
    NgayNhap = fake.date_this_year()
    TongTienTra = random.randint(10000000, 50000000)
    cursor.execute("INSERT IGNORE INTO HoaDonNhap (MaHDN, MaCH, MaNCC, MaNV, NgayNhap, TongTienTra) VALUES (%s, %s, %s, %s, %s, %s)", (MaHDN, MaCH, MaNCC, MaNV, NgayNhap, TongTienTra))

# # 12. ChatLieu
# for i in range(200):
#     MaChatLieu = f"CL{str(i+1).zfill(8)}"
#     TenChatLieu = fake.word().capitalize()
#     MaSP = f"SP{str(random.randint(1, 200)).zfill(8)}"
#     DacTinh = fake.sentence(nb_words=4)
#     NganhNghe = fake.word()
#     cursor.execute("INSERT IGNORE INTO ChatLieu (MaChatLieu, TenChatLieu, MaSP, DacTinh, NganhNghe) VALUES (%s, %s, %s, %s, %s)", (MaChatLieu, TenChatLieu, MaSP, DacTinh, NganhNghe))

# # 13. ChiTietHoaDonBan
# for i in range(3000):
#     MaHDB = f"HDB{str(random.randint(1, 200)).zfill(8)}"
#     MaSP = f"SP{str(random.randint(1, 200)).zfill(8)}"
#     SoLuong = random.randint(1, 5)
#     DonGia = random.randint(100000, 1000000)
#     GiamGia = random.randint(0, 50000)
#     ThanhTien = SoLuong * DonGia - GiamGia
#     cursor.execute("INSERT IGNORE INTO ChiTietHoaDonBan (MaHDB, MaSP, SoLuong, DonGia, GiamGia, ThanhTien) VALUES (%s, %s, %s, %s, %s, %s)", (MaHDB, MaSP, SoLuong, DonGia, GiamGia, ThanhTien))

# # 14. ChiTietHoaDonNhap
# for i in range(400):
#     MaHDN = f"HDN{str(random.randint(1, 200)).zfill(8)}"
#     MaSP = f"SP{str(random.randint(1, 200)).zfill(8)}"
#     SoLuongNhap = random.randint(1, 10)
#     DonGiaNhap = random.randint(100000, 1000000)
#     ThanhTien = SoLuongNhap * DonGiaNhap
#     cursor.execute("INSERT IGNORE INTO ChiTietHoaDonNhap (MaHDN, MaSP, SoLuongNhap, DonGiaNhap, ThanhTien) VALUES (%s, %s, %s, %s, %s)", (MaHDN, MaSP, SoLuongNhap, DonGiaNhap, ThanhTien))

# # 15. TonKhoCuaHang
# for i in range(400):
#     MaCH = f"CH{str(random.randint(1, 32)).zfill(3)}"
#     MaSP = f"SP{str(random.randint(1, 200)).zfill(8)}"
#     SoLuongTon = random.randint(0, 200)
#     cursor.execute("INSERT IGNORE INTO TonKhoCuaHang (MaCH, MaSP, SoLuongTon) VALUES (%s, %s, %s)", (MaCH, MaSP, SoLuongTon))

# # 16. KhachHang_KhuyenMai
# for i in range(200):
#     MaKH = f"KH{str(random.randint(1, 200)).zfill(8)}"
#     MaKM = f"KM{str(random.randint(1, 20)).zfill(3)}"
#     MaHDB = f"HDB{str(random.randint(1, 200)).zfill(8)}"
#     NgaySuDung = fake.date_time_this_year()
#     cursor.execute("INSERT IGNORE INTO KhachHang_KhuyenMai (MaKH, MaKM, MaHDB, NgaySuDung) VALUES (%s, %s, %s, %s)", (MaKH, MaKM, MaHDB, NgaySuDung))

# # 17. SanPham_KhuyenMai_CuaHang
# for i in range(200):
#     MaSP = f"SP{str(random.randint(1, 200)).zfill(8)}"
#     MaKM = f"KM{str(random.randint(1, 20)).zfill(3)}"
#     MaCH = f"CH{str(random.randint(1, 32)).zfill(3)}"
#     SoLuongKM = random.randint(1, 50)
#     cursor.execute("INSERT IGNORE INTO SanPham_KhuyenMai_CuaHang (MaSP, MaKM, MaCH, SoLuongKM) VALUES (%s, %s, %s, %s)", (MaSP, MaKM, MaCH, SoLuongKM))

conn.commit()
cursor.close()
conn.close()
print("Đã sinh dữ liệu cho tất cả các bảng!") 