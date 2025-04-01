import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  FormControl,
  Select,
  CircularProgress,
  Divider,
  alpha,
  useTheme,
  Tooltip,
  Card,
  CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { scanService } from '../services/api';

// Icons
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SecurityIcon from '@mui/icons-material/Security';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ErrorIcon from '@mui/icons-material/Error';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Generate mock scan data
const generateMockScans = () => {
  const scanTypes = ['Basic Scan', 'Quick Scan', 'Full Scan', 'UDP Scan', 'Web Scan'];
  const targets = [
    'web-server.example.com',
    'api.example.com',
    'database.example.com',
    'auth.example.com',
    '192.168.1.105',
    '10.0.0.15',
    'storage.example.com',
    'mail.example.com',
    'proxy.example.com',
    'backup.example.com'
  ];
  const statuses = ['completed', 'running', 'failed', 'scheduled'];

  const scans = [];
  for (let i = 1; i <= 25; i++) {
    // Random date within last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    // Random scan type
    const scanType = scanTypes[Math.floor(Math.random() * scanTypes.length)];
    
    // Random target
    const target = targets[Math.floor(Math.random() * targets.length)];
    
    // Random status weighted toward completed
    const statusIndex = Math.floor(Math.random() * (statuses.length + 2));
    const status = statuses[statusIndex >= statuses.length ? 0 : statusIndex];
    
    // Random findings
    const high = Math.floor(Math.random() * 3);
    const medium = Math.floor(Math.random() * 5);
    const low = Math.floor(Math.random() * 8);
    
    scans.push({
      id: i,
      target,
      type: scanType,
      date: date.toISOString(),
      status,
      findings: {
        high,
        medium,
        low,
        total: high + medium + low
      },
      duration: Math.floor(Math.random() * 300) + 30 // 30 to 330 seconds
    });
  }
  
  return scans;
};

