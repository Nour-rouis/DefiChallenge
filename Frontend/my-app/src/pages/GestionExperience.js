import React, { useState } from 'react';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Grid,
  Box,
} from '@mui/material';

function GestionExperience() {
  const [optionA, setOptionA] = useState(false);
  const [optionB, setOptionB] = useState(false);
  const [optionC, setOptionC] = useState(false);
  const [valueT1, setValueT1] = useState('');
  const [valueT2, setValueT2] = useState('');
  const [valueT3, setValueT3] = useState('');
  const [valueT4, setValueT4] = useState('');
  const [valueT5, setValueT5] = useState('');
  const [valueT6, setValueT6] = useState('');
  const [raquetteCount, setRaquetteCount] = useState(24); // Default value

  const handleOptionChange = (event, option) => {
    switch (option) {
      case 'A':
        setOptionA(event.target.checked);
        setOptionB(false);
        setOptionC(false);
        break;
      case 'B':
        setOptionA(false);
        setOptionB(event.target.checked);
        setOptionC(false);
        break;
      case 'C':
        setOptionA(false);
        setOptionB(false);
        setOptionC(event.target.checked);
        break;
      default:
        break;
    }
  };

  const handleChange = (event, setValue) => {
    setValue(event.target.value);
  };

  const handleRaquetteCountChange = (event) => {
    setRaquetteCount(event.target.value);
  };

  const calculateTc = () => {
    let Tc = 0;

    if (optionA) {
      // Option A: Tc = Tmoy
      Tc = parseFloat(valueT1); // Assuming valueT1 represents Tmoy
    } else if (optionB) {
      // Option B: Tc = Tmoy * (24/30)
      Tc = parseFloat(valueT1) * (24 / 30); // Assuming valueT1 represents Tmoy
    } else if (optionC) {
      // Option C: Tc = Tmoy * (Nombre de raquettes / 24) + (T1 + T2 + ... + T6)
      Tc =
        parseFloat(valueT1) * (raquetteCount / 24) +
        parseFloat(valueT1) +
        parseFloat(valueT2) +
        parseFloat(valueT3) +
        parseFloat(valueT4) +
        parseFloat(valueT5) +
        parseFloat(valueT6);
    }

    return Tc;
  };

  const handleSubmit = () => {
    // Basic validation (replace with your own logic)
    if (!valueT1 || !valueT2 || !valueT3 || !valueT4 || !valueT5 || !valueT6) {
      alert('Please fill in all Ti-Values.');
      return;
    }

    const calculatedTc = calculateTc();

    // Handle submission (e.g., send data to server)
    console.log('Submitted values:', {
      optionA,
      optionB,
      optionC,
      valueT1,
      valueT2,
      valueT3,
      valueT4,
      valueT5,
      valueT6,
      raquetteCount,
      calculatedTc,
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">Options</Typography>
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={optionA}
                onChange={(event) => handleOptionChange(event, 'A')}
              />
            }
            label="Option A: Tc = Tmoy"
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={optionB}
                onChange={(event) => handleOptionChange(event, 'B')}
              />
            }
            label="Option B: Tc = Tmoy * (24/30)"
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={optionC}
                onChange={(event) => handleOptionChange(event, 'C')}
              />
            }
            label="Option C: Tc = Tmoy * (Nombre de raquettes / 24) + (T1 + T2 + ... + T6)"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">Raquette Count</Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Number of Raquettes"
            type="number"
            value={raquetteCount}
            onChange={handleRaquetteCountChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">Ti-Values</Typography>
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="T1"
            variant="outlined"
            value={valueT1}
            onChange={(event) => handleChange(event, setValueT1)}
            fullWidth
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="T2"
            variant="outlined"
            value={valueT2}
            onChange={(event) => handleChange(event, setValueT2)}
            fullWidth
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="T3"
            variant="outlined"
            value={valueT3}
            onChange={(event) => handleChange(event, setValueT3)}
            fullWidth
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="T4"
            variant="outlined"
            value={valueT4}
            onChange={(event) => handleChange(event, setValueT4)}
            fullWidth
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="T5"
            variant="outlined"
            value={valueT5}
            onChange={(event) => handleChange(event, setValueT5)}
            fullWidth
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="T6"
            variant="outlined"
            value={valueT6}
            onChange={(event) => handleChange(event, setValueT6)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleSubmit} fullWidth>
            Validate
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default GestionExperience;