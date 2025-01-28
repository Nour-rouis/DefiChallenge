import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Modal,
  IconButton,
  Box,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { Grid2 as Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import "../styles/experience.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createRaquette, getRaquettes, deleteRaquette, updateRaquette } from '../utils/RaquetteApi';

const RaquetteListe = () => {
  const [raquettes, setRaquettes] = useState([]);
  const [erreurs, setErreurs] = useState([]);
  const [nombreRaquettes, setNombreRaquettes] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedRaquette, setSelectedRaquette] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Récupérer les raquettes
        const raquettesData = await getRaquettes(id);

        // Récupérer les erreurs
        const response = await fetch(`http://localhost:5000/experience/${id}/erreurs`);
        const erreursData = await response.json();
        setErreurs(erreursData);

        // Mettre à jour les raquettes avec les noms d'erreurs
        const updatedRaquettes = raquettesData.map(raquette => {
          const erreur = erreursData.find(err => err.idErreur === raquette.idErreur);
          return {
            ...raquette,
            nomErreur: erreur ? erreur.nom : ""
          };
        });

        setRaquettes(updatedRaquettes);
        setNombreRaquettes(updatedRaquettes.length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    try {
      setIsSubmitting(true);

      // Si le nouveau nombre est inférieur au nombre actuel, supprimer les dernières raquettes
      if (nombreRaquettes < raquettes.length) {
        const raquettesToDelete = raquettes.slice(nombreRaquettes);
        for (const raquette of raquettesToDelete) {
          await deleteRaquette(id, raquette.idRaquette);
        }
      }
      // Si le nouveau nombre est supérieur, créer de nouvelles raquettes
      else if (nombreRaquettes > raquettes.length) {
        const newRaquettes = Array.from(
          { length: nombreRaquettes - raquettes.length },
          (_, i) => ({
            idRaquette: `Raquette-${raquettes.length + i + 1}`,
            nomErreur: "",
          })
        );

        for (const raquette of newRaquettes) {
          await createRaquette(raquette, id);
        }
      }

      // Rafraîchir la liste des raquettes
      const updatedRaquettes = await getRaquettes(id);
      setRaquettes(updatedRaquettes);

    } catch (error) {
      console.error('Error updating raquettes:', error);
      setError('Failed to update raquettes');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const value = Math.min(100, Math.max(0, Number(e.target.value)));
    setNombreRaquettes(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleUpdate();
    }
  };

  const handleBack = () => {
    navigate('../');
  };

  const handleRaquetteClick = (raquette) => {
    setSelectedRaquette(raquette);
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleModalSave = async () => {
    try {
      if (!selectedRaquette) return;

      const formData = new FormData();
      formData.append('nomRaquette', selectedRaquette.nomRaquette);
      formData.append('idErreur', selectedRaquette.idErreur || '0');

      await updateRaquette(id, selectedRaquette.idRaquette, formData);

      // Rafraîchir la liste des raquettes avec les noms d'erreurs
      const updatedRaquettes = await getRaquettes(id);
      const updatedRaquettesWithErrors = updatedRaquettes.map(raquette => {
        const erreur = erreurs.find(err => err.idErreur === raquette.idErreur);
        return {
          ...raquette,
          nomErreur: erreur ? erreur.nom : ""
        };
      });
      setRaquettes(updatedRaquettesWithErrors);
      setOpen(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la raquette:', error);
      setError('Échec de la mise à jour de la raquette');
    }
  };

  const handleModalInputChange = (e) => {
    const erreur = erreurs.find(err => err.idErreur === e.target.value);
    setSelectedRaquette({
      ...selectedRaquette,
      idErreur: e.target.value,
      nomErreur: erreur ? erreur.nom : ""
    });
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div className="container">
      <Grid container spacing={2} flexDirection="column">
        <Grid container spacing={2} alignItems={'center'}>
          <IconButton onClick={handleBack} aria-label="retour">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5">
            Editer l'experience
          </Typography>
        </Grid>
        <Grid container spacing={2} alignItems="flex-end" justifyContent="start">
          <Grid item xs={2}>
            <Box>
              <InputLabel>Nombre de raquettes</InputLabel>
              <TextField
                variant="outlined"
                fullWidth
                type="number"
                value={nombreRaquettes}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={isSubmitting}
                slotProps={{ htmlInput: { min: 0, max: 100 } }}
              />
            </Box>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('./erreurs')}
            >
              Gérer les erreurs
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={handleUpdate}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ marginTop: 2 }}>
        {raquettes.map((r) => (
          <Grid item xs={2} key={r.idRaquette}>
            <Card
              variant="outlined"
              sx={{
                backgroundColor: "lightblue",
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => handleRaquetteClick(r)}
            >
              <CardContent sx={{ width: "150px" }}>
                <Typography variant="h6" component="div">
                  {r.nomRaquette}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {r.nomErreur || "Pas d'erreur"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal
        open={open}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          borderRadius={2}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedRaquette && (
            <>
              <FormControl fullWidth>
                <InputLabel>Type d'erreur</InputLabel>
                <Select
                  value={selectedRaquette.idErreur || ''}
                  onChange={handleModalInputChange}
                  name="nomErreur"
                >
                  <MenuItem value="">Aucune erreur</MenuItem>
                  {erreurs.map((erreur) => (
                    <MenuItem key={erreur.idErreur} value={erreur.idErreur}>
                      {erreur.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={handleModalClose} variant="outlined">
                  Annuler
                </Button>
                <Button onClick={handleModalSave} variant="contained" color="primary">
                  Sauvegarder
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default RaquetteListe;