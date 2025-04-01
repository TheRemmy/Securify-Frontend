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
  Snackbar,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { authService } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ShieldIcon from '@mui/icons-material/Shield';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EmailIcon from '@mui/icons-material/Email';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formFocus, setFormFocus] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [securityTip, setSecurityTip] = useState('');
  const [showTip, setShowTip] = useState(false);
  const formRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const securityTips = [
    "Use a unique password that you don't use for other accounts.",
    "Consider using a password manager to generate and store complex passwords.",
    "Enable two-factor authentication after registration for extra security.",
    "Regular security audits help identify potential vulnerabilities.",
    "Keep your device and browser updated for the best security."
  ];

  const steps = [
    'Account details',
    'Password setup',
    'Confirmation'
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
    // Advanced 3D network visualization - same as in Login component
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
      
      // Draw connections first
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

  const handleFormFocus = () => {
    setFormFocus(true);
  };

  const handleCloseTip = () => {
    setShowTip(false);
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        // Validate account details
        if (!username || !email) {
          setError('Please provide both username and email');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setError('Please enter a valid email address');
          return false;
        }
        return true;
      case 1:
        // Validate password
        if (!password || !confirmPassword) {
          setError('Please provide both password and confirmation');
          return false;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        if (password.length < 8) {
          setError('Password must be at least 8 characters long');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setError('');
      if (activeStep === steps.length - 1) {
        handleRegister();
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError('');
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Simulate API call
      await authService.register(username, email, password);
      
      // Show success state
      setRegistrationComplete(true);
      
      // Navigate after 2 seconds
      setTimeout(() => {
        navigate('/login', { state: { registered: true } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography 
              variant="subtitle1"
              sx={{
                mb: 2,
                color: alpha('#fff', 0.9),
              }}
            >
              Let's create your account. Start with your basic details.
            </Typography>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              placeholder="Choose a unique username"
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleIcon sx={{ color: alpha('#6C63FF', 0.7), ml: 0.5 }} />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              placeholder="Enter your email address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: alpha('#6C63FF', 0.7), ml: 0.5 }} />
                  </InputAdornment>
                ),
              }}
            />
            
            <Box 
              sx={{ 
                p: 2.5, 
                borderRadius: 3, 
                background: 'rgba(108, 99, 255, 0.08)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(108, 99, 255, 0.2)',
                mb: 3,
                display: 'flex',
                alignItems: 'flex-start'
              }}
            >
              <InfoOutlinedIcon 
                sx={{ 
                  color: '#6C63FF', 
                  mr: 1.5, 
                  mt: 0.3 
                }}
              />
              <Typography 
                variant="body2"
                sx={{
                  color: alpha('#94A3B8', 0.9),
                  lineHeight: 1.5
                }}
              >
                Your email will be used for account recovery, important security notifications, and to verify your identity.
              </Typography>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography 
              variant="subtitle1"
              sx={{
                mb: 2,
                color: alpha('#fff', 0.9),
              }}
            >
              Now let's set up a secure password for your account.
            </Typography>
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Create a strong password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: alpha('#6C63FF', 0.7), ml: 0.5 }} />
                  </InputAdornment>
                ),
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
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              placeholder="Confirm your password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: alpha('#6C63FF', 0.7), ml: 0.5 }} />
                  </InputAdornment>
                ),
              }}
            />
            
            <Box 
              sx={{ 
                p: 2.5, 
                borderRadius: 3, 
                background: 'rgba(8, 217, 214, 0.08)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(8, 217, 214, 0.2)',
                mb: 3
              }}
            >
              <Typography 
                variant="subtitle2"
                sx={{
                  color: '#08D9D6',
                  mb: 1,
                  fontWeight: 600
                }}
              >
                Password strength tips:
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                <Typography 
                  component="li" 
                  variant="body2"
                  sx={{
                    color: alpha('#94A3B8', 0.9),
                    mb: 0.5
                  }}
                >
                  Use at least 8 characters
                </Typography>
                <Typography 
                  component="li" 
                  variant="body2"
                  sx={{
                    color: alpha('#94A3B8', 0.9),
                    mb: 0.5
                  }}
                >
                  Include uppercase and lowercase letters
                </Typography>
                <Typography 
                  component="li" 
                  variant="body2"
                  sx={{
                    color: alpha('#94A3B8', 0.9),
                    mb: 0.5
                  }}
                >
                  Add numbers and special characters
                </Typography>
                <Typography 
                  component="li" 
                  variant="body2"
                  sx={{
                    color: alpha('#94A3B8', 0.9)
                  }}
                >
                  Avoid using easily guessable information
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography 
              variant="subtitle1"
              sx={{
                mb: 3,
                color: alpha('#fff', 0.9),
              }}
            >
              Please review your information before creating your account.
            </Typography>
            
            <Box 
              sx={{ 
                py: 2,
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <Typography 
                variant="body2"
                sx={{
                  color: alpha('#94A3B8', 0.8),
                  mb: 0.5
                }}
              >
                Username
              </Typography>
              <Typography 
                variant="subtitle2"
                sx={{
                  color: '#fff',
                  fontWeight: 600
                }}
              >
                {username}
              </Typography>
            </Box>
            
            <Box 
              sx={{ 
                py: 2,
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <Typography 
                variant="body2"
                sx={{
                  color: alpha('#94A3B8', 0.8),
                  mb: 0.5
                }}
              >
                Email Address
              </Typography>
              <Typography 
                variant="subtitle2"
                sx={{
                  color: '#fff',
                  fontWeight: 600
                }}
              >
                {email}
              </Typography>
            </Box>
            
            <Box 
              sx={{ 
                py: 2,
                mb: 3
              }}
            >
              <Typography 
                variant="body2"
                sx={{
                  color: alpha('#94A3B8', 0.8),
                  mb: 0.5
                }}
              >
                Password
              </Typography>
              <Typography 
                variant="subtitle2"
                sx={{
                  color: '#fff',
                  fontWeight: 600
                }}
              >
                ••••••••
              </Typography>
            </Box>
            
            <Box 
              sx={{ 
                p: 2.5, 
                borderRadius: 3, 
                background: 'rgba(108, 99, 255, 0.08)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(108, 99, 255, 0.2)',
                mb: 3,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ShieldIcon 
                sx={{ 
                  color: '#6C63FF', 
                  mr: 1.5, 
                  fontSize: 24
                }}
              />
              <Typography 
                variant="body2"
                sx={{
                  color: alpha('#fff', 0.9),
                  fontWeight: 500
                }}
              >
                By clicking "Create Account", you agree to our Terms of Service and Privacy Policy.
              </Typography>
            </Box>
          </Box>
        );
      default:
        return null;
    }
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
      
      {/* Glowing orbs - same as in Login */}
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
          top: { xs: '5%', md: '50%' },
          left: { xs: '50%', md: '50%' },
          transform: { xs: 'translate(-50%, 0)', md: 'translate(-50%, -50%)' },
          width: { xs: '90%', sm: '90%', md: '75%', lg: '70%', xl: '60%' },
          maxWidth: '1000px',
          zIndex: 2
        }}
      >
        <Grow in={mounted} timeout={800}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            mb: { xs: 2, md: 4 }
          }}>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 800,
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #94A3B8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
                fontSize: { xs: '2rem', sm: '2.5rem' },
                textAlign: 'center'
              }}
            >
              Create your SecureScan account
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: alpha('#94A3B8', 0.9),
                maxWidth: '450px',
                textAlign: 'center',
                fontWeight: 500
              }}
            >
              Join the most advanced security platform for enterprise threat detection
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
            {!registrationComplete ? (
              <>
                <Box sx={{ p: { xs: 3, sm: 5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <PersonAddIcon 
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
                      Sign up
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

                  <Stepper 
                    activeStep={activeStep} 
                    alternativeLabel
                    sx={{
                      mb: 4,
                      '& .MuiStepLabel-root .Mui-completed': {
                        color: '#6C63FF', // circle color (COMPLETED)
                      },
                      '& .MuiStepLabel-root .Mui-active': {
                        color: '#6C63FF', // circle color (ACTIVE)
                      },
                      '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel': {
                        color: 'white', // text color (ACTIVE)
                      },
                      '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                        fill: 'black', // number color (ACTIVE)
                      },
                      '& .MuiStepConnector-line': {
                        borderColor: 'rgba(255, 255, 255, 0.1)'
                      },
                      '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                        borderColor: '#6C63FF'
                      },
                      '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                        borderColor: '#6C63FF'
                      }
                    }}
                  >
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                  
                  {renderStepContent(activeStep)}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      startIcon={<ArrowBackIcon />}
                      sx={{
                        color: '#FFF',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 3,
                        px: 3,
                        py: 1.5,
                        '&:hover': {
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)'
                        }
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      endIcon={<ArrowForwardIcon />}
                      sx={{ 
                        py: 1.5,
                        px: 3,
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
                          animation: 'shine 3s infinite',
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
                      {activeStep === steps.length - 1 ? 'Create Account' : 'Next'}
                    </Button>
                  </Box>
                </Box>
                
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                
                <Box sx={{ py: 3, px: 4, textAlign: 'center', backgroundColor: 'rgba(15, 23, 42, 0.3)' }}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link to="/login" style={{ textDecoration: 'none' }}>
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
                        Sign in
                      </Typography>
                    </Link>
                  </Typography>
                </Box>
              </>
            ) : (
              <Box sx={{ 
                p: 5, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <Zoom in={registrationComplete} timeout={500}>
                  <Box sx={{ 
                    width: 100, 
                    height: 100, 
                    borderRadius: '50%', 
                    bgcolor: 'rgba(8, 217, 214, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    border: '1px solid rgba(8, 217, 214, 0.3)',
                  }}>
                    <CheckCircleIcon sx={{ color: '#08D9D6', fontSize: 50 }} />
                  </Box>
                </Zoom>
                <Typography 
                  variant="h4" 
                  component="div" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 2, 
                    color: '#FFF' 
                  }}
                >
                  Account Created!
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  sx={{ 
                    maxWidth: '400px', 
                    mx: 'auto',
                    mb: 3
                  }}
                >
                  Congratulations! Your account has been successfully created. You will be redirected to the login page shortly.
                </Typography>
                <CircularProgress 
                  color="primary" 
                  size={24} 
                  thickness={4} 
                />
              </Box>
            )}
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
      
      {/* Loading backdrop */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: 10,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(10, 15, 30, 0.85)',
        }}
        open={loading && !registrationComplete}
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
            Creating your account
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ maxWidth: '280px', mx: 'auto', mb: 3 }}
          >
            Setting up your secure account, this will just take a moment...
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

export default Register;