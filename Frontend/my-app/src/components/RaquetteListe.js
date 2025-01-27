import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Modal,
  Box,
  InputLabel,
} from "@mui/material";
import {Grid2 as Grid} from "@mui/material/Grid";
import React, { useState } from "react";
import "../styles/experience.css";

const RaquetteListe = ({ onSubmit }) => {
  const [raquettes, setRaquettes] = useState([]);
  const [nombreRaquettes, setNombreRaquettes] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedRaquette, setSelectedRaquette] = useState(null);

  const handleUpdate = () => {
    setRaquettes(
      Array.from({ length: nombreRaquettes }, (_, i) => ({
        idRaquette: `Raquette-${i + 1}`,
        nomErreur: "",
      }))
    );
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

  const handleRaquetteClick = (raquette) => {
    setSelectedRaquette(raquette);
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleModalSave = () => {
    setRaquettes((prevRaquettes) =>
      prevRaquettes.map((r) =>
        r.idRaquette === selectedRaquette.idRaquette ? selectedRaquette : r
      )
    );
    setOpen(false);
  };

  const handleModalInputChange = (e) => {
    setSelectedRaquette({
      ...selectedRaquette,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onSubmit(raquettes);
  };

  return (
    <div className="container">
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
              slotProps={{htmlInput: {min: 0, max: 100} }}
            />
          </Box>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleUpdate}
          >
            Mettre à jour
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="success" onClick={handleSubmit}>
            Soumettre les raquettes
          </Button>
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
              <CardContent>
                <Typography variant="h6" component="div">
                  {r.idRaquette}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {r.nomErreur || "Pas d'erreur"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal */}
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
