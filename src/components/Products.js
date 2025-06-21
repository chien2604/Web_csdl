import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Avatar,
  Tooltip,
  Fade,
  Skeleton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import { Add as AddIcon, Inventory as InventoryIcon, List as ListIcon, BarChart as BarChartIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';

function Products() {
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ TenSP: '', GiaBan: '', MaLoai: '', MaNCC: '' });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false));
  };

  const fetchInitialData = () => {
    setInitialDataLoading(true);
    Promise.all([
      axios.get('http://localhost:5000/api/product-types'),
      axios.get('http://localhost:5000/api/suppliers')
    ]).then(([typesRes, suppliersRes]) => {
      setProductTypes(typesRes.data);
      setSuppliers(suppliersRes.data);
    }).catch(err => {
      console.error("Failed to fetch initial data:", err);
      alert("Không thể tải dữ liệu cho Loại sản phẩm và Nhà cung cấp. Vui lòng kiểm tra lại server và database.");
    }).finally(() => {
      setInitialDataLoading(false);
    });
  };

  useEffect(() => {
    fetchProducts();
    fetchInitialData();
  }, []);
  
  useEffect(() => {
    if (editingProduct) {
      setFormData({ 
        TenSP: editingProduct.TenSP, 
        GiaBan: editingProduct.GiaBan,
        MaLoai: editingProduct.MaLoai,
        MaNCC: editingProduct.MaNCC
      });
    } else {
      setFormData({ TenSP: '', GiaBan: '', MaLoai: '', MaNCC: '' });
    }
  }, [editingProduct]);

  const handleOpenDialog = (product = null) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData({ TenSP: '', GiaBan: '', MaLoai: '', MaNCC: '' });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const apiCall = editingProduct
      ? axios.put(`http://localhost:5000/api/products/${editingProduct.MaSP}`, formData)
      : axios.post('http://localhost:5000/api/products', formData);

    apiCall
      .then(() => {
        handleCloseDialog();
        fetchProducts();
      })
      .catch(err => {
        const errorMessage = err.response?.data?.sqlMessage || err.response?.data || 'Đã xảy ra lỗi. Vui lòng thử lại.';
        alert(errorMessage);
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Bạn có chắc muốn xoá sản phẩm này? Thao tác này sẽ xoá tất cả chi tiết hoá đơn liên quan.')) {
      axios.delete(`http://localhost:5000/api/products/${id}`)
        .then(() => fetchProducts());
    }
  };

  const getProductTypeName = (maLoai) => {
    const type = productTypes.find(t => t.MaLoai === maLoai);
    return type ? type.TenLoai : 'Không xác định';
  };

  const getSupplierName = (maNCC) => {
    const supplier = suppliers.find(s => s.MaNCC === maNCC);
    return supplier ? supplier.TenNCC : 'Không xác định';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={700} sx={{ flexGrow: 1 }}>Sản phẩm</Typography>
        <Button
          variant={showDashboard ? 'contained' : 'outlined'}
          startIcon={<BarChartIcon />}
          onClick={() => setShowDashboard(true)}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          Xem Dashboard
        </Button>
        <Button
          variant={!showDashboard ? 'contained' : 'outlined'}
          startIcon={<ListIcon />}
          onClick={() => setShowDashboard(false)}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          Danh sách sản phẩm
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2, fontWeight: 600 }}
          onClick={() => handleOpenDialog()}
          disabled={initialDataLoading}
        >
          {initialDataLoading ? 'Đang tải...' : 'Thêm sản phẩm'}
        </Button>
      </Box>
      {showDashboard ? (
        <Box sx={{ my: 4, minHeight: 620, position: 'relative' }}>
          {!isIframeLoaded && (
            <Typography variant="h6" align="center" sx={{ pt: 12, color: 'text.secondary' }}>
              Đang phân tích ...
            </Typography>
          )}
          <iframe
            title="Power BI - Sản Phẩm"
            width="100%"
            height="600px"
            src="https://app.powerbi.com/reportEmbed?reportId=f097b77c-f0cc-4868-985b-16dea1f554d0&autoAuth=true&ctid=e7572e92-7aee-4713-a3c4-ba64888ad45f&pageName=ReportSection4"
            frameBorder="0"
            allowFullScreen={true}
            style={{ borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.12)', display: isIframeLoaded ? 'block' : 'none' }}
            onLoad={() => setIsIframeLoaded(true)}
          />
        </Box>
      ) : (
        <Fade in={!loading} timeout={700}>
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3, background: (theme) => theme.palette.background.paper }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: (theme) => theme.palette.mode === 'dark' ? '#232936' : '#f5f5f5' }}>
                  <TableCell align="center">Icon</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên sản phẩm</TableCell>
                  <TableCell>Giá bán</TableCell>
                  <TableCell>Loại sản phẩm</TableCell>
                  <TableCell>Nhà cung cấp</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell colSpan={7}><Skeleton variant="rectangular" height={40} /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  products.map((product) => (
                    <TableRow key={product.MaSP} hover sx={{ transition: '0.2s', '&:hover': { background: (theme) => theme.palette.action.hover } }}>
                      <TableCell align="center">
                        <Avatar sx={{ bgcolor: '#2e7d32', mx: 'auto' }}>
                          <InventoryIcon />
                        </Avatar>
                      </TableCell>
                      <TableCell>{product.MaSP}</TableCell>
                      <TableCell>{product.TenSP}</TableCell>
                      <TableCell>₫{product.GiaBan?.toLocaleString()}</TableCell>
                      <TableCell>{getProductTypeName(product.MaLoai)}</TableCell>
                      <TableCell>{getSupplierName(product.MaNCC)}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Sửa sản phẩm">
                            <Button
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ borderRadius: 2, fontWeight: 600 }}
                              onClick={() => handleOpenDialog(product)}
                              startIcon={<EditIcon />}
                            >
                              Sửa
                            </Button>
                          </Tooltip>
                          <Tooltip title="Xoá sản phẩm">
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              sx={{ borderRadius: 2, fontWeight: 600 }}
                              onClick={() => handleDeleteProduct(product.MaSP)}
                              startIcon={<DeleteIcon />}
                            >
                              Xoá
                            </Button>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Fade>
      )}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProduct ? 'Sửa thông tin sản phẩm' : 'Thêm sản phẩm mới'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Tên sản phẩm"
              value={formData.TenSP}
              onChange={e => setFormData(s => ({ ...s, TenSP: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Giá bán"
              type="number"
              value={formData.GiaBan}
              onChange={e => setFormData(s => ({ ...s, GiaBan: e.target.value }))}
              fullWidth
            />
            <TextField
              select
              label="Loại sản phẩm"
              value={formData.MaLoai}
              onChange={e => setFormData(s => ({ ...s, MaLoai: e.target.value }))}
              fullWidth
              disabled={initialDataLoading}
            >
              {initialDataLoading ? (
                <MenuItem disabled>Đang tải...</MenuItem>
              ) : productTypes.length === 0 ? (
                <MenuItem disabled>Không có dữ liệu</MenuItem>
              ) : (
                productTypes.map((type) => (
                  <MenuItem key={type.MaLoai} value={type.MaLoai}>
                    {type.TenLoai}
                  </MenuItem>
                ))
              )}
            </TextField>
            <TextField
              select
              label="Nhà cung cấp"
              value={formData.MaNCC}
              onChange={e => setFormData(s => ({ ...s, MaNCC: e.target.value }))}
              fullWidth
              disabled={initialDataLoading}
            >
              {initialDataLoading ? (
                <MenuItem disabled>Đang tải...</MenuItem>
              ) : suppliers.length === 0 ? (
                <MenuItem disabled>Không có dữ liệu</MenuItem>
              ) : (
                suppliers.map((supplier) => (
                  <MenuItem key={supplier.MaNCC} value={supplier.MaNCC}>
                    {supplier.TenNCC}
                  </MenuItem>
                ))
              )}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isSubmitting}>Huỷ</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting || !formData.TenSP || !formData.GiaBan || !formData.MaLoai || !formData.MaNCC}>
            {editingProduct ? 'Lưu thay đổi' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Products; 