const ScanList = () => {
  const [loading, setLoading] = useState(true);
  const [scans, setScans] = useState([]);
  const [filteredScans, setFilteredScans] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState(null);
  const [selectedScan, setSelectedScan] = useState(null);
  
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Fetch scans on component mount
  useEffect(() => {
    const fetchScans = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we'll simulate a delay and use mock data
        setTimeout(() => {
          const mockScans = generateMockScans();
          setScans(mockScans);
          setFilteredScans(mockScans);
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Error fetching scans:', error);
        setLoading(false);
      }
    };
    
    fetchScans();
  }, []);
  
  // Apply filters whenever search term or filters change
  useEffect(() => {
    let result = [...scans];
    
    // Apply search filter
    if (searchTerm) {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        scan => scan.target.toLowerCase().includes(lowercaseSearchTerm) ||
                scan.type.toLowerCase().includes(lowercaseSearchTerm)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(scan => scan.status === statusFilter);
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(scan => scan.type === typeFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;
      
      if (orderBy === 'findings') {
        aValue = a.findings.total;
        bValue = b.findings.total;
      } else if (orderBy === 'date') {
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
      } else {
        aValue = a[orderBy];
        bValue = b[orderBy];
      }
      
      if (order === 'asc') {
        return aValue < bValue ? -1 : 1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    });
    
    setFilteredScans(result);
  }, [scans, searchTerm, statusFilter, typeFilter, order, orderBy]);
  
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };
  
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };
  
  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
    setPage(0);
  };
  
  const handleMenuOpen = (event, scan) => {
    setAnchorEl(event.currentTarget);
    setSelectedScan(scan);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedScan(null);
  };
  
  const handleFilterMenuOpen = (event) => {
    setFilterMenuAnchorEl(event.currentTarget);
  };
  
  const handleFilterMenuClose = () => {
    setFilterMenuAnchorEl(null);
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setFilterMenuAnchorEl(null);
  };
  
  const handleNewScan = () => {
    navigate('/scans/new');
  };
  
  const handleViewScan = (scanId) => {
    navigate(`/scans/${scanId}`);
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
  
  const getStatusChip = (status) => {
    switch (status) {
      case 'completed':
        return (
          <Chip 
            size="small" 
            label="Completed" 
            color="success"
            icon={<CheckCircleIcon />}
            sx={{ fontWeight: 500 }}
          />
        );
      case 'running':
        return (
          <Chip 
            size="small" 
            label="Running" 
            color="info"
            icon={<RefreshIcon />}
            sx={{ fontWeight: 500 }}
          />
        );
      case 'failed':
        return (
          <Chip 
            size="small" 
            label="Failed" 
            color="error"
            icon={<ErrorIcon />}
            sx={{ fontWeight: 500 }}
          />
        );
      case 'scheduled':
        return (
          <Chip 
            size="small" 
            label="Scheduled" 
            color="warning"
            icon={<ScheduleIcon />}
            sx={{ fontWeight: 500 }}
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
  
  const formatDuration = (seconds) => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    }
  };
  
  // Get unique scan types for the filter
  const uniqueScanTypes = ['all', ...new Set(scans.map(scan => scan.type))];
  
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
          Loading scans...
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
      <Container maxWidth="xl">
        {/* Page Header */}
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
              Security Scans
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View, filter and manage your security scans
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
        
        {/* Filters & Search */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 4,
            background: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Search scans..."
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{
                flexGrow: 1,
                minWidth: { xs: '100%', sm: '300px' },
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl
              sx={{
                minWidth: { xs: '100%', sm: '140px' },
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
              size="small"
            >
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                displayEmpty
                renderValue={(value) => value === 'all' ? 'All Statuses' : value.charAt(0).toUpperCase() + value.slice(1)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="running">Running</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
                <MenuItem value="scheduled">Scheduled</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl
              sx={{
                minWidth: { xs: '100%', sm: '140px' },
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
              size="small"
            >
              <Select
                value={typeFilter}
                onChange={handleTypeFilterChange}
                displayEmpty
                renderValue={(value) => value === 'all' ? 'All Types' : value}
              >
                {uniqueScanTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Tooltip title="Filter options">
              <IconButton
                sx={{ 
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
                onClick={handleFilterMenuOpen}
              >
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            
            <Menu
              anchorEl={filterMenuAnchorEl}
              open={Boolean(filterMenuAnchorEl)}
              onClose={handleFilterMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  backgroundImage: 'none',
                  backgroundColor: 'background.paper',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              <MenuItem onClick={handleClearFilters}>
                Clear all filters
              </MenuItem>
              <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              <MenuItem onClick={handleFilterMenuClose}>
                Save this filter
              </MenuItem>
              <MenuItem onClick={handleFilterMenuClose}>
                Custom filter options
              </MenuItem>
            </Menu>
          </Box>
          
          {/* Filter pills */}
          {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {searchTerm && (
                <Chip 
                  label={`Search: ${searchTerm}`} 
                  size="small" 
                  onDelete={() => setSearchTerm('')}
                  sx={{ 
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: 1.5,
                  }}
                />
              )}
              {statusFilter !== 'all' && (
                <Chip 
                  label={`Status: ${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}`} 
                  size="small" 
                  onDelete={() => setStatusFilter('all')}
                  sx={{ 
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: 1.5,
                  }}
                />
              )}
              {typeFilter !== 'all' && (
                <Chip 
                  label={`Type: ${typeFilter}`} 
                  size="small" 
                  onDelete={() => setTypeFilter('all')}
                  sx={{ 
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: 1.5,
                  }}
                />
              )}
            </Box>
          )}
        </Paper>
        
        {/* Scans Table */}
        {filteredScans.length > 0 ? (
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
            <TableContainer>
              <Table sx={{ minWidth: 750 }}>
                <TableHead>
                  <TableRow>
                    <TableCell 
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 600,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === 'target'}
                        direction={orderBy === 'target' ? order : 'asc'}
                        onClick={() => handleRequestSort('target')}
                      >
                        Target
                      </TableSortLabel>
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 600,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === 'type'}
                        direction={orderBy === 'type' ? order : 'asc'}
                        onClick={() => handleRequestSort('type')}
                      >
                        Type
                      </TableSortLabel>
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 600,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === 'date'}
                        direction={orderBy === 'date' ? order : 'asc'}
                        onClick={() => handleRequestSort('date')}
                      >
                        Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 600,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 600,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === 'findings'}
                        direction={orderBy === 'findings' ? order : 'asc'}
                        onClick={() => handleRequestSort('findings')}
                      >
                        Findings
                      </TableSortLabel>
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 600,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === 'duration'}
                        direction={orderBy === 'duration' ? order : 'asc'}
                        onClick={() => handleRequestSort('duration')}
                      >
                        Duration
                      </TableSortLabel>
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 600,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        width: 60
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredScans
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((scan) => (
                      <TableRow
                        key={scan.id}
                        hover
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            cursor: 'pointer'
                          },
                          '&:last-child td, &:last-child th': {
                            border: 0,
                          },
                        }}
                        onClick={() => handleViewScan(scan.id)}
                      >
                        <TableCell 
                          component="th" 
                          scope="row"
                          sx={{ 
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(108, 99, 255, 0.1)',
                                color: theme.palette.primary.main,
                                mr: 2
                              }}
                            >
                              <SecurityIcon fontSize="small" />
                            </Box>
                            <Typography variant="body2" fontWeight={600}>
                              {scan.target}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          {scan.type}
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          {formatDate(scan.date)}
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          {getStatusChip(scan.status)}
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {scan.findings.high > 0 && (
                              <Chip
                                size="small"
                                label={scan.findings.high}
                                sx={{
                                  bgcolor: alpha(theme.palette.error.main, 0.1),
                                  color: theme.palette.error.main,
                                  mr: 0.75,
                                  fontWeight: 600,
                                  minWidth: 30
                                }}
                              />
                            )}
                            {scan.findings.medium > 0 && (
                              <Chip
                                size="small"
                                label={scan.findings.medium}
                                sx={{
                                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                                  color: theme.palette.warning.main,
                                  mr: 0.75,
                                  fontWeight: 600,
                                  minWidth: 30
                                }}
                              />
                            )}
                            {scan.findings.low > 0 && (
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
                            {scan.findings.total === 0 && (
                              <Typography variant="body2" color="text.secondary">
                                No findings
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          {formatDuration(scan.duration)}
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            textAlign: 'right'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMenuOpen(e, scan);
                            }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={filteredScans.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                '.MuiToolbar-root': {
                  color: 'text.secondary',
                },
                '.MuiTablePagination-selectIcon': {
                  color: 'text.secondary',
                }
              }}
            />
          </Paper>
        ) : (
          <Card
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 4,
              background: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              textAlign: 'center'
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}
            >
              <SecurityIcon sx={{ color: theme.palette.primary.main, fontSize: 40 }} />
            </Box>
            <Typography variant="h5" fontWeight={600} color="text.primary" gutterBottom>
              No scans found
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: '500px', mx: 'auto' }}>
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'No scans match your current filters. Try adjusting your search criteria.'
                : 'You haven\'t run any scans yet. Start by creating a new security scan.'}
            </Typography>
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' ? (
              <Button
                variant="outlined"
                color="primary"
                onClick={handleClearFilters}
                sx={{ mr: 2, borderRadius: 2 }}
              >
                Clear Filters
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleNewScan}
                sx={{ borderRadius: 2 }}
              >
                New Scan
              </Button>
            )}
          </Card>
        )}
        
        {/* Scan Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              backgroundImage: 'none',
              backgroundColor: 'background.paper',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <MenuItem onClick={() => {
            handleViewScan(selectedScan?.id);
            handleMenuClose();
          }}>
            View details
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>Export results</MenuItem>
          <MenuItem onClick={handleMenuClose}>Schedule re-scan</MenuItem>
          <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <MenuItem onClick={handleMenuClose} sx={{ color: theme.palette.error.main }}>
            <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} />
            Delete scan
          </MenuItem>
        </Menu>
      </Container>
    </Box>
  );
};

export default ScanList;