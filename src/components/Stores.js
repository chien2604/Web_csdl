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
  Tooltip,
  Fade,
  Skeleton,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { Add as AddIcon, Store as StoreIcon, List as ListIcon, BarChart as BarChartIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';

function Stores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [formData, setFormData] = useState({ TenCH: '', DiaChi: '', SDT: '' });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  const fetchStores = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/stores')
      .then(res => setStores(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    if (editingStore) {
      setFormData({ 
        TenCH: editingStore.TenCH, 
        DiaChi: editingStore.DiaChi, 
        SDT: editingStore.SDT 
      });
    } else {
      setFormData({ TenCH: '', DiaChi: '', SDT: '' });
    }
  }, [editingStore]);

  const handleOpenDialog = (store = null) => {
    setEditingStore(store);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingStore(null);
    setFormData({ TenCH: '', DiaChi: '', SDT: '' });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const apiCall = editingStore
      ? axios.put(`http://localhost:5000/api/stores/${editingStore.MaCH}`, formData)
      : axios.post('http://localhost:5000/api/stores', formData);

    apiCall
      .then(() => {
        handleCloseDialog();
        fetchStores();
      })
      .catch(err => {
        const errorMessage = err.response?.data || 'Đã xảy ra lỗi. Vui lòng thử lại.';
        alert(errorMessage);
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleDeleteStore = (id) => {
    if (window.confirm('Bạn có chắc muốn xoá cửa hàng này? Thao tác này sẽ xoá tất cả nhân viên liên quan.')) {
      axios.delete(`http://localhost:5000/api/stores/${id}`)
        .then(() => fetchStores());
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={700} sx={{ flexGrow: 1 }}>Cửa hàng</Typography>
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
          Danh sách cửa hàng
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2, fontWeight: 600 }}
          onClick={() => handleOpenDialog()}
        >
          Thêm cửa hàng
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
            title="Power BI - Cửa Hàng"
            width="100%"
            height="600px"
            src="https://app.powerbi.com/reportEmbed?reportId=f097b77c-f0cc-4868-985b-16dea1f554d0&autoAuth=true&ctid=e7572e92-7aee-4713-a3c4-ba64888ad45f&pageName=ReportSection3"
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
                  <TableCell>Tên cửa hàng</TableCell>
                  <TableCell>Địa chỉ</TableCell>
                  <TableCell>Điện thoại</TableCell>
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
                  stores.map((store) => (
                    <TableRow key={store.MaCH} hover sx={{ transition: '0.2s', '&:hover': { background: (theme) => theme.palette.action.hover } }}>
                      <TableCell align="center">
                        <Avatar sx={{ bgcolor: '#dc004e', mx: 'auto' }}>
                          <StoreIcon />
                        </Avatar>
                      </TableCell>
                      <TableCell>{store.MaCH}</TableCell>
                      <TableCell>{store.TenCH}</TableCell>
                      <TableCell>{store.DiaChi}</TableCell>
                      <TableCell>{store.SDT}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Sửa cửa hàng">
                            <Button
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ borderRadius: 2, fontWeight: 600 }}
                              onClick={() => handleOpenDialog(store)}
                              startIcon={<EditIcon />}
                            >
                              Sửa
                            </Button>
                          </Tooltip>
                          <Tooltip title="Xoá cửa hàng">
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              sx={{ borderRadius: 2, fontWeight: 600 }}
                              onClick={() => handleDeleteStore(store.MaCH)}
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
        <DialogTitle>{editingStore ? 'Sửa thông tin cửa hàng' : 'Thêm cửa hàng mới'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Tên cửa hàng"
              value={formData.TenCH}
              onChange={e => setFormData(s => ({ ...s, TenCH: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Địa chỉ"
              value={formData.DiaChi}
              onChange={e => setFormData(s => ({ ...s, DiaChi: e.target.value }))}
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
          <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting || !formData.TenCH || !formData.DiaChi || !formData.SDT}>
            {editingStore ? 'Lưu thay đổi' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Stores; 