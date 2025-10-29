// src/Pages/RegisterPage.tsx
import * as React from "react";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  const [emailValue, setEmailValue] = React.useState("");
  const [firstNameValue, setFirstNameValue] = React.useState("");
  const [lastNameValue, setLastNameValue] = React.useState("");
  const [passwordValue, setPasswordValue] = React.useState("");
  const [passwordVerifyValue, setPasswordVerifyValue] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);

   const handleEmailInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(event.target.value);
  };

  const handleFirstNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstNameValue(event.target.value);
  };

  const handleLastNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastNameValue(event.target.value);
  };

  const handlePasswordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(event.target.value);
  };

  const handleVerifyPasswordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordVerifyValue(event.target.value);
  };

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleRegister = () => {
    if (
      !firstNameValue ||
      !lastNameValue ||
      !emailValue ||
      !passwordValue ||
      !passwordVerifyValue
    ) {
      setErrorMessage("Must fill out all fields.");
      setOpenSuccess(false);
      setOpen(true);
      return;
    } else if (isValidEmail(emailValue) === false) {
      setErrorMessage("Please enter a valid email address.");
      setOpenSuccess(false);
      setOpen(true);
      return;
    } else if (passwordValue !== passwordVerifyValue) { // Use !== for strict comparison
      setErrorMessage("Passwords do not match.");
      setOpenSuccess(false);
      setOpen(true);
      return;
    } else {
      setErrorMessage("Successfully Registered. Please check your email for verification.");
      setOpen(false);
      setOpenSuccess(true);
      console.log("email: " + emailValue);
      console.log("first name: " + firstNameValue);
      console.log("last name: " + lastNameValue);
      console.log("password: " + passwordValue);
    }
  };


  return (
    <>
      {/* Background Box */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <Card
          sx={{
            width: { xs: "95%", sm: "80%", md: "60%", lg: "30%" },
            maxWidth: 450, 
            margin: "auto",
            p: { xs: 2, sm: 3 },
            borderRadius: (theme) => theme.shape.borderRadius,
            backgroundColor: 'background.paper', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
          }}
        >
          <CardContent>
             {/* Alerts */}
            <Collapse in={open} sx={{ width: '100%', mb: 2 }}>
                <Alert
                severity="error"
                action={
                    <IconButton aria-label="close" size="small" onClick={() => setOpen(false)}>
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
                >
                {errorMessage}
                </Alert>
            </Collapse>
            <Collapse in={openSuccess} sx={{ width: '100%', mb: 2 }}>
                <Alert
                severity="success"
                action={
                    <IconButton aria-label="close" size="small" onClick={() => setOpenSuccess(false)}>
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
                >
                {errorMessage}
                </Alert>
            </Collapse>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              {/* Title */}
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

              {/* Header */}
              <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
                Register
              </Typography>

              {/* Input Fields */}
              <TextField fullWidth label="First Name" variant="outlined" value={firstNameValue} onChange={handleFirstNameInput} required />
              <TextField fullWidth label="Last Name" variant="outlined" value={lastNameValue} onChange={handleLastNameInput} required />
              <TextField fullWidth label="Email" variant="outlined" value={emailValue} onChange={handleEmailInput} required />
              <TextField fullWidth label="Password" type="password" variant="outlined" value={passwordValue} onChange={handlePasswordInput} required />
              <TextField fullWidth label="Verify Password" type="password" variant="outlined" value={passwordVerifyValue} onChange={handleVerifyPasswordInput} required />

              {/* Register Button */}
              <Button
                fullWidth
                variant="contained"
                color="primary" // Use theme green
                onClick={handleRegister}
                sx={{ mt: 2, py: 1.5 }} // Margin top and padding
              >
                Register
              </Button>

              {/* Log In */}
               <Button
                  fullWidth
                  variant="text"
                  onClick={() => navigate("/")}
                  sx={{ mt: 1, color: 'text.secondary' }} // Secondary text color
                >
                  Already have an account? Log In
                </Button>

            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default RegisterPage;