import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import { getNbRaquetteErreur } from '../utils/RaquetteApi';
import { createTache } from '../utils/tacheApi';

// const marks = [
//   {
//     value: 0,
//     label: '0%',
//   },
//   {
//     value: 87,
//     label: '87%',
//   },
//   {
//     value: 100,
//     label: '100%',
//   },
// ];

function valuetext(value) {
  return `${value}%`;
}

const KPIs = [
  'KPI1 : Temps cible',
  'KPI2 : Nombre de raquettes contrôlées',
  'KPI3 : Temps écoulé',
  'KPI4 : Taux d avancement',
  'KPI5 : Productivité à l instant t',
  'KPI6 : Nombre de produits jetés',
  'KPI7 : Nombre de non conformités',
  'KPI8 : Taux de qualité',
  'KPI9 : Prédiction du temps de réparation',
  'KPI10 : Nombre d erreurs loupées',
  'KPI11 : Temps restant ',
];

export default function ConfigTache() {
  const [KPINom, setKPINom] = useState([]);
  const [nbRaqErreur, setRaqErreur] = useState(0);
  const { idexp, idop } = useParams();
  
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setKPINom((prev) =>
      checked ? [...prev, value] : prev.filter((kpi) => kpi !== value)
    );
  };

  const handleGetNbRaquetteErreur = async () => {
    try {
      const data = await getNbRaquetteErreur(1);
      setRaqErreur(data.count);
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre de raquette erreur:', error);
    }
  }

  const handleCreateTache = async (iaNbErreurDetecte, visibiliteKpi, idExp, idOpe) => {
    try {
      await createTache(iaNbErreurDetecte, visibiliteKpi, idExp, idOpe);
    } catch (error) {
      console.error('Erreur lors de la création de la tache:', error);
    }
  }

  handleGetNbRaquetteErreur();
  const marks = []
  for (let i = 0; i <= nbRaqErreur; i++) {
    marks.push({
      value: i,
      label: `${i}`,
    });
  }

  const columns = 2; // Number of columns
  const columnWidth = 50 / columns; // Width of each column in percentage
  const kpiChunks = [];
  for (let i = 0; i < KPIs.length; i += Math.ceil(KPIs.length / columns)) {
    kpiChunks.push(KPIs.slice(i, i + Math.ceil(KPIs.length / columns)));
  }

  const clickButton = () => {
    let kpiAff = KPINom.keys();
    let value = parseInt(valuetext);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Typography variant="h1" gutterBottom>
        Task #X
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Erreurs à afficher par l'IA : 
      </Typography>
      <Box sx={{ width: 300, margin: '0 auto' }}>
        <Slider
          aria-label="Restricted values"
          defaultValue={0}
          getAriaValueText={valuetext}
          step={null}
          valueLabelDisplay="auto"
          marks={marks}
          max={nbRaqErreur}
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
                  />
                }
                label={KPI}
              />
            ))}
          </Box>
        ))}
      </Box>
    <Button 
      variant="contained"
      onClick={clickButton}>Lancer Tache</Button>
    </Box>
  );
}
