import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline, Box } from '@mui/material';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ScanList from './pages/ScanList';
import NewScan from './pages/NewScan';
import ScanDetail from './pages/ScanDetail';
import PrivateRoute from './components/PrivateRoute';
import { authService } from './services/api';

// Create a 2025 minimalist theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6C63FF', // Modern purple - standout but professional
      light: '#928eff',
      dark: '#4d46cc',
    },
    secondary: {
      main: '#08D9D6', // Teal for contrast and highlighting
      light: '#62ffff',
      dark: '#00a7a4',
    },
    background: {
      default: '#0F172A', // Deep blue-black
      paper: '#1E293B', // Slightly lighter for cards
    },
    error: {
      main: '#FF5D73',
    },
    success: {
      main: '#3CCFCF',
    },
    info: {
      main: '#7B8FF7',
    },
    warning: {
      main: '#FFC857',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '0.9375rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          border: '1px solid rgba(148, 163, 184, 0.12)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 0.2s',
          fontWeight: 600,
        },
        containedPrimary: {
          boxShadow: '0 4px 14px rgba(108, 99, 255, 0.2)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(108, 99, 255, 0.4)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
        },
        head: {
          fontWeight: 600,
          color: '#F1F5F9',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#334155 #1E293B',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#1E293B',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#334155',
            borderRadius: '4px',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <NavBar />
          <Box component="main" sx={{ flexGrow: 1, pt: 2 }}>
            <Routes>
              <Route path="/login" element={
                authService.isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />
              } />
              <Route path="/register" element={
                authService.isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Register />
              } />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/scans" element={
                <PrivateRoute>
                  <ScanList />
                </PrivateRoute>
              } />
              <Route path="/scans/new" element={
                <PrivateRoute>
                  <NewScan />
                </PrivateRoute>
              } />
              <Route path="/scans/:id" element={
                <PrivateRoute>
                  <ScanDetail />
                </PrivateRoute>
              } />
              <Route path="/" element={<Navigate to={authService.isAuthenticated() ? "/dashboard" : "/login"} replace />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;