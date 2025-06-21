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
import { Add as AddIcon, Badge as BadgeIcon, List as ListIcon, BarChart as BarChartIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({ TenNV: '', Email: '', SDT: '', MaCH: '' });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  const fetchEmployees = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/employees')
      .then(res => setEmployees(res.data))
      .finally(() => setLoading(false));
  };

  const fetchStores = () => {
    axios.get('http://localhost:5000/api/stores')
      .then(res => setStores(res.data));
  };

  useEffect(() => {
    fetchEmployees();
    fetchStores();
  }, []);
  
  useEffect(() => {
    if (editingEmployee) {
      setFormData({ 
        TenNV: editingEmployee.TenNV, 
        Email: editingEmployee.Email, 
        SDT: editingEmployee.SDT,
        MaCH: editingEmployee.MaCH
      });
    } else {
      setFormData({ TenNV: '', Email: '', SDT: '', MaCH: '' });
    }
  }, [editingEmployee]);

  const handleOpenDialog = (employee = null) => {
    setEditingEmployee(employee);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEmployee(null);
    setFormData({ TenNV: '', Email: '', SDT: '', MaCH: '' });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const apiCall = editingEmployee
      ? axios.put(`http://localhost:5000/api/employees/${editingEmployee.MaNV}`, formData)
      : axios.post('http://localhost:5000/api/employees', formData);

    apiCall
      .then(() => {
        handleCloseDialog();
        fetchEmployees();
      })
      .catch(err => {
        const errorMessage = err.response?.data || 'Đã xảy ra lỗi. Vui lòng thử lại.';
        alert(errorMessage);
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleDeleteEmployee = (id) => {
    if (window.confirm('Bạn có chắc muốn xoá nhân viên này?')) {
      axios.delete(`http://localhost:5000/api/employees/${id}`)
        .then(() => fetchEmployees());
    }
  };

  const getStoreName = (maCH) => {
    const store = stores.find(s => s.MaCH === maCH);
    return store ? store.TenCH : 'Không xác định';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={700} sx={{ flexGrow: 1 }}>Nhân viên</Typography>
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
          Danh sách nhân viên
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2, fontWeight: 600 }}
          onClick={() => handleOpenDialog()}
        >
          Thêm nhân viên
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
            title="Power BI - Nhân Viên"
            width="100%"
            height="600px"
            src="https://app.powerbi.com/reportEmbed?reportId=f097b77c-f0cc-4868-985b-16dea1f554d0&autoAuth=true&ctid=e7572e92-7aee-4713-a3c4-ba64888ad45f&pageName=ReportSection5"
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
                  <TableCell>Tên nhân viên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Cửa hàng</TableCell>
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
                  employees.map((employee) => (
                    <TableRow key={employee.MaNV} hover sx={{ transition: '0.2s', '&:hover': { background: (theme) => theme.palette.action.hover } }}>
                      <TableCell align="center">
                        <Avatar sx={{ bgcolor: '#9c27b0', mx: 'auto' }}>
                          <BadgeIcon />
                        </Avatar>
                      </TableCell>
                      <TableCell>{employee.MaNV}</TableCell>
                      <TableCell>{employee.TenNV}</TableCell>
                      <TableCell>{employee.Email}</TableCell>
                      <TableCell>{employee.SDT}</TableCell>
                      <TableCell>{getStoreName(employee.MaCH)}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Sửa nhân viên">
                            <Button
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ borderRadius: 2, fontWeight: 600 }}
                              onClick={() => handleOpenDialog(employee)}
                              startIcon={<EditIcon />}
                            >
                              Sửa
                            </Button>
                          </Tooltip>
                          <Tooltip title="Xoá nhân viên">
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              sx={{ borderRadius: 2, fontWeight: 600 }}
                              onClick={() => handleDeleteEmployee(employee.MaNV)}
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
        <DialogTitle>{editingEmployee ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên mới'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Tên nhân viên"
              value={formData.TenNV}
              onChange={e => setFormData(s => ({ ...s, TenNV: e.target.value }))}
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
            <TextField
              select
              label="Cửa hàng"
              value={formData.MaCH}
              onChange={e => setFormData(s => ({ ...s, MaCH: e.target.value }))}
              fullWidth
            >
              {stores.map((store) => (
                <MenuItem key={store.MaCH} value={store.MaCH}>
                  {store.TenCH}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isSubmitting}>Huỷ</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting || !formData.TenNV || !formData.Email || !formData.SDT || !formData.MaCH}>
            {editingEmployee ? 'Lưu thay đổi' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Employees; 