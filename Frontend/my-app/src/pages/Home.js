import {
  Box,
  Button,
  Grid2 as Grid,
  TextField,
} from "@mui/material";
import CustomDataGrid from "../components/CustomDataGrid";
import CustomModal from "../components/CustomModal";
import { useHandleActions } from "../components/useHandleActions";
import { createExperience, deleteExperience, getExperiences } from "../utils/experienceApi";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {

  const navigate = useNavigate();

  const actions = useHandleActions({
    id: "",
    nom: "",
    nombreTache: 1,
    option: "A",
    Tmoy: "17:42"
  });

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await getExperiences();
        actions.setRows(data);
      } catch (error) {
        console.error("Erreur lors du chargement des expériences:", error);
      }
    };
    fetchExperiences();
    // eslint-disable-next-line
  }, []);

  const handleSave = async () => {
    try {
      await createExperience(actions.currentRow);
      const updatedExperiences = await getExperiences();
      actions.setRows(updatedExperiences);
      actions.handleCloseDialog();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExperience(id);
      const updatedExperiences = await getExperiences();
      actions.setRows(updatedExperiences);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

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
            onClick={() => navigate(`/experience/${params.row.id}`)}
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

      <CustomDataGrid name="Une expérience" columns={columns} elements={actions.rows} onClickButton={actions.handleOpenDialog} width="73%" />

      <CustomModal title="Une expérience" open={actions.openDialog} onClose={actions.handleCloseDialog} onValid={handleSave} textFields={textFields} />

    </Grid>
  );
};

export default Home;
