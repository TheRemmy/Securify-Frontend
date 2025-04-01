import React from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// Icons
import ShieldIcon from '@mui/icons-material/Shield';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SpeedIcon from '@mui/icons-material/Speed';
import DevicesIcon from '@mui/icons-material/Devices';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';

const HomePage = () => {
  const theme = useTheme();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '100vh', md: '90vh' },
          display: 'flex',
          alignItems: 'center',
          color: '#fff',
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        }}
      >
        {/* Animated background particles */}
        <Box
          id="hero-bg"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            opacity: 0.6,
            backgroundImage: 'url(/images/network-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)',
            }
          }}
        />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 2,
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                  letterSpacing: '-0.05em',
                  lineHeight: 1.1
                }}
              >
                Enterprise-Grade Security{' '}
                <Box 
                  component="span" 
                  sx={{ 
                    color: theme.palette.primary.main,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-10px',
                      left: 0,
                      width: '100%',
                      height: '4px',
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '2px',
                    }
                  }}
                >
                  Monitoring
                </Box>
              </Typography>
              
              <Typography 
                variant="h4" 
                component="h2" 
                color="text.secondary"
                sx={{ 
                  fontWeight: 400, 
                  mb: 4, 
                  maxWidth: 600,
                  fontSize: { xs: '1.2rem', sm: '1.5rem' },
                  letterSpacing: '-0.02em',
                  lineHeight: 1.4
                }}
              >
                Advanced threat detection with intelligent scanning for modern enterprises
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 6 }}>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  size="large"
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  Live Demo
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ShieldIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="body1" fontWeight={500}>
                      Advanced Scanning
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SecurityIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="body1" fontWeight={500}>
                      Real-time Protection
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <VerifiedUserIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="body1" fontWeight={500}>
                      Compliance Ready
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            
            <Grid 
              item 
              xs={12} 
              md={5}
              sx={{
                display: { xs: 'none', md: 'block' }
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-20px',
                    left: '-20px',
                    right: '20px',
                    bottom: '20px',
                    border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    borderRadius: 4,
                    zIndex: 0
                  }
                }}
              >
                <Box
                  component="img"
                  src="/images/dashboard-preview.jpg"
                  alt="Security Dashboard Preview"
                  sx={{
                    width: '100%',
                    borderRadius: 4,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    position: 'relative',
                    zIndex: 1
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Box
        sx={{
          py: 10,
          backgroundColor: '#0F172A',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h6"
              component="p"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                mb: 2,
                textTransform: 'uppercase',
                letterSpacing: 1
              }}
            >
              Key Features
            </Typography>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: 'white'
              }}
            >
              Enterprise-grade security tools
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                maxWidth: 700,
                mx: 'auto'
              }}
            >
              Our platform provides comprehensive security scanning and monitoring capabilities to protect your infrastructure from emerging threats.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {/* Feature 1 */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    borderColor: alpha(theme.palette.primary.main, 0.3)
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3
                    }}
                  >
                    <SpeedIcon sx={{ fontSize: 30, color: theme.palette.primary.main }} />
                  </Box>
                  
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      mb: 2
                    }}
                  >
                    Advanced Port Scanning
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Identify open ports and services running on your network with precise detection and minimal false positives.
                  </Typography>
                  
                  <List dense disablePadding>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Comprehensive port scanning" 
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Service version detection" 
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Operating system fingerprinting" 
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Feature 2 */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    borderColor: alpha(theme.palette.primary.main, 0.3)
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3
                    }}
                  >
                    <LockIcon sx={{ fontSize: 30, color: theme.palette.primary.main }} />
                  </Box>
                  
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      mb: 2
                    }}
                  >
                    Vulnerability Detection
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Discover vulnerabilities in your systems before attackers can exploit them with our advanced detection engine.
                  </Typography>
                  
                  <List dense disablePadding>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="CVE database integration" 
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Risk assessment scoring" 
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Detailed remediation guidance" 
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Feature 3 */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    borderColor: alpha(theme.palette.primary.main, 0.3)
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3
                    }}
                  >
                    <DevicesIcon sx={{ fontSize: 30, color: theme.palette.primary.main }} />
                  </Box>
                  
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      mb: 2
                    }}
                  >
                    Multi-platform Support
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Protect your entire infrastructure with support for various operating systems and device types.
                  </Typography>
                  
                  <List dense disablePadding>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Windows, Linux & macOS" 
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Network device scanning" 
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Cloud services monitoring" 
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          backgroundImage: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.1,
            backgroundImage: 'url(/images/cyber-pattern.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(10px)',
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: 'white',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                }}
              >
                Ready to secure your infrastructure?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  mb: 4,
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                }}
              >
                Get started with SecureScan today and discover vulnerabilities before attackers do.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                  }}
                >
                  Start Free Trial
                </Button>
                <Button
                  component={RouterLink}
                  to="/contact"
                  variant="outlined"
                  size="large"
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  Contact Sales
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                component="img"
                src="/images/security-illustration.svg"
                alt="Security Illustration"
                sx={{
                  width: '100%',
                  maxWidth: 400,
                  mx: 'auto',
                  display: 'block'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Testimonials Section */}
      <Box
        sx={{
          py: 10,
          backgroundColor: '#0A0F18',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h6"
              component="p"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                mb: 2,
                textTransform: 'uppercase',
                letterSpacing: 1
              }}
            >
              Testimonials
            </Typography>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: 'white'
              }}
            >
              Trusted by security professionals
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                maxWidth: 700,
                mx: 'auto'
              }}
            >
              See what security teams at leading companies have to say about our platform.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {/* Testimonial 1 */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Box
                      component="img"
                      src="/images/testimonial-avatar-1.jpg"
                      alt="Alex Johnson"
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        mr: 2,
                        objectFit: 'cover'
                      }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Alex Johnson
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        CISO at TechCorp
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      fontStyle: 'italic',
                      mb: 2,
                      color: 'text.secondary',
                      '&::before': {
                        content: '"""',
                        fontSize: '2rem',
                        color: alpha(theme.palette.primary.main, 0.5),
                        lineHeight: 0,
                        verticalAlign: 'middle',
                        mr: 1
                      },
                      '&::after': {
                        content: '"""',
                        fontSize: '2rem',
                        color: alpha(theme.palette.primary.main, 0.5),
                        lineHeight: 0,
                        verticalAlign: 'middle',
                        ml: 1
                      }
                    }}
                  >
                    SecureScan has transformed our security operations. We now have complete visibility of our infrastructure vulnerabilities.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Testimonial 2 */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Box
                      component="img"
                      src="/images/testimonial-avatar-2.jpg"
                      alt="Sarah Chen"
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        mr: 2,
                        objectFit: 'cover'
                      }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Sarah Chen
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Security Engineer at DataSafe
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      fontStyle: 'italic',
                      mb: 2,
                      color: 'text.secondary',
                      '&::before': {
                        content: '"""',
                        fontSize: '2rem',
                        color: alpha(theme.palette.primary.main, 0.5),
                        lineHeight: 0,
                        verticalAlign: 'middle',
                        mr: 1
                      },
                      '&::after': {
                        content: '"""',
                        fontSize: '2rem',
                        color: alpha(theme.palette.primary.main, 0.5),
                        lineHeight: 0,
                        verticalAlign: 'middle',
                        ml: 1
                      }
                    }}
                  >
                    The detailed reports and remediation suggestions make it easy to prioritize our security efforts and fix critical issues quickly.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Testimonial 3 */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Box
                      component="img"
                      src="/images/testimonial-avatar-3.jpg"
                      alt="Michael Rodriguez"
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        mr: 2,
                        objectFit: 'cover'
                      }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Michael Rodriguez
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        IT Director at GlobalFinance
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      fontStyle: 'italic',
                      mb: 2,
                      color: 'text.secondary',
                      '&::before': {
                        content: '"""',
                        fontSize: '2rem',
                        color: alpha(theme.palette.primary.main, 0.5),
                        lineHeight: 0,
                        verticalAlign: 'middle',
                        mr: 1
                      },
                      '&::after': {
                        content: '"""',
                        fontSize: '2rem',
                        color: alpha(theme.palette.primary.main, 0.5),
                        lineHeight: 0,
                        verticalAlign: 'middle',
                        ml: 1
                      }
                    }}
                  >
                    SecureScan helped us achieve compliance with multiple regulatory standards while significantly improving our security posture.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;