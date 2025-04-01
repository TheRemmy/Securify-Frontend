import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    Chip,
    CircularProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    LinearProgress,
    Tab,
    Tabs,
    alpha,
    useTheme,
    IconButton,
    Tooltip,
    Select,
    MenuItem,
    FormControl,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
  } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { scanService } from '../services/api';

// Icons
import SecurityIcon from '@mui/icons-material/Security';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WebIcon from '@mui/icons-material/Web';
import StorageIcon from '@mui/icons-material/Storage';
import RouterIcon from '@mui/icons-material/Router';
import DnsIcon from '@mui/icons-material/Dns';
import LockIcon from '@mui/icons-material/Lock';
import HttpIcon from '@mui/icons-material/Http';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import BugReportIcon from '@mui/icons-material/BugReport';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scan-tabpanel-${index}`}
      aria-labelledby={`scan-tab-${index}`}
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

// Generate mock scan detail
const generateMockScanDetail = (id) => {
  // Base scan info
  const scanTypes = ['Basic Scan', 'Full Scan', 'Web Scan'];
  const scanType = scanTypes[Math.floor(Math.random() * scanTypes.length)];
  
  const targets = [
    'web-server.example.com',
    'api.example.com',
    'database.example.com',
  ];
  const target = targets[Math.floor(Math.random() * targets.length)];
  
  // Random date within last 30 days
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  
  // Random duration
  const duration = Math.floor(Math.random() * 300) + 30; // 30 to 330 seconds
  
  // Generate findings
  const generateVulnerabilities = () => {
    const vulnerabilityTypes = [
      {
        name: 'Open SSH Port',
        description: 'SSH port (22) is open and accessible from the internet',
        severity: 'medium',
        details: 'Port 22 (SSH) is open and accessible. Consider restricting access or implementing strong authentication.',
        category: 'network',
        remediation: 'Restrict SSH access to specific IP addresses or implement key-based authentication with strong passwords.'
      },
      {
        name: 'SSL Certificate Expiring Soon',
        description: 'The SSL certificate will expire in the next 30 days',
        severity: 'medium',
        details: 'SSL certificate for this hostname will expire on ' + new Date(date.getTime() + 86400000 * 25).toLocaleDateString(),
        category: 'web',
        remediation: 'Renew the SSL certificate before expiration date to avoid service disruption.'
      },
      {
        name: 'Outdated Software Version',
        description: 'The web server is running an outdated version with known vulnerabilities',
        severity: 'high',
        details: 'Apache version 2.4.29 detected. This version has known vulnerabilities including CVE-2021-44790.',
        category: 'web',
        remediation: 'Update the web server to the latest stable version to patch known vulnerabilities.'
      },
      {
        name: 'Missing Security Headers',
        description: 'Important security headers are missing from HTTP responses',
        severity: 'low',
        details: 'The following security headers are missing: Content-Security-Policy, X-XSS-Protection',
        category: 'web',
        remediation: 'Configure the web server to include proper security headers in all HTTP responses.'
      },
      {
        name: 'Cross-Site Scripting (XSS) Vulnerability',
        description: 'Potential XSS vulnerability found in web application',
        severity: 'high',
        details: 'Input parameters are not properly sanitized, allowing potential JavaScript injection.',
        category: 'web',
        remediation: 'Implement proper input validation and output encoding to prevent XSS attacks.'
      },
      {
        name: 'Database Port Exposed',
        description: 'Database port is accessible from external networks',
        severity: 'high',
        details: 'Port 3306 (MySQL) is exposed to the internet, potentially allowing unauthorized access.',
        category: 'database',
        remediation: 'Configure firewall rules to restrict database access to only trusted sources.'
      },
      {
        name: 'Insecure FTP Service',
        description: 'FTP service is running without encryption',
        severity: 'medium',
        details: 'Plain text FTP service detected on port 21. This can lead to credential sniffing.',
        category: 'network',
        remediation: 'Replace FTP with SFTP or FTPS for secure file transfers.'
      },
      {
        name: 'Default Credentials',
        description: 'Service may be using default credentials',
        severity: 'high',
        details: 'Default or common credentials were accepted for login to the administrative interface.',
        category: 'authentication',
        remediation: 'Change all default passwords and implement a strong password policy.'
      },
      {
        name: 'Directory Listing Enabled',
        description: 'Web server directory listing is enabled',
        severity: 'low',
        details: 'Directory listing is enabled on the web server, exposing file structure.',
        category: 'web',
        remediation: 'Disable directory listing in the web server configuration.'
      },
      {
        name: 'Outdated TLS Version',
        description: 'Server supports outdated TLS protocols',
        severity: 'medium',
        details: 'TLS 1.0 and 1.1 are supported, which have known vulnerabilities.',
        category: 'encryption',
        remediation: 'Disable TLS 1.0 and 1.1, and only support TLS 1.2 and newer versions.'
      }
    ];
    
    // Randomly select 0-10 vulnerabilities
    const numVulnerabilities = Math.floor(Math.random() * 10);
    const selectedIndices = [];
    
    while (selectedIndices.length < numVulnerabilities && selectedIndices.length < vulnerabilityTypes.length) {
      const index = Math.floor(Math.random() * vulnerabilityTypes.length);
      if (!selectedIndices.includes(index)) {
        selectedIndices.push(index);
      }
    }
    
    return selectedIndices.map(index => ({
      id: `vuln-${index + 1}`,
      ...vulnerabilityTypes[index],
      dateDiscovered: new Date(date.getTime() - Math.floor(Math.random() * 86400000 * 10)).toISOString(),
      status: Math.random() > 0.3 ? 'open' : 'resolved'
    }));
  };
  
  const vulnerabilities = generateVulnerabilities();
  
  // Count vulnerabilities by severity
  const high = vulnerabilities.filter(v => v.severity === 'high' && v.status === 'open').length;
  const medium = vulnerabilities.filter(v => v.severity === 'medium' && v.status === 'open').length;
  const low = vulnerabilities.filter(v => v.severity === 'low' && v.status === 'open').length;
  
  // Generate open ports
  const generateOpenPorts = () => {
    const commonPorts = [
      { port: 21, service: 'FTP', version: 'vsftpd 3.0.3' },
      { port: 22, service: 'SSH', version: 'OpenSSH 7.9' },
      { port: 25, service: 'SMTP', version: 'Postfix smtpd' },
      { port: 80, service: 'HTTP', version: 'Apache httpd 2.4.29' },
      { port: 443, service: 'HTTPS', version: 'Apache httpd 2.4.29' },
      { port: 3306, service: 'MySQL', version: 'MySQL 5.7.38' },
      { port: 8080, service: 'HTTP-Proxy', version: 'nginx 1.18.0' },
      { port: 8443, service: 'HTTPS-Alt', version: 'nginx 1.18.0' }
    ];
    
    // Randomly select 3-6 ports
    const numPorts = Math.floor(Math.random() * 4) + 3;
    const selectedIndices = [];
    
    while (selectedIndices.length < numPorts && selectedIndices.length < commonPorts.length) {
      const index = Math.floor(Math.random() * commonPorts.length);
      if (!selectedIndices.includes(index)) {
        selectedIndices.push(index);
      }
    }
    
    return selectedIndices.map(index => commonPorts[index]).sort((a, b) => a.port - b.port);
  };
  
  // Generate host information
  const generateHostInfo = () => {
    const operatingSystems = [
      'Ubuntu 20.04 LTS',
      'CentOS 8.4',
      'Debian 10',
      'Windows Server 2019'
    ];
    
    const os = operatingSystems[Math.floor(Math.random() * operatingSystems.length)];
    
    return {
      ip: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
      hostname: target,
      operatingSystem: os,
      uptime: `${Math.floor(Math.random() * 90) + 10} days`,
      lastBoot: new Date(date.getTime() - Math.floor(Math.random() * 86400000 * 100)).toISOString()
    };
  };
  
  return {
    id: parseInt(id),
    target,
    type: scanType,
    date: date.toISOString(),
    status: 'completed',
    duration,
    findings: {
      high,
      medium,
      low,
      total: high + medium + low
    },
    openPorts: generateOpenPorts(),
    hostInfo: generateHostInfo(),
    vulnerabilities,
    scanOptions: {
      scanSpeed: 'normal',
      portRange: 'top-1000',
      serviceDetection: true,
      osDetection: true,
      scriptScan: scanType === 'Full Scan'
    }
  };
};

const ScanDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [scanData, setScanData] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [filteredVulnerabilities, setFilteredVulnerabilities] = useState([]);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Fetch scan details on component mount
  useEffect(() => {
    const fetchScanDetails = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we'll simulate a delay and use mock data
        setTimeout(() => {
          const mockScanDetail = generateMockScanDetail(id);
          setScanData(mockScanDetail);
          setFilteredVulnerabilities(mockScanDetail.vulnerabilities);
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Error fetching scan details:', error);
        setLoading(false);
      }
    };
    
    fetchScanDetails();
  }, [id]);
  
  // Apply filters when vulnerabilities or filters change
  useEffect(() => {
    if (!scanData) return;
    
    let filtered = [...scanData.vulnerabilities];
    
    if (severityFilter !== 'all') {
      filtered = filtered.filter(v => v.severity === severityFilter);
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(v => v.category === categoryFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(v => v.status === statusFilter);
    }
    
    setFilteredVulnerabilities(filtered);
  }, [scanData, severityFilter, categoryFilter, statusFilter]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleBack = () => {
    navigate('/scans');
  };
  
  const handleReScan = () => {
    // In a real app, this would trigger a new scan with the same parameters
    alert('Starting a new scan with the same parameters...');
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  const formatDuration = (seconds) => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    }
  };
  
  const getSeverityChip = (severity) => {
    switch (severity) {
      case 'high':
        return (
          <Chip 
            size="small" 
            label="High" 
            color="error"
            icon={<ErrorIcon />}
            sx={{ fontWeight: 500 }}
          />
        );
      case 'medium':
        return (
          <Chip 
            size="small" 
            label="Medium" 
            color="warning"
            icon={<WarningAmberIcon />}
            sx={{ fontWeight: 500 }}
          />
        );
      case 'low':
        return (
          <Chip 
            size="small" 
            label="Low" 
            color="info"
            icon={<InfoIcon />}
            sx={{ fontWeight: 500 }}
          />
        );
      default:
        return (
          <Chip 
            size="small" 
            label={severity} 
            color="default"
            sx={{ fontWeight: 500 }}
          />
        );
    }
  };
  
  const getStatusChip = (status) => {
    switch (status) {
      case 'open':
        return (
          <Chip 
            size="small" 
            label="Open" 
            sx={{ 
              bgcolor: alpha(theme.palette.error.main, 0.1),
              color: theme.palette.error.main,
              fontWeight: 500
            }}
          />
        );
      case 'resolved':
        return (
          <Chip 
            size="small" 
            label="Resolved" 
            sx={{ 
              bgcolor: alpha(theme.palette.success.main, 0.1),
              color: theme.palette.success.main,
              fontWeight: 500
            }}
          />
        );
      default:
        return (
          <Chip 
            size="small" 
            label={status} 
            color="default"
            sx={{ fontWeight: 500 }}
          />
        );
    }
  };
  
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'web':
        return <WebIcon fontSize="small" />;
      case 'database':
        return <StorageIcon fontSize="small" />;
      case 'network':
        return <RouterIcon fontSize="small" />;
      case 'authentication':
        return <LockIcon fontSize="small" />;
      case 'encryption':
        return <VpnLockIcon fontSize="small" />;
      default:
        return <BugReportIcon fontSize="small" />;
    }
  };
  
  const getOverallSecurityScore = () => {
    if (!scanData) return 0;
    
    // Calculate a simple security score based on findings
    // Start with 100 and subtract points for vulnerabilities
    let score = 100;
    score -= scanData.findings.high * 15;  // -15 points per high vulnerability
    score -= scanData.findings.medium * 5; // -5 points per medium vulnerability
    score -= scanData.findings.low * 1;    // -1 point per low vulnerability
    
    // Ensure the score doesn't go below 0
    return Math.max(0, score);
  };
  
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
          Loading scan details...
        </Typography>
      </Box>
    );
  }
  
  if (!scanData) {
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
        <ErrorIcon color="error" sx={{ fontSize: 60, mb: 3 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Scan not found
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2, borderRadius: 2 }}
        >
          Back to Scans
        </Button>
      </Box>
    );
  }
  
  // Get unique categories for filtering
  const uniqueCategories = ['all', ...new Set(scanData.vulnerabilities.map(v => v.category))];
  
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
        {/* Page Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              sx={{ 
                mr: 3, 
                borderRadius: 2,
                border: '1px solid rgba(255, 255, 255, 0.12)',
                '&:hover': {
                  borderColor: 'primary.main',
                }
              }}
            >
              Back
            </Button>
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
                Scan Details
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {scanData.target} - {scanData.type} - {formatDate(scanData.date)}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Tooltip title="Re-run scan">
              <IconButton 
                sx={{ 
                  mr: 1.5,
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  '&:hover': {
                    borderColor: 'primary.main',
                  }
                }}
                onClick={handleReScan}
              >
                <RestartAltIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export results">
              <IconButton 
                sx={{ 
                  mr: 1.5,
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  '&:hover': {
                    borderColor: 'primary.main',
                  }
                }}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share report">
              <IconButton 
                sx={{ 
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  '&:hover': {
                    borderColor: 'primary.main',
                  }
                }}
              >
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Security Score Card */}
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
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  Security Score
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress
                    variant="determinate"
                    value={getOverallSecurityScore()}
                    size={140}
                    thickness={5}
                    sx={{
                      color: getOverallSecurityScore() > 70 
                        ? theme.palette.success.main 
                        : getOverallSecurityScore() > 50 
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
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant="h3"
                      component="div"
                      fontWeight="bold"
                      color="text.primary"
                    >
                      {getOverallSecurityScore()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getOverallSecurityScore() > 80 
                        ? 'Excellent' 
                        : getOverallSecurityScore() > 60 
                          ? 'Good' 
                          : getOverallSecurityScore() > 40 
                            ? 'Fair' 
                            : 'Poor'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          {/* Findings Summary Card */}
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
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  Findings Summary
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: alpha(theme.palette.error.main, 0.1) 
                    }}>
                      <Typography variant="h3" fontWeight="bold" color={theme.palette.error.main}>
                        {scanData.findings.high}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        High
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: alpha(theme.palette.warning.main, 0.1) 
                    }}>
                      <Typography variant="h3" fontWeight="bold" color={theme.palette.warning.main}>
                        {scanData.findings.medium}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Medium
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: alpha(theme.palette.info.main, 0.1) 
                    }}>
                      <Typography variant="h3" fontWeight="bold" color={theme.palette.info.main}>
                        {scanData.findings.low}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Low
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Findings
                  </Typography>
                  <Typography variant="h4" fontWeight={600} color="text.primary">
                    {scanData.findings.total}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          {/* Scan Info Card */}
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
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  Scan Information
                </Typography>
              </Box>
              <List dense disablePadding>
                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemText 
                    primary="Target" 
                    primaryTypographyProps={{ color: 'text.secondary' }} 
                  />
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    {scanData.target}
                  </Typography>
                </ListItem>
                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemText 
                    primary="IP Address" 
                    primaryTypographyProps={{ color: 'text.secondary' }} 
                  />
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    {scanData.hostInfo.ip}
                  </Typography>
                </ListItem>
                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemText 
                    primary="Scan Type" 
                    primaryTypographyProps={{ color: 'text.secondary' }} 
                  />
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    {scanData.type}
                  </Typography>
                </ListItem>
                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemText 
                    primary="Date" 
                    primaryTypographyProps={{ color: 'text.secondary' }} 
                  />
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    {formatDate(scanData.date)}
                  </Typography>
                </ListItem>
                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemText 
                    primary="Duration" 
                    primaryTypographyProps={{ color: 'text.secondary' }} 
                  />
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    {formatDuration(scanData.duration)}
                  </Typography>
                </ListItem>
                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemText 
                    primary="Operating System" 
                    primaryTypographyProps={{ color: 'text.secondary' }} 
                  />
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    {scanData.hostInfo.operatingSystem}
                  </Typography>
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Tabs & Content */}
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
            <Tab label="Vulnerabilities" />
            <Tab label="Open Ports" />
            <Tab label="Host Information" />
            <Tab label="Scan Options" />
          </Tabs>
          
          {/* Vulnerabilities Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ px: 3 }}>
              {/* Filters */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <FormControl
                  size="small"
                  sx={{
                    minWidth: '150px',
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
                >
                  <Select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    displayEmpty
                    startAdornment={<FilterAltIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />}
                    renderValue={(value) => value === 'all' ? 'All Severities' : `Severity: ${value.charAt(0).toUpperCase() + value.slice(1)}`}
                  >
                    <MenuItem value="all">All Severities</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl
                  size="small"
                  sx={{
                    minWidth: '150px',
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
                >
                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    displayEmpty
                    startAdornment={<FilterAltIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />}
                    renderValue={(value) => value === 'all' ? 'All Categories' : `Category: ${value.charAt(0).toUpperCase() + value.slice(1)}`}
                  >
                    {uniqueCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl
                  size="small"
                  sx={{
                    minWidth: '150px',
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
                >
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    displayEmpty
                    startAdornment={<FilterAltIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />}
                    renderValue={(value) => value === 'all' ? 'All Statuses' : `Status: ${value.charAt(0).toUpperCase() + value.slice(1)}`}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              {/* Vulnerabilities List */}
              {filteredVulnerabilities.length > 0 ? (
                <Box>
                  {filteredVulnerabilities.map((vulnerability) => (
                    <Accordion 
                      key={vulnerability.id}
                      sx={{
                        backgroundColor: 'transparent',
                        backgroundImage: 'none',
                        boxShadow: 'none',
                        '&:before': {
                          display: 'none',
                        },
                        mb: 2,
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px !important',
                        overflow: 'hidden',
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          '&.Mui-expanded': {
                            minHeight: 'auto',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                          },
                          '.MuiAccordionSummary-content': {
                            '&.Mui-expanded': {
                              margin: '12px 0',
                            }
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: alpha(
                                vulnerability.severity === 'high' 
                                  ? theme.palette.error.main 
                                  : vulnerability.severity === 'medium' 
                                    ? theme.palette.warning.main 
                                    : theme.palette.info.main,
                                0.1
                              ),
                              color: 
                                vulnerability.severity === 'high' 
                                  ? theme.palette.error.main 
                                  : vulnerability.severity === 'medium' 
                                    ? theme.palette.warning.main 
                                    : theme.palette.info.main,
                              mr: 2
                            }}
                          >
                            {vulnerability.severity === 'high' 
                              ? <ErrorIcon /> 
                              : vulnerability.severity === 'medium' 
                                ? <WarningAmberIcon /> 
                                : <InfoIcon />}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {vulnerability.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {vulnerability.description}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                            {getSeverityChip(vulnerability.severity)}
                            <Box sx={{ width: 16 }} />
                            {getStatusChip(vulnerability.status)}
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ pt: 3 }}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={8}>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                              Details
                            </Typography>
                            <Typography variant="body2" paragraph>
                              {vulnerability.details}
                            </Typography>
                            
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                              Remediation
                            </Typography>
                            <Typography variant="body2" paragraph>
                              {vulnerability.remediation}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                borderRadius: 3,
                                bgcolor: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                              }}
                            >
                              <List dense disablePadding>
                                <ListItem sx={{ px: 0, py: 1 }}>
                                  <ListItemIcon sx={{ minWidth: 36 }}>
                                    {getCategoryIcon(vulnerability.category)}
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary="Category" 
                                    secondary={vulnerability.category.charAt(0).toUpperCase() + vulnerability.category.slice(1)}
                                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                    secondaryTypographyProps={{ variant: 'body2', fontWeight: 600, color: 'text.primary' }}
                                  />
                                </ListItem>
                                <ListItem sx={{ px: 0, py: 1 }}>
                                  <ListItemIcon sx={{ minWidth: 36 }}>
                                    <BugReportIcon fontSize="small" />
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary="CVE" 
                                    secondary="N/A"
                                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                    secondaryTypographyProps={{ variant: 'body2', fontWeight: 600, color: 'text.primary' }}
                                  />
                                </ListItem>
                                <ListItem sx={{ px: 0, py: 1 }}>
                                  <ListItemIcon sx={{ minWidth: 36 }}>
                                    <LocalFireDepartmentIcon fontSize="small" />
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary="Risk Level" 
                                    secondary={vulnerability.severity.charAt(0).toUpperCase() + vulnerability.severity.slice(1)}
                                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                    secondaryTypographyProps={{ 
                                      variant: 'body2', 
                                      fontWeight: 600, 
                                      color: vulnerability.severity === 'high' 
                                        ? theme.palette.error.main 
                                        : vulnerability.severity === 'medium' 
                                          ? theme.palette.warning.main 
                                          : theme.palette.info.main
                                    }}
                                  />
                                </ListItem>
                              </List>
                            </Paper>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircleIcon sx={{ fontSize: 48, color: theme.palette.success.main, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    No vulnerabilities found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {categoryFilter !== 'all' || severityFilter !== 'all' || statusFilter !== 'all'
                      ? 'No vulnerabilities match your current filters. Try adjusting your filter criteria.'
                      : 'No vulnerabilities were detected during this scan.'}
                  </Typography>
                </Box>
              )}
            </Box>
          </TabPanel>
          
          {/* Open Ports Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ px: 3 }}>
              <Typography variant="h6" gutterBottom>
                Open Ports
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {scanData.openPorts.length} ports open on {scanData.target}
              </Typography>
              
              <TableContainer component={Paper} sx={{ 
                backgroundColor: 'transparent',
                backgroundImage: 'none',
                boxShadow: 'none',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 3,
                overflow: 'hidden',
              }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600,
                          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        }}
                      >
                        Port
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600,
                          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        }}
                      >
                        Protocol
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600,
                          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        }}
                      >
                        Service
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600,
                          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        }}
                      >
                        Version
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {scanData.openPorts.map((port) => (
                      <TableRow key={port.port}>
                        <TableCell 
                          component="th" 
                          scope="row"
                          sx={{
                            fontWeight: 600,
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          }}
                        >
                          {port.port}
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          TCP
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          {port.service}
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          {port.version || 'Unknown'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </TabPanel>
          
          {/* Host Information Tab */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ px: 3 }}>
              <Typography variant="h6" gutterBottom>
                Host Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
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
                      Basic Information
                    </Typography>
                    <List dense disablePadding>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText 
                          primary="Hostname" 
                          primaryTypographyProps={{ color: 'text.secondary' }} 
                        />
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {scanData.hostInfo.hostname}
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText 
                          primary="IP Address" 
                          primaryTypographyProps={{ color: 'text.secondary' }} 
                        />
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {scanData.hostInfo.ip}
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText 
                          primary="Operating System" 
                          primaryTypographyProps={{ color: 'text.secondary' }} 
                        />
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {scanData.hostInfo.operatingSystem}
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText 
                          primary="Uptime" 
                          primaryTypographyProps={{ color: 'text.secondary' }} 
                        />
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {scanData.hostInfo.uptime}
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText 
                          primary="Last Boot" 
                          primaryTypographyProps={{ color: 'text.secondary' }} 
                        />
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {formatDate(scanData.hostInfo.lastBoot)}
                        </Typography>
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
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
                      Security Information
                    </Typography>
                    <List dense disablePadding>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText 
                          primary="Open Ports" 
                          primaryTypographyProps={{ color: 'text.secondary' }} 
                        />
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {scanData.openPorts.length}
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText 
                          primary="Vulnerabilities" 
                          primaryTypographyProps={{ color: 'text.secondary' }} 
                        />
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {scanData.findings.total}
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText 
                          primary="Security Score" 
                          primaryTypographyProps={{ color: 'text.secondary' }} 
                        />
                        <Typography 
                          variant="body2" 
                          fontWeight={600} 
                          color={
                            getOverallSecurityScore() > 70 
                              ? theme.palette.success.main 
                              : getOverallSecurityScore() > 50 
                                ? theme.palette.warning.main 
                                : theme.palette.error.main
                          }
                        >
                          {getOverallSecurityScore()}/100
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText 
                          primary="Last Scan" 
                          primaryTypographyProps={{ color: 'text.secondary' }} 
                        />
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {formatDate(scanData.date)}
                        </Typography>
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>
          
          {/* Scan Options Tab */}
          <TabPanel value={tabValue} index={3}>
            <Box sx={{ px: 3 }}>
              <Typography variant="h6" gutterBottom>
                Scan Options
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <List dense disablePadding>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText 
                          primary="Target" 
                          primaryTypographyProps={{ color: 'text.secondary' }} 
                        />
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {scanData.target}
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText 
                          primary="Scan Type" 
                          primaryTypographyProps={{ color: 'text.secondary' }} 
                        />
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {scanData.type}
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText 
                          primary="Port Range" 
                          primaryTypographyProps={{ color: 'text.secondary' }} 
                        />
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {scanData.scanOptions.portRange}
                        </Typography>
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <List dense disablePadding>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText 
                          primary="Scan Speed" 
                          primaryTypographyProps={{ color: 'text.secondary' }} 
                        />
                        <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ textTransform: 'capitalize' }}>
                          {scanData.scanOptions.scanSpeed}
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText 
                          primary="Service Detection" 
                          primaryTypographyProps={{ color: 'text.secondary' }} 
                        />
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {scanData.scanOptions.serviceDetection ? 'Enabled' : 'Disabled'}
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText 
                          primary="OS Detection" 
                          primaryTypographyProps={{ color: 'text.secondary' }} 
                        />
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {scanData.scanOptions.osDetection ? 'Enabled' : 'Disabled'}
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText 
                          primary="Script Scan" 
                          primaryTypographyProps={{ color: 'text.secondary' }} 
                        />
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {scanData.scanOptions.scriptScan ? 'Enabled' : 'Disabled'}
                        </Typography>
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

export default ScanDetail;
