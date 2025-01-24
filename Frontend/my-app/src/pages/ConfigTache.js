import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { positions } from '@mui/system';

const marks = [
  {
    value: 0,
    label: '0%',
  },
  {
    value: 87,
    label: '87%',
  },
  {
    value: 100,
    label: '100%',
  },
];

function valuetext(value) {
  return `${value}%`;
}

export default function DiscreteSliderValues() {
  return (
    <Box sx={{ width: 300,position:'absolute',right:'40%' }}>
      <Slider
        aria-label="Restricted values"
        defaultValue={20}
        getAriaValueText={valuetext}
        step={null}
        valueLabelDisplay="auto"
        marks={marks}
      />
    </Box>
  );
}
