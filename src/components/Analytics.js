import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function Analytics() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Phân tích
      </Typography>
      <Paper
        sx={{
          p: 2,
          height: 'calc(100vh - 200px)',
          width: '100%',
        }}
      >
        <iframe
          title="DashBoard"
          width="100%"
          height="100%"
          src="https://app.powerbi.com/reportEmbed?reportId=f097b77c-f0cc-4868-985b-16dea1f554d0&autoAuth=true&ctid=e7572e92-7aee-4713-a3c4-ba64888ad45f"
          frameBorder="0"
          allowFullScreen={true}
        />
      </Paper>
    </Box>
  );
}

export default Analytics; 