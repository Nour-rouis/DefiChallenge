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
import CustomDataGrid from "./CustomDataGrid";

const OperatorList = () => {
  const [operators, setOperators] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentOperator, setCurrentOperator] = useState({
    id: "",
    nom: "",
    prenom: "",
    nivExp: 0,
  });
  const [isEditing, setIsEditing] = useState(false);

  const columns = [
    { field: "id", headerName: "ID d'operateur", width: 150 },
    { field: "nom", headerName: "Nom", width: 150 },
    { field: "prenom", headerName: "Prenom", width: 150 },
    { field: "nivExp", headerName: "Niveau d'experience", width: 160 },
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
            onClick={() => handleEdit(params.row)}
            style={{ marginRight: 8 }}
          >
            Modifier
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
    setIsEditing(false);
    setCurrentOperator({ id: "", nom: "", prenom: "", nivExp: 0 });
  };

  const handleEdit = (operator) => {
    setCurrentOperator(operator);
    setIsEditing(true);
    handleOpenDialog();
  };

  const handleDelete = (id) => {
    const updatedOperators = operators.filter((op) => op.id !== id);
    setOperators(updatedOperators);
  };

  const handleSave = () => {
    if (isEditing) {
      setOperators((prev) =>
        prev.map((op) => (op.id === currentOperator.id ? currentOperator : op))
      );
    } else {
      setOperators((prev) => [
        ...prev,
        { ...currentOperator, id: `P${prev.length + 1}` },
      ]);
    }
    handleCloseDialog();
  };

  return (
    <Grid container justifyContent="center" margin="10px">
      <CustomDataGrid name="Un opérateur" columns={columns} elements={operators} onClickButton={handleOpenDialog}/>

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
            {isEditing ? "Modifier un opérateur" : "Ajouter un opérateur"}
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
            <Box sx={{ marginBottom: 2 }}>
              <InputLabel htmlFor="prenom">Prénom</InputLabel>
              <TextField
                id="prenom"
                fullWidth
                value={currentOperator.prenom}
                onChange={(e) =>
                  setCurrentOperator({
                    ...currentOperator,
                    prenom: e.target.value,
                  })
                }
              />
            </Box>
            <Box sx={{ marginBottom: 2 }}>
              <InputLabel htmlFor="nivExp">Niveau d'expérience</InputLabel>
              <TextField
                id="nivExp"
                type="number"
                fullWidth
                value={currentOperator.nivExp}
                onChange={(e) =>
                  setCurrentOperator({
                    ...currentOperator,
                    nivExp: parseInt(e.target.value, 10),
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
              {isEditing ? "Mettre à jour" : "Ajouter"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Grid>
  );
};

export default OperatorList;
