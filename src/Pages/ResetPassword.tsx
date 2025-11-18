import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, CircularProgress, Collapse, Alert } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    const codeFromUrl = searchParams.get('code');
    
    if (emailFromUrl && codeFromUrl) {
      setEmail(emailFromUrl);
      setCode(codeFromUrl);
    } else {
      setError('Invalid reset link. Please try again.');
    }
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid or expired token');
      }

      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/'), 3000);
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
             FINANCE TRACKING APP
           </Typography>
        </Box>

        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mt: 2 }}>
          Reset Your Password
        </Typography>

        <Collapse in={!!message} sx={{ width: '100%', mt: 2 }}>
          <Alert severity="success">{message}</Alert>
        </Collapse>
        <Collapse in={!!error} sx={{ width: '100%', mt: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Collapse>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="New Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!!message || !code}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={!!message || !code}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={loading || !!message || !code}
          >
            {loading ? <CircularProgress size={24} /> : 'Reset Password'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ResetPassword;