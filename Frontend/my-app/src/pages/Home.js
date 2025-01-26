import {
  Box,
  Button,
  Grid2 as Grid,
  TextField,
} from "@mui/material";
import CustomDataGrid from "../components/CustomDataGrid";
import CustomModal from "../components/CustomModal";
import { useHandleActions } from "../components/useHandleActions";

const Home = () => {

  const actions = useHandleActions({ id: "", nom: "" });

  const columns = [
    { field: "id", headerName: "ID d'expérience", width: 150 },
    { field: "nom", headerName: "Nom", width: 150 },
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
            onClick={() => { }}
            style={{ marginRight: 8 }}
          >
            Gérer
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
  ];

  return (
    <Grid container justifyContent="center" margin="10px">

      <CustomDataGrid name="Une expérience" columns={columns} elements={actions.rows} onClickButton={actions.handleOpenDialog} />

      <CustomModal title="Une expérience" open={actions.openDialog} onClose={actions.handleCloseDialog} onValid={actions.handleSave} textFields={textFields} />

    </Grid>
  );
};

export default Home;
