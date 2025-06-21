import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, AppBar, Typography, CssBaseline, useTheme, Slide } from '@mui/material';
import { Dashboard, People, Store, Inventory, Badge, BarChart } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 220;

const navItems = [
  { text: 'Tổng quan', icon: <Dashboard />, path: '/' },
  { text: 'Khách hàng', icon: <People />, path: '/customers' },
  { text: 'Cửa hàng', icon: <Store />, path: '/stores' },
  { text: 'Sản phẩm', icon: <Inventory />, path: '/products' },
  { text: 'Nhân viên', icon: <Badge />, path: '/employees' },
  { text: 'Phân tích', icon: <BarChart />, path: '/analytics' },
];

function Layout({ children, darkMode }) {
  const theme = useTheme();
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: theme.palette.background.default }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'transparent',
          boxShadow: 'none',
          backdropFilter: 'blur(6px)',
        }}
      >
        {/* Xóa dòng này */}
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderRight: `1px solid ${theme.palette.divider}`,
            boxShadow: 'none',
            borderRadius: '0 32px 32px 0',
            p: 0,
            transition: 'background 0.4s',
          },
        }}
        open
      >
        <Toolbar />
        <Slide in direction="right" timeout={700}>
          <List sx={{ mt: 2 }}>
            {navItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 3,
                  mx: 1,
                  my: 1,
                  py: 1.5,
                  px: 2,
                  transition: 'background-color 0.2s, color 0.2s',
                  
                  // Kiểu cho mục không được chọn
                  color: 'text.secondary',
                  '& .MuiListItemIcon-root': {
                    color: 'text.secondary',
                  },
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    color: 'text.primary',
                    '& .MuiListItemIcon-root': {
                      color: 'text.primary',
                    },
                  },
                  
                  // Kiểu cho mục ĐƯỢC CHỌN
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '& .MuiListItemText-primary': {
                      fontWeight: 600,
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    }
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Slide>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 4 },
          mt: 8,
          minHeight: '100vh',
          background: 'none',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Layout; 