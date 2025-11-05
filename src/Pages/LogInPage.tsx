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
import Link from '@mui/material/Link';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useNavigate } from "react-router-dom";

function LogInPage() {
  const navigate = useNavigate();

  const [emailValue, setEmailValue] = React.useState("");
  const [passwordValue, setPasswordValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleEmailInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(event.target.value);
  };

  const handlePasswordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(event.target.value);
  };

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleLogIn = () => {
    if (!emailValue || !passwordValue) {
      setErrorMessage("Please enter an email and password."); // Updated message
      setOpen(true);
      return;
    } else if (!isValidEmail(emailValue)) { // Check email validity second
      setErrorMessage("Please enter a valid email address.");
      setOpen(true);
      return;
    } else {
      console.log(emailValue);
      console.log(passwordValue);
      navigate("/homepage");
    }
  };

  return (
    <>
      {}
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
            maxWidth: 400, 
            margin: "auto",
            p: { xs: 2, sm: 3 }, 
            borderRadius: (theme) => theme.shape.borderRadius, 
            backgroundColor: 'background.paper',
          }}
        >
          <CardContent>
            {/* Collapse for Error Alert */}
             <Collapse in={open} sx={{ width: '100%', mb: 2 }}>
                <Alert
                severity="error"
                action={
                    <IconButton
                    aria-label="close"
                    size="small"
                    onClick={() => setOpen(false)}
                    >
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
                gap: 2, // Spacing between items
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

              {/* Log In */}
              <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
                Log In
              </Typography>

              {/* Email */}
              <TextField
                fullWidth
                id="email"
                label="Email"
                variant="outlined"
                value={emailValue}
                onChange={handleEmailInput}
                required
              />

              {/* Password */}
              <TextField
                fullWidth
                id="password"
                label="Password"
                type="password"
                variant="outlined"
                value={passwordValue}
                onChange={handlePasswordInput}
                required
              />

              {/* Log In */}
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleLogIn}
                sx={{ mt: 2, py: 1.5 }} 
              >
                Log In
              </Button>

              {/* Forgot password. To implement? */}
              <Link
                href="#"
                variant="body2"
                onClick={(e) => e.preventDefault()}
                sx={{ mt: 1, alignSelf: 'center', color: 'primary.main' }}
              >
                Forgot Password?
              </Link>

              {/* Space */}
              <Box sx={{ height: '10px' }} />

               {/* Register */}
               <Button
                  variant="text"
                  onClick={() => navigate("/register")}
                   sx={{ color: 'text.secondary' }}
                >
                  Don't have an account? Register
                </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default LogInPage;