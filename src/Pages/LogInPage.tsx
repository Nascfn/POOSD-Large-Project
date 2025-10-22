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
import { useNavigate } from "react-router-dom";

function LogInPage() {
  const navigate = useNavigate();

  const [emailValue, setEmailValue] = React.useState("");
  const [passwordValue, setPasswordValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleEmailInput = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setEmailValue(event.target.value);
  };

  const handlePasswordInput = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setPasswordValue(event.target.value);
  };

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleLogIn = () => {
    if (isValidEmail(emailValue) === false) {
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
      <Collapse in={open}>
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
          sx={{ mb: 2 }}
        >
          {errorMessage}
        </Alert>
      </Collapse>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
        component="form"
        noValidate
        autoComplete="off"
      >
        <Card
          sx={{
            width: { xs: "90%", sm: "70%", md: "50%", lg: "40%" },
            maxWidth: 800,
            margin: "auto",
            mt: 4,
            p: 2,
            backgroundColor: "#181818ff",
          }}
        >
          <CardContent sx={{ pt: 5 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <div>
                <TextField
                  id="outlined-basic"
                  label="Email"
                  margin="dense"
                  variant="outlined"
                  InputLabelProps={{
                    style: { color: "white" },
                  }}
                  sx={{
                    input: { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "white",
                      },
                      "&:hover fieldset": {
                        borderColor: "white",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "white",
                      },
                    },
                  }}
                  required={true}
                  onChange={handleEmailInput}
                />
              </div>
              <div>
                <TextField
                  id="outlined-basic"
                  label="Password"
                  margin="dense"
                  variant="outlined"
                  InputLabelProps={{
                    style: { color: "white" },
                  }}
                  sx={{
                    input: { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "white",
                      },
                      "&:hover fieldset": {
                        borderColor: "white",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "white",
                      },
                    },
                  }}
                  required={true}
                  onChange={handlePasswordInput}
                />
              </div>
              <div>
                <Button variant="contained" onClick={handleLogIn}>
                  Log In
                </Button>
              </div>
              <div>
                <Button
                  variant="text"
                  onClick={() => {
                    navigate("/register");
                  }}
                >
                  Register
                </Button>
              </div>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default LogInPage;
