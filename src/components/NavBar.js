import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import SecurityIcon from '@mui/icons-material/Security';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScannerIcon from '@mui/icons-material/Scanner';

const NavBar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
    handleClose();
  };
  
  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar sx={{ px: { xs: 0 }, py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <SecurityIcon sx={{ mr: 1.5, fontSize: 24, color: 'primary.main' }} />
            <Typography 
              variant="h6" 
              component={Link} 
              to="/" 
              sx={{ 
                fontWeight: 700, 
                textDecoration: 'none',
                color: 'text.primary',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              SecureScan
            </Typography>
          </Box>
          
          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button 
                color="inherit" 
                component={Link} 
                to="/dashboard" 
                startIcon={<DashboardIcon />}
                sx={{ mr: 1 }}
              >
                Dashboard
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/scans" 
                startIcon={<ScannerIcon />}
                sx={{ mr: 2 }}
              >
                Scans
              </Button>
              <IconButton
                size="small"
                onClick={handleMenu}
                color="inherit"
                sx={{ 
                  ml: 2,
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: '8px',
                  '&:hover': { 
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: 'primary.main' 
                  } 
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.main', 
                    width: 30, 
                    height: 30, 
                    fontSize: '0.9rem', 
                    fontWeight: 'bold' 
                  }}
                >
                  {currentUser?.username.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    border: '1px solid rgba(255,255,255,0.1)'
                  }
                }}
              >
                <MenuItem disabled sx={{ opacity: 0.7 }}>{currentUser?.username}</MenuItem>
                <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>Profile</MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>Logout</MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                variant="outlined"
                sx={{ 
                  mr: 1.5, 
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': { borderColor: 'primary.main' } 
                }}
              >
                Log in
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                to="/register"
              >
                Sign up
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;