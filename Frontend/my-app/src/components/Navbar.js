import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
export default function Navbar() {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Réparation de raquettes
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')} startIcon={<HomeIcon />}>Accueil</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
