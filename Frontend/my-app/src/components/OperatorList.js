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

const OperatorList = () => {
  const actions = useHandleActions({ id: "", nom: "", prenom: "", nivExp: 50 }, "P");

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
            color="primary"
            size="small"
            onClick={() => actions.handleEdit(params.row)}
            style={{ marginRight: 8 }}
          >
            Modifier
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => actions.handleDelete(params.row.id)}
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
      <MenuItem value="50%">50%</MenuItem>
      <MenuItem value="100%">100%</MenuItem>
      <MenuItem value="200%">200%</MenuItem>
    </Select>
  ];

  return (
    <Grid container justifyContent="center" margin="10px">
      <CustomDataGrid name="Un opérateur" columns={columns} elements={actions.rows} onClickButton={actions.handleOpenDialog} />

  <CustomModal title="Un opérateur" open={actions.openDialog} onClose={actions.handleCloseDialog} onValid={actions.handleSave} textFields={textFields} isEditing={actions.isEditing} />
    </Grid >
  );
};

export default OperatorList;
