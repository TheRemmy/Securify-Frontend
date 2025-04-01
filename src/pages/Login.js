import React, { useState, useEffect, useRef } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Box, 
  Alert, 
  Paper, 
  InputAdornment, 
  IconButton,
  Divider,
  Fade,
  Grow,
  Zoom,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Backdrop,
  alpha,
  Snackbar
} from '@mui/material';
import { authService } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ShieldIcon from '@mui/icons-material/Shield';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formFocus, setFormFocus] = useState(false);
  const [authStage, setAuthStage] = useState(0); // 0: not started, 1: verifying, 2: success
  const [securityTip, setSecurityTip] = useState('');
  const [showTip, setShowTip] = useState(false);
  const formRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const securityTips = [
    "Use a password manager to generate and store strong, unique passwords.",
    "Enable two-factor authentication for additional security.",
    "Regularly update your security software and operating systems.",
    "Be cautious of phishing attempts in emails and messages.",
    "Avoid using public Wi-Fi for sensitive transactions."
  ];

  useEffect(() => {
    setMounted(true);
    const randomTip = securityTips[Math.floor(Math.random() * securityTips.length)];
    setSecurityTip(randomTip);
    
    // Show security tip after 2 seconds
    const tipTimer = setTimeout(() => {
      setShowTip(true);
    }, 2000);
    
    return () => {
      setMounted(false);
      clearTimeout(tipTimer);
    };
  }, []);

  useEffect(() => {
    // Advanced 3D network visualization
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const nodes = [];
    const nodeCount = 100;
    const connectionDistance = 150;
    const connectionOpacity = 0.05;
    
    // Create gradient for nodes
    const blueGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    blueGradient.addColorStop(0, '#6C63FF');
    blueGradient.addColorStop(1, '#08D9D6');
    
    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: i % 5 === 0 ? '#6C63FF' : i % 5 === 1 ? '#08D9D6' : i % 5 === 2 ? '#FFFFFF' : '#5A52E3',
        speedX: (Math.random() * 2 - 1) * 0.3,
        speedY: (Math.random() * 2 - 1) * 0.3,
        alpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseDirection: 1,
        connections: []
      });
    }
    
    // Animation function
    function animate() {
      if (!canvasRef.current) return;
      
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Reset connections
      nodes.forEach(node => {
        node.connections = [];
      });
      
      // Find connections
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < connectionDistance) {
            nodes[i].connections.push(j);
            nodes[j].connections.push(i);
          }
        }
      }
      
      // Draw connections first (so they appear behind nodes)
      ctx.strokeStyle = blueGradient;
      for (let i = 0; i < nodeCount; i++) {
        const node = nodes[i];
        
        node.connections.forEach(j => {
          const connectedNode = nodes[j];
          const dx = node.x - connectedNode.x;
          const dy = node.y - connectedNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Calculate opacity based on distance
          const opacity = connectionOpacity * (1 - distance / connectionDistance);
          
          ctx.globalAlpha = opacity;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connectedNode.x, connectedNode.y);
          ctx.stroke();
        });
      }
      
      // Draw nodes
      for (let i = 0; i < nodeCount; i++) {
        const node = nodes[i];
        
        // Pulse effect
        node.alpha += node.pulseSpeed * node.pulseDirection;
        if (node.alpha > 0.7 || node.alpha < 0.2) {
          node.pulseDirection *= -1;
        }
        
        // Draw node
        ctx.globalAlpha = node.alpha;
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Move node
        node.x += node.speedX;
        node.y += node.speedY;
        
        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.speedX *= -1;
        if (node.y < 0 || node.y > canvas.height) node.speedY *= -1;
      }
    }
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setFormFocus(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [formRef]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setAuthStage(1); // Verifying
      
      // Simulate a multi-stage auth process for UX
      setTimeout(async () => {
        try {
          await authService.login(username, password);
          setAuthStage(2); // Success
          
          // Navigate after success animation
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } catch (err) {
          setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
          setAuthStage(0);
          setLoading(false);
        }
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
      setAuthStage(0);
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFormFocus = () => {
    setFormFocus(true);
  };

  const handleCloseTip = () => {
    setShowTip(false);
  };

  return (
    <Container 
      maxWidth={false} 
      disableGutters 
      sx={{ 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(125deg, #0A0F1E 0%, #141C33 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />
      
      {/* Glowing orbs */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: '10%', 
          left: '10%', 
          width: '300px', 
          height: '300px', 
          borderRadius: '50%', 
          background: 'radial-gradient(circle, rgba(108, 99, 255, 0.15) 0%, rgba(108, 99, 255, 0) 70%)',
          filter: 'blur(50px)',
          animation: 'float 15s infinite ease-in-out',
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '50%': { transform: 'translate(50px, 30px)' },
          },
          zIndex: 0
        }} 
      />
      
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: '20%', 
          right: '15%', 
          width: '250px', 
          height: '250px', 
          borderRadius: '50%', 
          background: 'radial-gradient(circle, rgba(8, 217, 214, 0.1) 0%, rgba(8, 217, 214, 0) 70%)',
          filter: 'blur(50px)',
          animation: 'float2 18s infinite ease-in-out',
          '@keyframes float2': {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '50%': { transform: 'translate(-40px, -20px)' },
          },
          zIndex: 0
        }} 
      />
      
      <Box
        sx={{
          position: 'absolute',
          top: { xs: '10%', md: '50%' },
          left: { xs: '50%', md: '25%' },
          transform: { xs: 'translate(-50%, 0)', md: 'translate(-50%, -50%)' },
          width: { xs: '90%', sm: '480px' },
          zIndex: 2
        }}
      >
        <Grow in={mounted} timeout={800}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            mb: 6
          }}>
            <Box 
              sx={{ 
                position: 'relative',
                width: 100,
                height: 100,
                mb: 4
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 80,
                  height: 80,
                  borderRadius: '24px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 20px 60px rgba(108, 99, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  zIndex: 1
                }}
              >
                <ShieldIcon 
                  sx={{ 
                    fontSize: 40,
                    color: '#6C63FF',
                    filter: 'drop-shadow(0 0 10px rgba(108, 99, 255, 0.5))'
                  }} 
                />
              </Box>
              
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  animation: 'rotate 8s linear infinite',
                  '@keyframes rotate': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              >
                {/* Orbiting dot */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: '#6C63FF',
                    transform: 'translate(-50%, -50%) rotate(0deg) translateX(50px)',
                    boxShadow: '0 0 15px 5px rgba(108, 99, 255, 0.4)',
                  }}
                />
              </Box>
              
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  animation: 'rotate 12s linear infinite reverse',
                }}
              >
                {/* Second orbiting dot */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#08D9D6',
                    transform: 'translate(-50%, -50%) rotate(180deg) translateX(45px)',
                    boxShadow: '0 0 15px 5px rgba(8, 217, 214, 0.4)',
                  }}
                />
              </Box>
            </Box>
            
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 800,
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #94A3B8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1.5,
                fontSize: { xs: '2.2rem', sm: '2.75rem' },
                textAlign: 'center'
              }}
            >
              SecureScan Intelligence
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: alpha('#94A3B8', 0.9),
                maxWidth: '340px',
                textAlign: 'center',
                lineHeight: 1.6,
                fontWeight: 500
              }}
            >
              Advanced cybersecurity platform for enterprise threat detection and prevention
            </Typography>
          </Box>
        </Grow>

        <Fade in={mounted} timeout={1000}>
          <Paper
            ref={formRef}
            elevation={24}
            onClick={handleFormFocus}
            sx={{
              borderRadius: 5,
              overflow: 'hidden',
              boxShadow: formFocus 
                ? '0 30px 90px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.1), 0 0 0 4px rgba(108, 99, 255, 0.15)'
                : '0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.07)',
              background: 'rgba(20, 27, 45, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.05)',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: formFocus ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            <Box sx={{ p: { xs: 3, sm: 5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <FingerprintIcon 
                  sx={{ 
                    color: '#6C63FF', 
                    mr: 1.5, 
                    fontSize: 28,
                    filter: 'drop-shadow(0 0 5px rgba(108, 99, 255, 0.3))'
                  }} 
                />
                <Typography 
                  variant="h5" 
                  fontWeight={700}
                  sx={{ 
                    letterSpacing: '-0.02em',
                    color: '#fff'
                  }}
                >
                  Sign in securely
                </Typography>
              </Box>

              {error && (
                <Alert 
                  severity="error" 
                  icon={<ErrorOutlineIcon fontSize="inherit" />}
                  sx={{ 
                    mb: 4, 
                    borderRadius: 3,
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 93, 115, 0.1)',
                    color: '#FF5D73',
                    border: '1px solid rgba(255, 93, 115, 0.2)',
                    py: 1.5,
                    '& .MuiAlert-icon': {
                      color: '#FF5D73',
                      opacity: 0.8
                    }
                  }}
                >
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleLogin}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  placeholder="Enter your username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 3,
                      height: 56,
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.05)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(108, 99, 255, 0.5)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(108, 99, 255, 0.05)',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#6C63FF',
                          borderWidth: '2px',
                        },
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: alpha('#94A3B8', 0.8),
                      '&.Mui-focused': {
                        color: '#6C63FF',
                      },
                    },
                    '& .MuiInputBase-input': {
                      paddingLeft: 2,
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    mb: 1,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 3,
                      height: 56,
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.05)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(108, 99, 255, 0.5)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(108, 99, 255, 0.05)',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#6C63FF',
                          borderWidth: '2px',
                        },
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: alpha('#94A3B8', 0.8),
                      '&.Mui-focused': {
                        color: '#6C63FF',
                      },
                    },
                    '& .MuiInputBase-input': {
                      paddingLeft: 2,
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                          sx={{ 
                            color: alpha('#94A3B8', 0.8),
                            mr: 0.5
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                
                <Box sx={{ textAlign: 'right', mb: 4, mt: 1 }}>
                  <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#6C63FF',
                        fontWeight: 500,
                        '&:hover': { 
                          textDecoration: 'underline',
                          color: '#786FFF'
                        },
                        transition: 'color 0.2s'
                      }}
                    >
                      Forgot your password?
                    </Typography>
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  endIcon={loading ? undefined : <ArrowForwardIcon />}
                  sx={{ 
                    py: 1.8,
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #6C63FF 0%, #5A52E3 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 3,
                    boxShadow: '0 10px 40px rgba(108, 99, 255, 0.3)',
                    color: '#fff',
                    fontWeight: 600,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
                      transform: 'translateX(-100%)',
                      animation: loading ? 'none' : 'shine 3s infinite',
                    },
                    '@keyframes shine': {
                      '100%': {
                        transform: 'translateX(100%)',
                      },
                    },
                    '&:hover': {
                      background: 'linear-gradient(135deg, #786FFF 0%, #6C63FF 100%)',
                      boxShadow: '0 10px 40px rgba(108, 99, 255, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                      boxShadow: '0 5px 20px rgba(108, 99, 255, 0.3)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Sign in securely'
                  )}
                </Button>
                
                <Box 
                  sx={{ 
                    mt: 4,
                    p: 2.5,
                    borderRadius: 3,
                    backgroundColor: 'rgba(8, 217, 214, 0.1)',
                    border: '1px solid rgba(8, 217, 214, 0.2)',
                    display: 'flex',
                    alignItems: 'flex-start'
                  }}
                >
                  <ShieldIcon 
                    sx={{ 
                      color: '#08D9D6', 
                      mr: 1.5, 
                      mt: 0.5,
                      fontSize: 20
                    }} 
                  />
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: alpha('#fff', 0.9),
                        fontWeight: 600,
                        mb: 0.5
                      }}
                    >
                      Enhanced security
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: alpha('#94A3B8', 0.9),
                        lineHeight: 1.5,
                        display: 'block'
                      }}
                    >
                      This login is protected with advanced encryption and anomaly detection.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
            
            <Box sx={{ py: 3, px: 4, textAlign: 'center', backgroundColor: 'rgba(15, 23, 42, 0.3)' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      color: '#6C63FF',
                      fontWeight: 600,
                      '&:hover': { 
                        textDecoration: 'underline',
                        color: '#786FFF'
                      },
                      transition: 'color 0.2s'
                    }}
                  >
                    Create an account
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Fade>
        
        <Box sx={{ mt: 4, textAlign: 'center', zIndex: 1 }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: alpha('#94A3B8', 0.7),
              fontWeight: 500
            }}
          >
            © 2025 SecureScan Intelligence. All rights reserved.
          </Typography>
        </Box>
      </Box>
      
      {!isMobile && (
        <Box 
          sx={{ 
            position: 'fixed', 
            right: { md: 40, lg: 80 }, 
            top: '50%',
            transform: 'translateY(-50%)',
            maxWidth: { md: '320px', lg: '400px' },
            zIndex: 1,
            opacity: isTablet ? 0.7 : 1,
          }}
        >
          <Fade in={mounted} timeout={1500}>
            <Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  color: '#fff', 
                  fontWeight: 700, 
                  mb: 3,
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  fontSize: { md: '2.5rem', lg: '3rem' },
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em'
                }}
              >
                Intelligent security for modern enterprises
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: alpha('#94A3B8', 0.8), 
                  mb: 4,
                  lineHeight: 1.6,
                  fontSize: '1.1rem'
                }}
              >
                Our AI-powered platform provides real-time threat detection, vulnerability assessment, and comprehensive security management.
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
  <Box 
    sx={{ 
      p: 2.5, 
      bgcolor: 'rgba(15, 23, 42, 0.6)', 
      borderRadius: 4,
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
        borderColor: 'rgba(108, 99, 255, 0.2)',
      }
    }}
  >
    <Box 
      sx={{ 
        width: 40, 
        height: 40, 
        borderRadius: 2, 
        bgcolor: 'rgba(108, 99, 255, 0.1)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        mr: 2  ,
        border: '1px solid rgba(108, 99, 255, 0.2)',
      }}
    >
      <CheckCircleIcon sx={{ color: '#6C63FF', fontSize: 22 }} />
    </Box>
    <Box>
      <Typography 
        variant="subtitle1" 
        sx={{ 
          color: '#fff', 
          fontWeight: 600, 
          mb: 0.5 
        }}
      >
        Intelligent Vulnerability Detection
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          color: alpha('#94A3B8', 0.9),
          fontWeight: 400,
        }}
      >
        Advanced scanning detects vulnerabilities before they can be exploited
      </Typography>
    </Box>
  </Box>
