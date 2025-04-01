import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Badge,
  useTheme,
  alpha,
  IconButton,
} from '@mui/material';
import { authService } from '../services/api';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import NotificationsIcon from '@mui/icons-material/Notifications';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import EmailIcon from '@mui/icons-material/Email';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Profile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // User data
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    jobTitle: '',
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    vulnerabilityAlerts: true,
    scanCompletions: true,
    weeklyReports: false,
    securityNews: false,
  });
  
  const theme = useTheme();
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // Here we'll simulate user data
        const currentUser = authService.getCurrentUser();
        
        setTimeout(() => {
          // Mock user data
          const userData = {
            id: currentUser?.id || 1,
            username: currentUser?.username || 'testuser',
            email: currentUser?.email || 'test@example.com',
            fullName: 'Test User',
            company: 'ACME Corporation',
            jobTitle: 'Security Analyst',
            role: currentUser?.role || 'user',
            createdAt: '2023-01-15T09:30:00Z',
            lastLogin: new Date().toISOString(),
            avatar: null
          };
          
          setUser(userData);
          setFormData({
            fullName: userData.fullName,
            email: userData.email,
            company: userData.company,
            jobTitle: userData.jobTitle,
          });
          
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load profile data');
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleEditToggle = () => {
    if (editMode) {
      // Cancel edit
      setFormData({
        fullName: user.fullName,
        email: user.email,
        company: user.company,
        jobTitle: user.jobTitle,
      });
    }
    setEditMode(!editMode);
    setError('');
    setSuccess(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    });
  };
  
  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    
    try {
      // In a real app, this would call an API
      // Here we'll simulate a delay and success
      setTimeout(() => {
        // Update local user data
        setUser({
          ...user,
          fullName: formData.fullName,
          email: formData.email,
          company: formData.company,
          jobTitle: formData.jobTitle,
        });
        
        setSuccess(true);
        setEditMode(false);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      setLoading(false);
    }
  };
  
  const handleSaveNotifications = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // In a real app, this would call an API
      // Here we'll simulate a delay and success
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to update notification preferences. Please try again.');
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };
  
  if (loading && !user) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          height: 'calc(100vh - 64px)' 
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
        <Typography variant="h6" color="text.secondary">
          Loading profile...
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box 
      sx={{ 
        minHeight: 'calc(100vh - 64px)',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        pt: 4,
        pb: 8
      }}
    >
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            fontWeight={700} 
            sx={{ 
              color: '#fff',
              mb: 1
            }}
          >
            User Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account settings and preferences
          </Typography>
        </Box>
        
        {/* Success & Error Messages */}
        {success && (
          <Alert 
            severity="success"
            sx={{ 
              mb: 3,
              borderRadius: 3,
              backgroundColor: 'rgba(105, 240, 174, 0.1)',
              color: '#69F0AE',
              border: '1px solid rgba(105, 240, 174, 0.2)',
              '& .MuiAlert-icon': {
                color: '#69F0AE',
              }
            }}
          >
            Changes saved successfully
          </Alert>
        )}
        
        {error && (
          <Alert 
            severity="error"
            sx={{ 
              mb: 3,
              borderRadius: 3,
              backgroundColor: 'rgba(255, 93, 115, 0.1)',
              color: '#FF5D73',
              border: '1px solid rgba(255, 93, 115, 0.2)',
              '& .MuiAlert-icon': {
                color: '#FF5D73',
              }
            }}
          >
            {error}
          </Alert>
        )}
        
        {/* Profile Info and Tabs */}
        <Grid container spacing={3}>
          {/* Profile sidebar */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                textAlign: 'center',
                mb: 3
              }}
            >
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton 
                      size="small"
                      sx={{ 
                        bgcolor: 'primary.main',
                        color: '#000',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.9),
                        }
                      }}
                    >
                      <UploadIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <Avatar
                    sx={{ 
                      width: 120, 
                      height: 120,
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                      color: theme.palette.primary.main,
                      fontSize: 48,
                      fontWeight: 'bold',
                      mb: 2
                    }}
                  >
                    {user?.fullName?.charAt(0) || user?.username?.charAt(0) || <PersonIcon fontSize="large" />}
                  </Avatar>
                </Badge>
              </Box>
              
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {user?.fullName || user?.username}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user?.jobTitle} {user?.company ? `at ${user.company}` : ''}
              </Typography>
              
              <Chip 
                label={user?.role === 'admin' ? 'Administrator' : 'User'}
                color={user?.role === 'admin' ? 'primary' : 'default'}
                size="small"
                sx={{ mt: 1 }}
              />
            </Paper>
            
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Account Information
              </Typography>
              
              <List dense disablePadding>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemText 
                    primary="Username" 
                    primaryTypographyProps={{ color: 'text.secondary' }} 
                  />
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    {user?.username}
                  </Typography>
                </ListItem>
                
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemText 
                    primary="Email" 
                    primaryTypographyProps={{ color: 'text.secondary' }} 
                  />
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    {user?.email}
                  </Typography>
                </ListItem>
                
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemText 
                    primary="Account Created" 
                    primaryTypographyProps={{ color: 'text.secondary' }} 
                  />
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    {formatDate(user?.createdAt)}
                  </Typography>
                </ListItem>
                
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemText 
                    primary="Last Login" 
                    primaryTypographyProps={{ color: 'text.secondary' }} 
                  />
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    {formatDate(user?.lastLogin)}
                  </Typography>
                </ListItem>
              </List>
              
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  fullWidth
                  sx={{ 
                    mt: 2,
                    borderRadius: 2,
                    borderColor: alpha(theme.palette.error.main, 0.5),
                    '&:hover': {
                      borderColor: theme.palette.error.main,
                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                    }
                  }}
                >
                  Delete Account
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          {/* Profile tabs */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
              }}
            >
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                sx={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  '.MuiTabs-indicator': {
                    backgroundColor: theme.palette.primary.main,
                  },
                  '.MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    '&.Mui-selected': {
                      color: theme.palette.primary.main,
                    }
                  }
                }}
              >
                <Tab icon={<PersonIcon />} label="Profile" />
                <Tab icon={<NotificationsIcon />} label="Notifications" />
                <Tab icon={<VpnKeyIcon />} label="Security" />
                <Tab icon={<HistoryIcon />} label="Activity" />
              </Tabs>
              
              {/* Profile Tab */}
              <TabPanel value={tabValue} index={0}>
                <Box sx={{ px: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Personal Information
                    </Typography>
                    <Button
                      variant={editMode ? "outlined" : "contained"}
                      color={editMode ? "error" : "primary"}
                      size="small"
                      startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                      onClick={handleEditToggle}
                      sx={{ borderRadius: 2 }}
                    >
                      {editMode ? "Cancel" : "Edit Profile"}
                    </Button>
                  </Box>
                  
                  {editMode ? (
                    <Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Full Name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            sx={{
                              '.MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                '.MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.1)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.2)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: theme.palette.primary.main,
                                }
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            sx={{
                              '.MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                '.MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.1)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.2)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: theme.palette.primary.main,
                                }
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Company"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            sx={{
                              '.MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                '.MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.1)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {borderColor: 'rgba(255, 255, 255, 0.2)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: theme.palette.primary.main,
                                }
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Job Title"
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleInputChange}
                            sx={{
                              '.MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                '.MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.1)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.2)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: theme.palette.primary.main,
                                }
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                      
                      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                          onClick={handleSaveProfile}
                          disabled={loading}
                          sx={{ borderRadius: 2 }}
                        >
                          Save Changes
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Full Name
                        </Typography>
                        <Typography variant="body1" fontWeight={500} sx={{ mb: 2 }}>
                          {user?.fullName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body1" fontWeight={500} sx={{ mb: 2 }}>
                          {user?.email}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Company
                        </Typography>
                        <Typography variant="body1" fontWeight={500} sx={{ mb: 2 }}>
                          {user?.company || 'Not specified'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Job Title
                        </Typography>
                        <Typography variant="body1" fontWeight={500} sx={{ mb: 2 }}>
                          {user?.jobTitle || 'Not specified'}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                </Box>
              </TabPanel>
              
              {/* Notifications Tab */}
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ px: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Notification Preferences
                    </Typography>
                  </Box>
                  
                  <List disablePadding>
                    <ListItem
                      secondaryAction={
                        <Switch
                          edge="end"
                          checked={notificationSettings.emailNotifications}
                          onChange={handleNotificationChange}
                          name="emailNotifications"
                          color="primary"
                        />
                      }
                      sx={{ px: 0, py: 1 }}
                    >
                      <ListItemText
                        primary="Email Notifications"
                        secondary="Receive all notifications via email"
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                    </ListItem>
                    <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.08)' }} />
                    
                    <ListItem
                      secondaryAction={
                        <Switch
                          edge="end"
                          checked={notificationSettings.vulnerabilityAlerts}
                          onChange={handleNotificationChange}
                          name="vulnerabilityAlerts"
                          color="primary"
                        />
                      }
                      sx={{ px: 0, py: 1 }}
                    >
                      <ListItemText
                        primary="Vulnerability Alerts"
                        secondary="Receive alerts when new vulnerabilities are found"
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                    </ListItem>
                    <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.08)' }} />
                    
                    <ListItem
                      secondaryAction={
                        <Switch
                          edge="end"
                          checked={notificationSettings.scanCompletions}
                          onChange={handleNotificationChange}
                          name="scanCompletions"
                          color="primary"
                        />
                      }
                      sx={{ px: 0, py: 1 }}
                    >
                      <ListItemText
                        primary="Scan Completions"
                        secondary="Receive notifications when scans are completed"
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                    </ListItem>
                    <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.08)' }} />
                    
                    <ListItem
                      secondaryAction={
                        <Switch
                          edge="end"
                          checked={notificationSettings.weeklyReports}
                          onChange={handleNotificationChange}
                          name="weeklyReports"
                          color="primary"
                        />
                      }
                      sx={{ px: 0, py: 1 }}
                    >
                      <ListItemText
                        primary="Weekly Reports"
                        secondary="Receive weekly security reports"
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                    </ListItem>
                    <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.08)' }} />
                    
                    <ListItem
                      secondaryAction={
                        <Switch
                          edge="end"
                          checked={notificationSettings.securityNews}
                          onChange={handleNotificationChange}
                          name="securityNews"
                          color="primary"
                        />
                      }
                      sx={{ px: 0, py: 1 }}
                    >
                      <ListItemText
                        primary="Security News & Updates"
                        secondary="Receive updates about new features and security news"
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                    </ListItem>
                  </List>
                  
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      onClick={handleSaveNotifications}
                      disabled={loading}
                      sx={{ borderRadius: 2 }}
                    >
                      Save Preferences
                    </Button>
                  </Box>
                </Box>
              </TabPanel>
              
              {/* Security Tab */}
              <TabPanel value={tabValue} index={2}>
                <Box sx={{ px: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Security Settings
                    </Typography>
                  </Box>
                  
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      bgcolor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      mb: 3,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Change Password
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Current Password"
                            type="password"
                            sx={{
                              '.MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                '.MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.1)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.2)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: theme.palette.primary.main,
                                }
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="New Password"
                            type="password"
                            sx={{
                              '.MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                '.MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.1)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.2)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: theme.palette.primary.main,
                                }
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Confirm New Password"
                            type="password"
                            sx={{
                              '.MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                '.MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.1)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(255, 255, 255, 0.2)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: theme.palette.primary.main,
                                }
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                      
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ borderRadius: 2 }}
                        >
                          Update Password
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                  
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      bgcolor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Two-Factor Authentication
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Box>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                          <VerifiedUserIcon color="success" sx={{ mr: 1, fontSize: 18 }} />
                          Status: <strong style={{ marginLeft: 4 }}>Not Enabled</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          Add an extra layer of security to your account
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        color="primary"
                        sx={{ borderRadius: 2 }}
                      >
                        Enable 2FA
                      </Button>
                    </Box>
                  </Paper>
                </Box>
              </TabPanel>
              
              {/* Activity Tab */}
              <TabPanel value={tabValue} index={3}>
                <Box sx={{ px: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Recent Activity
                    </Typography>
                  </Box>
                  
                  <Box sx={{ opacity: 0.7, textAlign: 'center', py: 4 }}>
                    <HistoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" fontWeight={500}>
                      Activity log coming soon
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This feature is currently under development
                    </Typography>
                  </Box>
                </Box>
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile;