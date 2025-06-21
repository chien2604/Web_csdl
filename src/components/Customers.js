import React, { useEffect, useState, useCallback } from 'react';
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
  TextField
} from '@mui/material';
import { Add as AddIcon, Person as PersonIcon, List as ListIcon, BarChart as BarChartIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null); // null: add mode, object: edit mode
  const [formData, setFormData] = useState({ TenKH: '', Email: '', SDT: '' });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  const fetchCustomers = useCallback(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/customers')
      .then(res => setCustomers(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCustomers();

    socket.on('data-changed', (data) => {
      if (data.table === 'customers') {
        console.log('Customer data changed, refetching...');
        fetchCustomers();
      }
    });

    // Cleanup listener when component unmounts
    return () => {
      socket.off('data-changed');
    };
  }, [fetchCustomers]);
  
  useEffect(() => {
    if (editingCustomer) {
      setFormData({ 
        TenKH: editingCustomer.TenKH, 
        Email: editingCustomer.Email, 
        SDT: editingCustomer.SDT 
      });
    } else {
      setFormData({ TenKH: '', Email: '', SDT: '' });
    }
  }, [editingCustomer]);

  const handleOpenDialog = (customer = null) => {
    setEditingCustomer(customer);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCustomer(null);
    setFormData({ TenKH: '', Email: '', SDT: '' });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const apiCall = editingCustomer
      ? axios.put(`http://localhost:5000/api/customers/${editingCustomer.MaKH}`, formData)
      : axios.post('http://localhost:5000/api/customers', formData);

    apiCall
      .then(() => {
        handleCloseDialog();
        fetchCustomers();
      })
      .catch(err => {
        const errorMessage = err.response?.data || 'Đã xảy ra lỗi. Vui lòng thử lại.';
        alert(errorMessage);
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleDeleteCustomer = (id) => {
    if (window.confirm('Bạn có chắc muốn xoá khách hàng này? Thao tác này sẽ xoá tất cả hoá đơn liên quan.')) {
      axios.delete(`http://localhost:5000/api/customers/${id}`)
        .then(() => fetchCustomers());
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={700} sx={{ flexGrow: 1 }}>Khách hàng</Typography>
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
          Danh sách khách hàng
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2, fontWeight: 600 }}
          onClick={() => handleOpenDialog()}
        >
          Thêm khách hàng
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
            title="Power BI - Khách Hàng"
            width="100%"
            height="600px"
            src="https://app.powerbi.com/reportEmbed?reportId=f097b77c-f0cc-4868-985b-16dea1f554d0&autoAuth=true&ctid=e7572e92-7aee-4713-a3c4-ba64888ad45f&pageName=ReportSection2"
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
                  <TableCell align="center">Avatar</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell colSpan={6}><Skeleton variant="rectangular" height={40} /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  customers.map((customer) => (
                    <TableRow key={customer.MaKH} hover sx={{ transition: '0.2s', '&:hover': { background: (theme) => theme.palette.action.hover } }}>
                      <TableCell align="center">
                        <Avatar sx={{ bgcolor: '#1976d2', mx: 'auto' }}>
                          <PersonIcon />
                        </Avatar>
                      </TableCell>
                      <TableCell>{customer.MaKH}</TableCell>
                      <TableCell>{customer.TenKH}</TableCell>
                      <TableCell>{customer.Email}</TableCell>
                      <TableCell>{customer.SDT}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                           <Tooltip title="Sửa khách hàng">
                            <Button
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ borderRadius: 2, fontWeight: 600 }}
                              onClick={() => handleOpenDialog(customer)}
                              startIcon={<EditIcon />}
                            >
                              Sửa
                            </Button>
                          </Tooltip>
                          <Tooltip title="Xoá khách hàng">
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              sx={{ borderRadius: 2, fontWeight: 600 }}
                              onClick={() => handleDeleteCustomer(customer.MaKH)}
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
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{editingCustomer ? 'Sửa thông tin khách hàng' : 'Thêm khách hàng mới'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Tên khách hàng"
              value={formData.TenKH}
              onChange={e => setFormData(s => ({ ...s, TenKH: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Email"
              value={formData.Email}
              onChange={e => setFormData(s => ({ ...s, Email: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Số điện thoại"
              value={formData.SDT}
              onChange={e => setFormData(s => ({ ...s, SDT: e.target.value }))}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isSubmitting}>Huỷ</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting || !formData.TenKH || !formData.Email || !formData.SDT}>
            {editingCustomer ? 'Lưu thay đổi' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Customers; 