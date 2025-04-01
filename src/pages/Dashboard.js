import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Card, 
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  LinearProgress,
  CircularProgress,
  useTheme,
  alpha,
  Menu,
  MenuItem,
  Snackbar,
  Alert as MuiAlert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { scanService, authService } from '../services/api';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import SecurityIcon from '@mui/icons-material/Security';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import FlagIcon from '@mui/icons-material/Flag';
import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Shield';
import FilterListIcon from '@mui/icons-material/FilterList';
import InfoIcon from '@mui/icons-material/Info';

// Alert component
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  
  const theme = useTheme();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  // Функция для загрузки данных дашборда
  const loadDashboardData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    setError(null);
    
    try {
      // Получаем данные с бэкенда
      const data = await scanService.getDashboardData();
      setDashboardData(data);
      
      if (showRefreshing) {
        setAlertMessage('Dashboard data refreshed successfully');
        setAlertSeverity('success');
        setAlertOpen(true);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
      
      if (showRefreshing) {
        setAlertMessage('Failed to refresh dashboard data');
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    } finally {
      if (showRefreshing) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadDashboardData();
    
    // Устанавливаем интервал обновления данных каждые 5 минут
    const refreshInterval = setInterval(() => {
      loadDashboardData(true);
    }, 5 * 60 * 1000);
    
    // Очищаем интервал при размонтировании компонента
    return () => {
      clearInterval(refreshInterval);
    };
  }, [loadDashboardData]);

  // Обработчики событий
  const handleRefresh = () => {
    loadDashboardData(true);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNewScan = () => {
    navigate('/scans/new');
  };

  const handleViewAllScans = () => {
    navigate('/scans');
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const handleViewAlert = (alertId) => {
    // В реальном приложении можно было бы перейти к деталям оповещения
    console.log('View alert:', alertId);
    handleMenuClose();
  };

  const handleMarkAllRead = () => {
    setAlertMessage('All alerts marked as read');
    setAlertSeverity('success');
    setAlertOpen(true);
    handleMenuClose();
  };

  // Вспомогательные функции
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(date);
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid date';
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'completed':
        return <Chip 
          size="small" 
          label="Completed" 
          color="success"
          icon={<CheckCircleIcon />}
          sx={{ fontWeight: 500 }}
        />;
      case 'running':
        return <Chip 
          size="small" 
          label="Running" 
          color="info"
          icon={<RefreshIcon />}
          sx={{ fontWeight: 500 }}
        />;
      case 'failed':
        return <Chip 
          size="small" 
          label="Failed" 
          color="error"
          icon={<ErrorIcon />}
          sx={{ fontWeight: 500 }}
        />;
      case 'scheduled':
        return <Chip 
          size="small" 
          label="Scheduled" 
          color="warning"
          icon={<ScheduleIcon />}
          sx={{ fontWeight: 500 }}
        />;
      case 'queued':
        return <Chip 
          size="small" 
          label="Queued" 
          color="info"
          icon={<InfoIcon />}
          sx={{ fontWeight: 500 }}
        />;
      case 'active':
        return <Chip 
          size="small" 
          label="Active" 
          color="warning"
          sx={{ fontWeight: 500 }}
        />;
      default:
        return <Chip 
          size="small" 
          label={status || 'Unknown'} 
          color="default"
          sx={{ fontWeight: 500 }}
        />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.info.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  // Отображение состояния загрузки
  if (loading) {
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
          Loading security dashboard...
        </Typography>
      </Box>
    );
  }

  // Отображение ошибки
  if (error) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          height: 'calc(100vh - 64px)',
          px: 3
        }}
      >
        <ErrorIcon sx={{ fontSize: 60, color: theme.palette.error.main, mb: 3 }} />
        <Typography variant="h6" color="error" gutterBottom align="center">
          {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => loadDashboardData()}
          startIcon={<RefreshIcon />}
          sx={{ mt: 2, borderRadius: 2 }}
        >
          Retry
        </Button>
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
      <Container maxWidth="xl">
        {/* Dashboard Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              fontWeight={700} 
              sx={{ 
                color: '#fff',
                mb: 1
              }}
            >
              Security Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back, {currentUser?.fullName || currentUser?.username || 'User'}. Here's your security overview for today.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleNewScan}
            sx={{
              borderRadius: 2,
              py: 1.25,
              px: 3
            }}
          >
            New Scan
          </Button>
        </Box>

        {/* Security Score and Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Security Score */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 4,
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  Security Score
                </Typography>
                <IconButton 
                  size="small" 
                  sx={{ color: 'text.secondary' }}
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  {refreshing ? 
                    <CircularProgress size={20} sx={{ color: 'text.secondary' }} /> : 
                    <RefreshIcon fontSize="small" />
                  }
                </IconButton>
              </Box>
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                <CircularProgress
                  variant="determinate"
                  value={dashboardData?.securityScore || 0}
                  size={120}
                  thickness={6}
                  sx={{
                    color: (dashboardData?.securityScore || 0) > 70 
                      ? theme.palette.success.main 
                      : (dashboardData?.securityScore || 0) > 50 
                        ? theme.palette.warning.main 
                        : theme.palette.error.main,
                    // Add a background track
                    backgroundColor: alpha(theme.palette.divider, 0.2),
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="h4"
                    component="div"
                    fontWeight="bold"
                    color="text.primary"
                  >
                    {dashboardData?.securityScore || 0}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="body1" fontWeight={600} color="text.primary" sx={{ mr: 1 }}>
                  Status: {dashboardData?.securityStatus || 'Unknown'}
                </Typography>
                {dashboardData?.securityScoreChange > 0 ? (
                  <Chip 
                    icon={<ArrowUpwardIcon fontSize="small" />} 
                    label={`+${dashboardData.securityScoreChange}%`} 
                    size="small" 
                    sx={{ 
                      backgroundColor: alpha(theme.palette.success.main, 0.2),
                      color: theme.palette.success.main,
                      fontWeight: 600,
                    }} 
                  />
                ) : (
                  <Chip 
                    icon={<ArrowDownwardIcon fontSize="small" />} 
                    label={`${dashboardData?.securityScoreChange || 0}%`} 
                    size="small" 
                    sx={{ 
                      backgroundColor: alpha(theme.palette.error.main, 0.2),
                      color: theme.palette.error.main,
                      fontWeight: 600,
                    }} 
                  />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">
                Your security score has {(dashboardData?.securityScoreChange || 0) >= 0 ? 'improved' : 'decreased'} by {Math.abs(dashboardData?.securityScoreChange || 0)}% since last month.
              </Typography>
            </Paper>
          </Grid>
          
          {/* Vulnerability Summary */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 4,
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  Vulnerabilities
                </Typography>
                <IconButton 
                  size="small" 
                  sx={{ color: 'text.secondary' }}
                  onClick={() => navigate('/scans')}
                  title="View all vulnerabilities"
                >
                  <FilterListIcon fontSize="small" />
                </IconButton>
              </Box>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center', p: 1, borderRadius: 2, bgcolor: alpha(theme.palette.error.main, 0.1) }}>
                    <Typography variant="h4" component="div" fontWeight="bold" color={theme.palette.error.main}>
                      {dashboardData?.vulnerabilities?.high || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      High
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center', p: 1, borderRadius: 2, bgcolor: alpha(theme.palette.warning.main, 0.1) }}>
                    <Typography variant="h4" component="div" fontWeight="bold" color={theme.palette.warning.main}>
                      {dashboardData?.vulnerabilities?.medium || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Medium
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center', p: 1, borderRadius: 2, bgcolor: alpha(theme.palette.info.main, 0.1) }}>
                    <Typography variant="h4" component="div" fontWeight="bold" color={theme.palette.info.main}>
                      {dashboardData?.vulnerabilities?.low || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Low
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.08)' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Vulnerabilities
                </Typography>
                <Typography variant="body1" fontWeight={600} color="text.primary">
                  {dashboardData?.vulnerabilities?.total || 0}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Resolved this month
                </Typography>
                <Typography variant="body1" fontWeight={600} color={theme.palette.success.main}>
                  {dashboardData?.vulnerabilities?.resolved || 0}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          {/* Quick Stats */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 4,
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 3 }}>
                Security Stats
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: alpha(theme.palette.primary.main, 0.1),
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                      mb: 2
                    }}
                  >
                    <Typography variant="h4" component="div" fontWeight="bold" color="text.primary">
                      {dashboardData?.securedAssets || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Secured Assets
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: alpha(theme.palette.info.main, 0.1),
                      borderLeft: `4px solid ${theme.palette.info.main}`,
                      mb: 2
                    }}
                  >
                    <Typography variant="h4" component="div" fontWeight="bold" color="text.primary">
                      {dashboardData?.monitoredEndpoints || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Endpoints
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: alpha(theme.palette.warning.main, 0.1),
                      borderLeft: `4px solid ${theme.palette.warning.main}`,
                    }}
                  >
                    <Typography variant="h4" component="div" fontWeight="bold" color="text.primary">
                      {dashboardData?.scanCount || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Scans
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: alpha(theme.palette.success.main, 0.1),
                      borderLeft: `4px solid ${theme.palette.success.main}`,
                    }}
                  >
                    <Typography variant="h4" component="div" fontWeight="bold" color="text.primary">
                      {dashboardData?.scheduleScans || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Scheduled
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* Recent Scans and Critical Alerts */}
        <Grid container spacing={3}>
          {/* Recent Scans */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: 0,
                borderRadius: 4,
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  Recent Scans
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={handleViewAllScans}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    '&:hover': {
                      borderColor: 'primary.main',
                    }
                  }}
                >
                  View All
                </Button>
              </Box>
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />
              <List sx={{ p: 0 }}>
                {dashboardData?.recentScans && dashboardData.recentScans.length > 0 ? (
                  dashboardData.recentScans.map((scan, index) => (
                    <React.Fragment key={scan.id}>
                      <ListItem 
                        sx={{ 
                          py: 2,
                          px: 3,
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          },
                          cursor: 'pointer'
                        }}
                        onClick={() => navigate(`/scans/${scan.id}`)}
                      >
                        <ListItemIcon>
                        <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: 'rgba(108, 99, 255, 0.1)',
                              color: theme.palette.primary.main
                            }}
                          >
                            <SecurityIcon />
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                              {scan.target}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                                {scan.type}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                                {formatDate(scan.date)}
                              </Typography>
                              {getStatusChip(scan.status)}
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {scan.findings?.high > 0 && (
                              <Chip
                                size="small"
                                label={scan.findings.high}
                                sx={{
                                  bgcolor: alpha(theme.palette.error.main, 0.1),
                                  color: theme.palette.error.main,
                                  mr: 1,
                                  fontWeight: 600,
                                  minWidth: 30
                                }}
                              />
                            )}
                            {scan.findings?.medium > 0 && (
                              <Chip
                                size="small"
                                label={scan.findings.medium}
                                sx={{
                                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                                  color: theme.palette.warning.main,
                                  mr: 1,
                                  fontWeight: 600,
                                  minWidth: 30
                                }}
                              />
                            )}
                            {scan.findings?.low > 0 && (
                              <Chip
                                size="small"
                                label={scan.findings.low}
                                sx={{
                                  bgcolor: alpha(theme.palette.info.main, 0.1),
                                  color: theme.palette.info.main,
                                  fontWeight: 600,
                                  minWidth: 30
                                }}
                              />
                            )}
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < (dashboardData.recentScans.length - 1) && (
                        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      No recent scans found
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={handleNewScan}
                      sx={{ mt: 2, borderRadius: 2 }}
                    >
                      Start New Scan
                    </Button>
                  </Box>
                )}
              </List>
            </Paper>
          </Grid>
          
          {/* Critical Alerts */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 0,
                borderRadius: 4,
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
                height: '100%',
              }}
            >
              <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  Critical Alerts
                </Typography>
                <IconButton 
                  size="small" 
                  sx={{ color: 'text.secondary' }}
                  onClick={handleMenuClick}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      backgroundImage: 'none',
                      backgroundColor: 'background.paper',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <MenuItem onClick={handleViewAllScans}>View All Alerts</MenuItem>
                  <MenuItem onClick={handleMarkAllRead}>Mark All as Read</MenuItem>
                  <MenuItem onClick={handleMenuClose}>Alert Settings</MenuItem>
                </Menu>
              </Box>
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />
              <List sx={{ p: 0 }}>
                {dashboardData?.criticalAlerts && dashboardData.criticalAlerts.length > 0 ? (
                  dashboardData.criticalAlerts.map((alert, index) => (
                    <React.Fragment key={alert.id}>
                      <ListItem 
                        sx={{ 
                          py: 2,
                          px: 3,
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          },
                          cursor: 'pointer'
                        }}
                        onClick={() => handleViewAlert(alert.id)}
                      >
                        <ListItemIcon>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: alpha(getSeverityColor(alert.severity), 0.1),
                              color: getSeverityColor(alert.severity)
                            }}
                          >
                            <WarningAmberIcon />
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                              {alert.title}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 0.5 }}>
                              <Typography variant="body2" color="text.secondary">
                                {alert.target}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                                  {alert.time}
                                </Typography>
                                {getStatusChip(alert.status)}
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < (dashboardData.criticalAlerts.length - 1) && (
                        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <CheckCircleIcon 
                      sx={{ 
                        fontSize: 48, 
                        color: theme.palette.success.main,
                        mb: 1
                      }} 
                    />
                    <Typography variant="body1" color="text.primary" fontWeight={600}>
                      No Critical Alerts
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your environment is secure
                    </Typography>
                  </Box>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Security Trend Chart (можно добавить в будущем) */}
        {dashboardData?.securityTrend && dashboardData.securityTrend.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mt: 4,
              borderRadius: 4,
              background: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 2 }}>
              Security Score Trend
            </Typography>
            <Box sx={{ height: 100, p: 2 }}>
              {/* Визуализация тренда безопасности */}
              <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%', gap: 2 }}>
                {dashboardData.securityTrend.map((score, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: 1,
                      height: `${score}%`,
                      bgcolor: score > 70 
                        ? theme.palette.success.main 
                        : score > 50 
                          ? theme.palette.warning.main 
                          : theme.palette.error.main,
                      borderRadius: '4px 4px 0 0',
                      position: 'relative',
                      transition: 'height 0.3s ease-in-out',
                      '&:hover': {
                        opacity: 0.8,
                        '& .scoreLabel': {
                          opacity: 1
                        }
                      }
                    }}
                  >
                    <Typography 
                      className="scoreLabel"
                      variant="caption" 
                      sx={{ 
                        position: 'absolute', 
                        top: -20, 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        fontWeight: 'bold'
                      }}
                    >
                      {score}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
        )}
      </Container>

      {/* Notification Snackbar */}
      <Snackbar 
        open={alertOpen} 
        autoHideDuration={6000} 
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;