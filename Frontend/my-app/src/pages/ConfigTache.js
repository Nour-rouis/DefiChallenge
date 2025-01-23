import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const ConfigTache = ({ onSubmit }) => {
const marks = [
  {
    value: 0,
    label: '0%',
  },
  {
    value: 37,
    label: '37%',
  },
  {
    value: 100,
    label: '100%',
  },
];

function valuetext(value) {
  return `${value}%`;
}

 function DiscreteSliderValues() {
  return (
    <Box sx={{ width: 300 }}>
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
}
export default ConfigTache;