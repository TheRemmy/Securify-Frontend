import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Alert,
  RadioGroup,
  Radio,
  FormLabel,
  FormGroup,
  Checkbox,
  CircularProgress,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  List,
  ListItem,
  ListItemText,

} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { scanService } from '../services/api';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SecurityIcon from '@mui/icons-material/Security';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DnsIcon from '@mui/icons-material/Dns';
import SettingsIcon from '@mui/icons-material/Settings';
import LanguageIcon from '@mui/icons-material/Language';
import StorageIcon from '@mui/icons-material/Storage';
import RouterIcon from '@mui/icons-material/Router';
import HttpIcon from '@mui/icons-material/Http';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';
import ScheduleIcon from '@mui/icons-material/Schedule'; // Add this import

const steps = ['Target Selection', 'Scan Options', 'Review & Launch'];

const NewScan = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [newScanId, setNewScanId] = useState(null);
  
  // Target selection state
  const [targetType, setTargetType] = useState('hostname'); // hostname, ip, range
  const [target, setTarget] = useState('');
  const [targetName, setTargetName] = useState('');
  
  // Scan options state
  const [scanType, setScanType] = useState('basic');
  const [portRange, setPortRange] = useState('top-1000');
  const [customPortRange, setCustomPortRange] = useState('');
  const [scanSpeed, setScanSpeed] = useState('normal');
  const [serviceDetection, setServiceDetection] = useState(true);
  const [osDetection, setOsDetection] = useState(true);
  const [scriptScan, setScriptScan] = useState(false);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  
  const theme = useTheme();
  const navigate = useNavigate();
  
  const handleNext = () => {
    if (validateStep()) {
      if (activeStep === steps.length - 1) {
        handleStartScan();
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError('');
  };
  
  const validateStep = () => {
    switch (activeStep) {
      case 0: // Target Selection
        if (!target) {
          setError('Please enter a target to scan');
          return false;
        }
        
        if (targetType === 'hostname') {
          // Simple hostname validation
          const hostnameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9\-\.]+)?[a-zA-Z0-9](\.[a-zA-Z]{2,})+$/;
          if (!hostnameRegex.test(target)) {
            setError('Please enter a valid hostname (e.g., example.com)');
            return false;
          }
        } else if (targetType === 'ip') {
          // Simple IP validation
          const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
          if (!ipRegex.test(target)) {
            setError('Please enter a valid IP address (e.g., 192.168.1.1)');
            return false;
          }
          
          // Check each part is between 0 and 255
          const parts = target.split('.');
          for (let part of parts) {
            const num = parseInt(part, 10);
            if (num < 0 || num > 255) {
              setError('IP address parts must be between 0 and 255');
              return false;
            }
          }
        } else if (targetType === 'range') {
          // Simple CIDR notation validation
          const cidrRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/;
          if (!cidrRegex.test(target)) {
            setError('Please enter a valid CIDR range (e.g., 192.168.1.0/24)');
            return false;
          }
          
          // Check each part is between 0 and 255
          const ipPart = target.split('/')[0];
          const parts = ipPart.split('.');
          for (let part of parts) {
            const num = parseInt(part, 10);
            if (num < 0 || num > 255) {
              setError('IP address parts must be between 0 and 255');
              return false;
            }
          }
          
          // Check CIDR prefix is between 0 and 32
          const prefix = parseInt(target.split('/')[1], 10);
          if (prefix < 0 || prefix > 32) {
            setError('CIDR prefix must be between 0 and 32');
            return false;
          }
        }
        
        return true;
      
      case 1: // Scan Options
        if (portRange === 'custom' && !customPortRange) {
          setError('Please specify a custom port range');
          return false;
        }
        
        if (portRange === 'custom') {
          // Validate custom port range format
          const portRangeRegex = /^(?:\d+|(?:\d+-\d+))(?:,(?:\d+|(?:\d+-\d+)))*$/;
          if (!portRangeRegex.test(customPortRange)) {
            setError('Please enter a valid port range (e.g., 80,443,8000-8100)');
            return false;
          }
          
          // Check that each port or port range has valid values (1-65535)
          const parts = customPortRange.split(',');
          for (let part of parts) {
            if (part.includes('-')) {
              const [start, end] = part.split('-').map(p => parseInt(p, 10));
              if (start < 1 || start > 65535 || end < 1 || end > 65535 || start > end) {
                setError('Ports must be between 1 and 65535, and ranges must have start <= end');
                return false;
              }
            } else {
              const port = parseInt(part, 10);
              if (port < 1 || port > 65535) {
                setError('Ports must be between 1 and 65535');
                return false;
              }
            }
          }
        }
        
        if (scheduleEnabled) {
          if (!scheduleDate || !scheduleTime) {
            setError('Please specify both date and time for scheduled scan');
            return false;
          }
          
          // Check if scheduled time is in the future
          const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
          if (scheduledDateTime <= new Date()) {
            setError('Scheduled time must be in the future');
            return false;
          }
        }
        
        return true;
      
      default:
        return true;
    }
  };
  
  const handleStartScan = () => {
    setLoading(true);
    setError('');
    
    // Prepare scan configuration
    const scanConfig = {
      target,
      targetName: targetName || target,
      targetType,
      scanType,
      portRange: portRange === 'custom' ? customPortRange : portRange,
      scanSpeed,
      options: {
        serviceDetection,
        osDetection,
        scriptScan
      },
      schedule: scheduleEnabled ? {
        date: scheduleDate,
        time: scheduleTime
      } : null
    };
    
    // In a real app, this would call an API
    // Here we'll simulate a delay and success
    setTimeout(() => {
      try {
        // Mock successful scan creation
        setNewScanId(Math.floor(Math.random() * 1000) + 1); // Random scan ID
        setSuccess(true);
        
        // Navigate to scan details after 2 seconds
        setTimeout(() => {
          navigate(`/scans/${newScanId}`);
        }, 2000);
      } catch (err) {
        setError('Failed to start scan. Please try again.');
        setLoading(false);
      }
    }, 1500);
  };
  
  const handleCancel = () => {
    navigate('/scans');
  };
  
  // Render different steps
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              Select a target to scan. You can specify a hostname, IP address, or IP range.
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <FormControl component="fieldset">
                <FormLabel 
                  component="legend"
                  sx={{ color: 'text.primary', mb: 1.5, fontWeight: 600 }}
                >
                  Target Type
                </FormLabel>
                <RadioGroup
                  row
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value)}
                >
                  <FormControlLabel 
                    value="hostname" 
                    control={<Radio color="primary" />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LanguageIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <span>Hostname</span>
                      </Box>
                    }
                    sx={{ mr: 3 }}
                  />
                  <FormControlLabel 
                    value="ip" 
                    control={<Radio color="primary" />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DnsIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <span>IP Address</span>
                      </Box>
                    }
                    sx={{ mr: 3 }}
                  />
                  <FormControlLabel 
                    value="range" 
                    control={<Radio color="primary" />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <RouterIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <span>IP Range (CIDR)</span>
                      </Box>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <TextField
                  label="Target"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder={
                    targetType === 'hostname' ? 'example.com' : 
                    targetType === 'ip' ? '192.168.1.1' : 
                    '192.168.1.0/24'
                  }
                  required
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
              </FormControl>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <TextField
                  label="Target Name (Optional)"
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  placeholder="Friendly name for this target"
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
              </FormControl>
            </Box>
            
            <Box 
              sx={{ 
                p: 2.5, 
                borderRadius: 3, 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                display: 'flex',
                alignItems: 'flex-start'
              }}
            >
              <InfoIcon 
                sx={{ 
                  color: theme.palette.primary.main, 
                  mr: 1.5, 
                  mt: 0.5 
                }} 
              />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Important Notice
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Only scan systems that you own or have explicit permission to scan.
                  Unauthorized scanning may be illegal in some jurisdictions.
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              Configure scan options to determine the scope and depth of the security scan.
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
                    height: '100%',
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Basic Options
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel id="scan-type-label">Scan Type</InputLabel>
                      <Select
                        labelId="scan-type-label"
                        id="scan-type"
                        value={scanType}
                        label="Scan Type"
                        onChange={(e) => setScanType(e.target.value)}
                        sx={{
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
                        }}
                      >
                        <MenuItem value="basic">Basic Scan (Recommended)</MenuItem>
                        <MenuItem value="quick">Quick Scan</MenuItem>
                        <MenuItem value="full">Full Scan</MenuItem>
                        <MenuItem value="udp">UDP Scan</MenuItem>
                        <MenuItem value="web">Web Vulnerability Scan</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel id="port-range-label">Port Range</InputLabel>
                      <Select
                        labelId="port-range-label"
                        id="port-range"
                        value={portRange}
                        label="Port Range"
                        onChange={(e) => setPortRange(e.target.value)}
                        sx={{
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
                        }}
                      >
                        <MenuItem value="top-100">Top 100 Ports</MenuItem>
                        <MenuItem value="top-1000">Top 1000 Ports</MenuItem>
                        <MenuItem value="all">All Ports (1-65535)</MenuItem>
                        <MenuItem value="custom">Custom Port Range</MenuItem>
                      </Select>
                    </FormControl>
                    
                    {portRange === 'custom' && (
                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <TextField
                          label="Custom Port Range"
                          value={customPortRange}
                          onChange={(e) => setCustomPortRange(e.target.value)}
                          placeholder="e.g., 22,80,443,8000-8100"
                          helperText="Specify individual ports (80) or ranges (8000-8100), separated by commas"
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
                      </FormControl>
                    )}
                    
                    <FormControl fullWidth>
                      <InputLabel id="scan-speed-label">Scan Speed</InputLabel>
                      <Select
                        labelId="scan-speed-label"
                        id="scan-speed"
                        value={scanSpeed}
                        label="Scan Speed"
                        onChange={(e) => setScanSpeed(e.target.value)}
                        sx={{
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
                        }}
                      >
                        <MenuItem value="slow">Slow (Stealthy)</MenuItem>
                        <MenuItem value="normal">Normal</MenuItem>
                        <MenuItem value="fast">Fast (Aggressive)</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
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
                    height: '100%',
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Advanced Options
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={serviceDetection} 
                            onChange={(e) => setServiceDetection(e.target.checked)} 
                            color="primary"
                          />
                        }
                        label="Service Version Detection"
                      />
                      <FormHelperText sx={{ mt: -0.5, mb: 1.5, ml: 4 }}>
                        Detect service versions running on open ports
                      </FormHelperText>
                      
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={osDetection} 
                            onChange={(e) => setOsDetection(e.target.checked)} 
                            color="primary"
                          />
                        }
                        label="Operating System Detection"
                      />
                      <FormHelperText sx={{ mt: -0.5, mb: 1.5, ml: 4 }}>
                        Attempt to identify the target operating system
                      </FormHelperText>
                      
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={scriptScan} 
                            onChange={(e) => setScriptScan(e.target.checked)} 
                            color="primary"
                          />
                        }
                        label="Script Scanning"
                      />
                      <FormHelperText sx={{ mt: -0.5, mb: 1.5, ml: 4 }}>
                        Run default security scripts (may increase scan time)
                      </FormHelperText>
                    </FormGroup>
                  </Box>
                  
                  <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.08)' }} />
                  
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Scheduling
                  </Typography>
                  
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={scheduleEnabled} 
                          onChange={(e) => setScheduleEnabled(e.target.checked)} 
                          color="primary"
                        />
                      }
                      label="Schedule this scan"
                    />
                    
                    {scheduleEnabled && (
                      <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Date"
                              type="date"
                              value={scheduleDate}
                              onChange={(e) => setScheduleDate(e.target.value)}
                              InputLabelProps={{ shrink: true }}
                              fullWidth
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
                              label="Time"
                              type="time"
                              value={scheduleTime}
                              onChange={(e) => setScheduleTime(e.target.value)}
                              InputLabelProps={{ shrink: true }}
                              fullWidth
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
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              Review your scan configuration and launch the scan when ready.
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
                    Target Information
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <List dense disablePadding>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText 
                          primary="Target" 
                          primaryTypographyProps={{ color: 'text.secondary' }} 
                        />
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {target}
                        </Typography>
                      </ListItem>
                      
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText 
                          primary="Target Name" 
                          primaryTypographyProps={{ color: 'text.secondary' }} 
                        />
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {targetName || '(Not specified)'}
                        </Typography>
                      </ListItem>
                      
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText 
                          primary="Target Type" 
                          primaryTypographyProps={{ color: 'text.secondary' }} 
                        />
                        <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ textTransform: 'capitalize' }}>
                          {targetType}
                        </Typography>
                      </ListItem>
                    </List>
                  </Box>
                  
                  <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.08)' }} />
                  
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Scan Configuration
                  </Typography>
                  
                  <Box>
                    <List dense disablePadding>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText 
                          primary="Scan Type" 
                          primaryTypographyProps={{ color: 'text.secondary' }} 
                        />
                        <Chip 
                          label={
                            scanType === 'basic' ? 'Basic Scan' :
                            scanType === 'quick' ? 'Quick Scan' :
                            scanType === 'full' ? 'Full Scan' :
                            scanType === 'udp' ? 'UDP Scan' :
                            'Web Vulnerability Scan'
                          } 
                          color="primary" 
                          size="small" 
                          sx={{ fontWeight: 500 }}
                        />
                      </ListItem>
                      
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText 
                          primary="Port Range" 
                          primaryTypographyProps={{ color: 'text.secondary' }} 
                        />
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {portRange === 'top-100' ? 'Top 100 Ports' :
                           portRange === 'top-1000' ? 'Top 1000 Ports' :
                           portRange === 'all' ? 'All Ports (1-65535)' :
                           `Custom: ${customPortRange}`}
                        </Typography>
                      </ListItem>
                      
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText 
                          primary="Scan Speed" 
                          primaryTypographyProps={{ color: 'text.secondary' }} 
                        />
                        <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ textTransform: 'capitalize' }}>
                          {scanSpeed}
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText 
                          primary="Service Detection" 
                          primaryTypographyProps={{ color: 'text.secondary' }} 
                        />
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {serviceDetection ? 'Enabled' : 'Disabled'}
                        </Typography>
                      </ListItem>
                      
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText 
                          primary="OS Detection" 
                          primaryTypographyProps={{ color: 'text.secondary' }} 
                        />
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {osDetection ? 'Enabled' : 'Disabled'}
                        </Typography>
                      </ListItem>
                      
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemText 
                          primary="Script Scanning" 
                          primaryTypographyProps={{ color: 'text.secondary' }} 
                        />
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {scriptScan ? 'Enabled' : 'Disabled'}
                        </Typography>
                      </ListItem>
                    </List>
                  </Box>
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
                    mb: 3,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Scheduling
                  </Typography>
                  
                  <Box>
                    {scheduleEnabled ? (
                      <List dense disablePadding>
                        <ListItem sx={{ px: 0, py: 1 }}>
                          <ListItemText 
                            primary="Schedule Status" 
                            primaryTypographyProps={{ color: 'text.secondary' }} 
                          />
                          <Chip 
                            label="Scheduled" 
                            color="warning" 
                            size="small" 
                            icon={<ScheduleIcon />}
                            sx={{ fontWeight: 500 }}
                          />
                        </ListItem>
                        
                        <ListItem sx={{ px: 0, py: 1 }}>
                          <ListItemText 
                            primary="Scheduled Date" 
                            primaryTypographyProps={{ color: 'text.secondary' }} 
                          />
                          <Typography variant="body2" fontWeight={600} color="text.primary">
                            {new Date(scheduleDate).toLocaleDateString()}
                          </Typography>
                        </ListItem>
                        
                        <ListItem sx={{ px: 0, py: 1 }}>
                          <ListItemText 
                            primary="Scheduled Time" 
                            primaryTypographyProps={{ color: 'text.secondary' }} 
                          />
                          <Typography variant="body2" fontWeight={600} color="text.primary">
                            {scheduleTime}
                          </Typography>
                        </ListItem>
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        This scan will start immediately after launch.
                      </Typography>
                    )}
                  </Box>
                </Paper>
                
                <Box 
                  sx={{ 
                    p: 2.5, 
                    borderRadius: 3, 
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                    display: 'flex',
                    alignItems: 'flex-start'
                  }}
                >
                  <WarningAmberIcon 
                    sx={{ 
                      color: theme.palette.warning.main, 
                      mr: 1.5, 
                      mt: 0.5 
                    }} 
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Important Notice
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Scanning may disrupt services or trigger security alarms on the target systems.
                      Only scan systems that you own or have explicit permission to scan.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      
      default:
        return 'Unknown step';
    }
  };
  
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
              onClick={handleCancel}
              sx={{ 
                mr: 3, 
                borderRadius: 2,
                border: '1px solid rgba(255, 255, 255, 0.12)',
                '&:hover': {
                  borderColor: 'primary.main',
                }
              }}
            >
              Cancel
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
                New Security Scan
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Configure and launch a new security scan
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Stepper */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 4,
            background: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel
            sx={{
              '& .MuiStepLabel-root .Mui-completed': {
                color: theme.palette.primary.main,
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: theme.palette.primary.main,
              },
              '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel': {
                color: 'white',
              },
              '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                fill: 'black',
              },
              '& .MuiStepConnector-line': {
                borderColor: 'rgba(255, 255, 255, 0.1)'
              },
              '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                borderColor: theme.palette.primary.main
              },
              '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                borderColor: theme.palette.primary.main
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
        
        {/* Main Content */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {success ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}
              >
                <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: 40 }} />
              </Box>
              <Typography variant="h5" fontWeight={600} color="text.primary" gutterBottom>
                Scan Started Successfully
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {scheduleEnabled 
                  ? 'Your scan has been scheduled and will run at the specified time.' 
                  : 'Your scan is now running. You will be redirected to the scan details page.'}
              </Typography>
              <CircularProgress size={24} sx={{ mt: 1 }} />
            </Box>
          ) : (
            <>
              {error && (
                <Alert 
                  severity="error"
                  sx={{ 
                    mb: 3,
                    borderRadius: 3,
                    alignItems: 'center',
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
              
              {getStepContent(activeStep)}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<ArrowBackIcon />}
                  sx={{ 
                    borderRadius: 2,
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    '&:hover': {
                      borderColor: 'primary.main',
                    }
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={loading}
                  endIcon={activeStep === steps.length - 1 ? <PlayArrowIcon /> : <ArrowForwardIcon />}
                  sx={{ 
                    borderRadius: 2,
                    position: 'relative',
                    minWidth: 140
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    activeStep === steps.length - 1 ? 'Launch Scan' : 'Next'
                  )}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

// Helper component for form helper text
const FormHelperText = ({ children, ...props }) => (
  <Typography 
    variant="caption" 
    color="text.secondary" 
    {...props}
  >
    {children}
  </Typography>
);

export default NewScan;