</Box>
            </Box>
          </Fade>
        </Box>
      )}
      
      {/* Multi-stage authentication backdrop */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: 10,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(10, 15, 30, 0.85)',
          flexDirection: 'column'
        }}
        open={loading}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            maxWidth: '380px'
          }}
        >
          {authStage === 1 && (
            <Fade in={authStage === 1} timeout={500}>
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress 
                  color="primary" 
                  size={60} 
                  thickness={4} 
                  sx={{ mb: 3 }} 
                />
                <Typography 
                  variant="h5" 
                  component="div" 
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  Verifying credentials
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  sx={{ maxWidth: '280px', mx: 'auto', mb: 3 }}
                >
                  Establishing secure connection and validating your credentials
                </Typography>
                
                <Box sx={{ 
                  width: '100%', 
                  height: 6, 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  borderRadius: 3, 
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <Box sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '30%',
                    bgcolor: 'primary.main',
                    borderRadius: 3,
                    animation: 'progress 2s infinite ease-in-out',
                    '@keyframes progress': {
                      '0%': { left: '-30%' },
                      '100%': { left: '100%' },
                    }
                  }} />
                </Box>
              </Box>
            </Fade>
          )}
          
          {authStage === 2 && (
            <Zoom in={authStage === 2} timeout={500}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(8, 217, 214, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  border: '1px solid rgba(8, 217, 214, 0.3)',
                }}>
                  <CheckCircleIcon sx={{ color: '#08D9D6', fontSize: 40 }} />
                </Box>
                <Typography 
                  variant="h5" 
                  component="div" 
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  Authentication successful
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  sx={{ maxWidth: '300px', mx: 'auto' }}
                >
                  Redirecting you to your secure dashboard...
                </Typography>
              </Box>
            </Zoom>
          )}
        </Box>
      </Backdrop>

      {/* Security tip snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={showTip}
        onClose={handleCloseTip}
        autoHideDuration={8000}
        sx={{ 
          mb: 2,
          '& .MuiSnackbarContent-root': {
            bgcolor: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3,
            py: 1,
            px: 2,
          }
        }}
        message={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ShieldIcon sx={{ mr: 1.5, color: '#6C63FF' }} />
            <Typography variant="body2">{securityTip}</Typography>
          </Box>
        }
      />
    </Container>
  );
};

export default Login;