import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, CircularProgress, Collapse, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { APP_NAME } from '../constants';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setMessage('Password reset link sent! Please check your email.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mt: 2 }}>
          Forgot Password
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ my: 2 }}>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>

        <Collapse in={!!message} sx={{ width: '100%', mb: 2 }}>
          <Alert severity="success">{message}</Alert>
        </Collapse>
        <Collapse in={!!error} sx={{ width: '100%', mb: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Collapse>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!!message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={loading || !!message}
          >
            {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button component={Link} to="/" variant="text" sx={{ color: 'text.secondary' }}>
              Back to Login
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;