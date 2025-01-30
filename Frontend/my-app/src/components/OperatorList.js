import {
  Box,
  Button,
  Grid2 as Grid,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import CustomDataGrid from "./CustomDataGrid";
import CustomModal from "./CustomModal";
import { useHandleActions } from "./useHandleActions";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const OperatorList = () => {
  const { idexp } = useParams();

  const actions = useHandleActions({ id: "", nom: "", prenom: "", nivExp: 50 }, "P");

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const response = await fetch(`http://localhost:5000/experience/${idexp}/operators`);
        const data = await response.json();
        actions.setRows(data.map(operator => {
          let nivExpText;
          switch (operator.nivExp) {
            case 1.2:
              nivExpText = 'Débutant (120%)';
              break;
            case 1.1:
              nivExpText = 'Novice (110%)';
              break;
            case 1:
              nivExpText = 'Normal (100%)';
              break;
            case 0.9:
              nivExpText = 'Avancé (90%)';
              break;
            case 0.8:
              nivExpText = 'Expert (80%)';
              break;
            default:
              nivExpText = `${operator.nivExp}%`;
          }
          return {
            ...operator,
            id: operator.idOperateur,
            nivExp: nivExpText
          };
        }));
      } catch (error) {
        console.error("Erreur lors du chargement des opérateurs:", error);
      }
    };

    if (idexp) {
      fetchOperators();
    }
  }, [idexp]);

  const handleDelete = async (operatorId) => {
    try {
      const response = await fetch(`http://localhost:5000/experience/${idexp}/operator/${operatorId}/delete`, {
        method: 'GET'
      });

      if (response.ok) {
        actions.setRows(prevRows => prevRows.filter(row => row.id !== operatorId));
      } else {
        console.error("Erreur lors de la suppression de l'opérateur");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'opérateur:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID d'opérateur", width: 150 },
    { field: "nom", headerName: "Nom", width: 150 },
    { field: "prenom", headerName: "Prénom", width: 150 },
    { field: "nivExp", headerName: "Niveau d'expérience", width: 160 },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <Box>
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



  const textFields = [
    <TextField
      id="nom"
      label="Nom"
      fullWidth
      value={actions.currentRow.nom}
      onChange={(e) =>
        actions.setCurrentRow({
          ...actions.currentRow,
          nom: e.target.value,
        })
      }
    />,
    <TextField
      id="prenom"
      label="Prénom"
      fullWidth
      value={actions.currentRow.prenom}
      onChange={(e) =>
        actions.setCurrentRow({
          ...actions.currentRow,
          prenom: e.target.value,
        })
      }
    />,
    <Select
      id="nivExp"
      label="Niveau d'experience"
      fullWidth
      value={actions.currentRow.nivExp}
      onChange={(e) =>
        actions.setCurrentRow({
          ...actions.currentRow,
          nivExp: e.target.value,
        })
      }
    >
      <MenuItem value="1.2">Débutant</MenuItem>
      <MenuItem value="1.1">Novice</MenuItem>
      <MenuItem value="1">Normal</MenuItem>
      <MenuItem value="0.9">Avancé</MenuItem>
      <MenuItem value="0.8">Expert</MenuItem>
    </Select>
  ];

  return (
    <Grid width="50%">
      <CustomDataGrid name="Un opérateur" columns={columns} elements={actions.rows} onClickButton={actions.handleOpenDialog} width="100%" allowAdd={false} noRowsLabel="Aucun opérateur n'a fait cette expérience" />

      <CustomModal title="Un opérateur" open={actions.openDialog} onClose={actions.handleCloseDialog} onValid={actions.handleSave} textFields={textFields} isEditing={actions.isEditing} />
    </Grid >
  );
};

export default OperatorList;
