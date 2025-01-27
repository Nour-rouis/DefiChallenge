import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';

const marks = [
  {
    value: 0,
    label: <Typography sx={{ fontSize: '1.4rem',color:'white' }}>0%</Typography>,
  },
  {
    value: 87,
    label: <Typography sx={{ fontSize: '1.4rem',color:'white' }}>87%</Typography>,
  },
  {
    value: 100,
    label: <Typography sx={{ fontSize: '1.4rem',color:'white' }}>100%</Typography>,
  },
];

function valuetext(value) {
  return `${value}%`;
}

const KPIs = [
  'KPI1 : Temps cible',
  'KPI2 : Nombre de raquettes contrôlées',
  'KPI3 : Temps écoulé',
  'KPI4 : Taux d avancement',
  'KPI5 : Productivité à l\u2019instant T',
  'KPI6 : Nombre de produits jetés',
  'KPI7 : Nombre de non conformités',
  'KPI8 : Taux de qualité',
  'KPI9 : Prédiction du temps de réparation',
  'KPI10 : Nombre d\u2019erreurs non détectées',
  'KPI11 : Temps restant ',
];

export default function ConfigTache() {
  const [KPINom, setKPINom] = React.useState([]);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setKPINom((prev) =>
      checked ? [...prev, value] : prev.filter((kpi) => kpi !== value)
    );
  };

  const columns = 2; // Number of columns
  const columnWidth = 50 / columns; // Width of each column in percentage
  const kpiChunks = [];
  for (let i = 0; i < KPIs.length; i += Math.ceil(KPIs.length / columns)) {
    kpiChunks.push(KPIs.slice(i, i + Math.ceil(KPIs.length / columns)));
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh',marginTop: 2 }}>
      <Typography variant="h1" gutterBottom>
        Task #X
      </Typography>
  <Box sx={{ width: '100%',width: '90%', backgroundColor: '#3f51b5', padding: 2, borderRadius: 1 }}>
      <Typography variant="subtitle1" gutterBottom sx={{ fontSize: '1.9rem',color:'white',textAlign: 'center' }}>
        Niveau de confiance d'IA : 
      </Typography>
      <Box sx={{ width: 500, margin: '0 auto' }}>
        <Slider
          aria-label="Restricted values"
          defaultValue={0}
          getAriaValueText={valuetext}
          step={null}
          valueLabelDisplay="auto"
          marks={marks}
		  sx={{
              color: 'white',
              '& .MuiSlider-thumb': {
                color: 'white',
              },
              '& .MuiSlider-track': {
                color: 'white',
              },
              '& .MuiSlider-rail': {
                color: 'white',
              },
}}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 2 }}>
        {kpiChunks.map((chunk, index) => (
          <Box key={index} sx={{ width: `${columnWidth}%`, m: 1 }}>
            {chunk.map((KPI) => (
              <FormControlLabel
                key={KPI}
                control={
                  <Checkbox
                    value={KPI}
                    checked={KPINom.includes(KPI)}
                    onChange={handleCheckboxChange}
					 sx={{
                        color: 'white',
                        '&.Mui-checked': {
                          color: 'white',
                        },
                      }}
                  />
                }
                label={<Typography sx={{ fontSize: '1.6rem',color:'white' }}>{KPI}</Typography>}
              />
            ))}
          </Box>
        ))}
	   </Box>
      </Box>
      <Button variant="contained" sx={{ fontSize: '1.7rem',marginTop:2 }}>Lancer Tache</Button>
    </Box>
  );
}
