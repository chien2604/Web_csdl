import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Avatar, Skeleton, useTheme } from '@mui/material';
import {
  People as PeopleIcon,
  Store as StoreIcon,
  Inventory as InventoryIcon,
  Badge as BadgeIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [summary, setSummary] = useState({
    totalCustomers: 0,
    totalStores: 0,
    totalProducts: 0,
    totalEmployees: 0,
    monthlyRevenue: 0,
    growth: 0
  });
  const [loading, setLoading] = useState(true);
  const [showPowerBI, setShowPowerBI] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    axios.get('http://localhost:5000/api/summary')
      .then(res => setSummary(res.data))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      title: 'Tổng khách hàng',
      value: summary.totalCustomers,
      icon: <PeopleIcon />,
      color: theme.palette.primary.main,
      onClick: () => navigate('/customers'),
    },
    {
      title: 'Tổng cửa hàng',
      value: summary.totalStores,
      icon: <StoreIcon />,
      color: theme.palette.success.main,
      onClick: () => navigate('/stores'),
    },
    {
      title: 'Tổng sản phẩm',
      value: summary.totalProducts,
      icon: <InventoryIcon />,
      color: theme.palette.warning.main,
      onClick: () => navigate('/products'),
    },
    {
      title: 'Tổng nhân viên',
      value: summary.totalEmployees,
      icon: <BadgeIcon />,
      color: theme.palette.info.main,
      onClick: () => navigate('/employees'),
    },
    {
      title: 'Doanh thu tháng',
      value: `₫${summary.monthlyRevenue.toLocaleString()}`,
      icon: <MoneyIcon />,
      color: theme.palette.error.main,
    },
    {
      title: 'Tăng trưởng',
      value: `+${summary.growth}%`,
      icon: <TrendingUpIcon />,
      color: theme.palette.success.dark,
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ flexGrow: 1, mb: 0 }}>
          Tổng quan
        </Typography>
        <Button
          variant={showPowerBI ? 'contained' : 'outlined'}
          startIcon={<BarChartIcon />}
          onClick={() => setShowPowerBI(!showPowerBI)}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          {showPowerBI ? 'Ẩn Dashboard' : 'Xem Dashboard'}
        </Button>
      </Box>
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
        {stats.map((stat) => (
          <Box
            key={stat.title}
            onClick={stat.onClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2.5,
              borderRadius: 4,
              bgcolor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`,
              cursor: stat.onClick ? 'pointer' : 'default',
              transition: 'box-shadow 0.3s, border-color 0.3s',
              '&:hover': {
                boxShadow: stat.onClick ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                borderColor: stat.onClick ? 'primary.main' : 'divider',
              },
            }}
          >
            <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56, mr: 2 }}>
              {React.cloneElement(stat.icon, { sx: { fontSize: 30 }})}
            </Avatar>
            <Box>
              <Typography color="text.secondary" fontWeight={600} gutterBottom>
                {stat.title}
              </Typography>
              {loading ? (
                <Skeleton variant="text" width={80} height={40} />
              ) : (
                <Typography variant="h5" fontWeight={700} color={stat.color}>
                  {stat.value}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>
      
      {showPowerBI && (
        <Box sx={{ my: 4, minHeight: 620, position: 'relative' }}>
          {!isIframeLoaded && (
            <Typography variant="h6" align="center" sx={{ pt: 12, color: 'text.secondary' }}>
              Đang phân tích ...
            </Typography>
          )}
          <iframe
            title="Power BI - Dashboard Tổng quan"
            width="100%"
            height="600px"
            src="https://app.powerbi.com/reportEmbed?reportId=f097b77c-f0cc-4868-985b-16dea1f554d0&autoAuth=true&ctid=e7572e92-7aee-4713-a3c4-ba64888ad45f&pageName=ReportSection1"
            frameBorder="0"
            allowFullScreen={true}
            style={{ borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.12)', display: isIframeLoaded ? 'block' : 'none' }}
            onLoad={() => setIsIframeLoaded(true)}
          />
        </Box>
      )}
    </Box>
  );
}

export default Dashboard; 