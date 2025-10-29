// src/theme.ts
import { createTheme } from '@mui/material/styles';
import { green, grey } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: green[600], 
      contrastText: '#ffffff',
    },
    secondary: {
      main: grey[800], 
      contrastText: '#ffffff',
    },
    background: {
      default: grey[50],
      paper: '#ffffff',
    },
    text: {
      primary: grey[900], 
      secondary: grey[700], 
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', 
    h5: {
      fontWeight: 700, 
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 5,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 20px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
             borderRadius: 8, 
          }
        },
      },
    },
     MuiCard: {
        styleOverrides: {
            root: {
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }
        }
     }
  },
});

export default theme;