import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { APP_NAME } from '../constants';

const VerifyEmail: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, sm: 4 }, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          width: { xs: "95%", sm: "80%", md: "60%", lg: "30%" },
          maxWidth: 450,
          borderRadius: (theme) => theme.shape.borderRadius,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
           <Box sx={{
              backgroundColor: 'primary.main',
              borderRadius: '50%',
              padding: '6px',
              display: 'inline-flex',
              marginRight: '12px'
           }}>
              <AttachMoneyIcon sx={{ color: 'primary.contrastText', fontSize: '24px' }} />
           </Box>
           <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
            {APP_NAME}
           </Typography>
        </Box>
        
        <MarkEmailReadIcon sx={{ fontSize: 60, color: 'primary.main', my: 2 }} />

        <Typography component="h1" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Verify Your Email
        </Typography>

        <Typography variant="body1" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
          Thank you for registering! We've sent a verification link to your email address.
        </Typography>

        <Button component={Link} to="/" variant="contained" color="primary" fullWidth>
          Back to Login
        </Button>
      </Paper>
    </Box>
  );
};

export default VerifyEmail;