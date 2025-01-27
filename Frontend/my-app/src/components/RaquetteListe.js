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
} from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { Grid2 as Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import "../styles/experience.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createRaquette, getRaquettes, deleteRaquette } from '../utils/RaquetteApi';

const RaquetteListe = () => {
  const [raquettes, setRaquettes] = useState([]);
  const [nombreRaquettes, setNombreRaquettes] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedRaquette, setSelectedRaquette] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchRaquettes = async () => {
      try {
        const data = await getRaquettes(id);
        setRaquettes(data);
        setNombreRaquettes(data.length)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching raquettes:', error);
        setError('Failed to load raquettes');
        setLoading(false);
      }
    };

    fetchRaquettes();
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
      formData.append('nomRaquette', selectedRaquette.idRaquette);
      formData.append('idErreur', selectedRaquette.nomErreur || '0');

      const response = await fetch(`/experience/${id}/raquette/${selectedRaquette.idRaquette}/update`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Failed to update raquette: ${response.statusText}`);
      }

      // Refresh the raquettes list after update
      const updatedRaquettes = await getRaquettes(id);
      setRaquettes(updatedRaquettes);
      setOpen(false);
    } catch (error) {
      console.error('Error updating raquette:', error);
      setError('Failed to update raquette');
    }
  };

  const handleModalInputChange = (e) => {
    setSelectedRaquette({
      ...selectedRaquette,
      [e.target.name]: e.target.value,
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
              <CardContent sx={{width : "150px"}}>
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
              <Typography
                id="modal-title"
                variant="h6"
                component="h2"
                sx={{ marginBottom: 2 }}
              >
                Modifier {selectedRaquette.idRaquette}
              </Typography>
              <Box>
                <InputLabel>Nom de l'erreur</InputLabel>
                <TextField
                  variant="outlined"
                  fullWidth
                  name="nomErreur"
                  value={selectedRaquette.nomErreur}
                  onChange={handleModalInputChange}
                  sx={{ marginBottom: 2 }}
                />
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleModalSave}
                sx={{ marginRight: 1 }}
              >
                Sauvegarder
              </Button>
              <Button variant="outlined" onClick={handleModalClose}>
                Annuler
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default RaquetteListe;