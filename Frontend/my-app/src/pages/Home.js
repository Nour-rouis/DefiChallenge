import React, { useState } from "react";
import {
  Box,
  Button,
  Grid2 as Grid,
  InputLabel,
  TextField,
  Modal,
  Typography,
} from "@mui/material";
import CustomDataGrid from "../components/CustomDataGrid";

const Home = () => {
  const [operators, setOperators] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentOperator, setCurrentOperator] = useState({
    id: "",
    nom: "",
    prenom: "",
    nivExp: 0,
  });

  const columns = [
    { field: "id", headerName: "ID d'expérience", width: 150 },
    { field: "nom", headerName: "Nom de l'expérience", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <Box>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => {}}
            style={{ marginRight: 8 }}
          >
            Gérer
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Supprimer
          </Button>
        </Box>
      ),
    },
  ];

  const handleOpenDialog = () => {
    setOpenDialog(true);
    };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentOperator({ id: "", nom: "", prenom: "", nivExp: 0 });
  };

  const handleDelete = (id) => {
    const updatedOperators = operators.filter((op) => op.id !== id);
    setOperators(updatedOperators);
  };

  const handleSave = () => {
    
      setOperators((prev) => [
        ...prev,
        { ...currentOperator, id: `${prev.length + 1}` },
      ]);
    handleCloseDialog();
  };

  return (
    <Grid container justifyContent="center" margin="10px">
        
    <CustomDataGrid name="Une expérience" columns={columns} elements={operators} onClickButton={handleOpenDialog}/>

      <Modal open={openDialog} onClose={handleCloseDialog}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            minWidth: 400,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
            {"Ajouter une expérience"}
          </Typography>
          <Box component="form" noValidate autoComplete="off">
            <Box sx={{ marginBottom: 2 }}>
              <InputLabel htmlFor="nom">Nom</InputLabel>
              <TextField
                id="nom"
                fullWidth
                value={currentOperator.nom}
                onChange={(e) =>
                  setCurrentOperator({
                    ...currentOperator,
                    nom: e.target.value,
                  })
                }
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={handleCloseDialog} color="inherit">
              Annuler
            </Button>
            <Button onClick={handleSave} color="primary" variant="contained">
              {"Ajouter"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Grid>
  );
};

export default Home;
