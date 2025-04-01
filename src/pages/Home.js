import React from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          InfoSec Platform
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Профессиональные инструменты информационной безопасности
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" color="primary" component={Link} to="/login" sx={{ mx: 1 }}>
            Войти
          </Button>
          <Button variant="outlined" component={Link} to="/register" sx={{ mx: 1 }}>
            Регистрация
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Home;