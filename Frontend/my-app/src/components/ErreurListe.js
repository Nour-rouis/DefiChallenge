import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, IconButton, Typography, Grid, TextField } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomDataGrid from './CustomDataGrid';
import CustomModal from './CustomModal';
import { createErreur, deleteErreur, getErreurs, updateErreur } from '../utils/erreurApi';

const ErreurListe = () => {
    const [erreurs, setErreurs] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentErreur, setCurrentErreur] = useState({ nom: '', tempsDefaut: '', image: null });
    const [tempsError, setTempsError] = useState(false);
    const [isEditing, setIsEditing] = useState(false);


    const { idexp } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchErreurs();
    }, [idexp]);

    const validateTempsFormat = (temps) => {
        const regex = /^(\d+):([0-5][0-9])$/;
        return regex.test(temps);
    };

    const fetchErreurs = async () => {
        try {
            const data = await getErreurs(idexp);
            setErreurs(data);
        } catch (error) {
            console.error('Erreur lors du chargement des erreurs:', error);
        }
    };

    const handleEdit = (erreur) => {
        setCurrentErreur({
            id: erreur.id,
            nom: erreur.nom,
            tempsDefaut: erreur.tempsDefaut,
            image: null
        });
        setIsEditing(true);
        setOpenDialog(true);
    };
    
    const handleSave = async () => {
        try {
            if (isEditing) {
                await updateErreur(idexp, currentErreur.id, currentErreur);
            } else {
                await createErreur(idexp, currentErreur);
            }
            fetchErreurs();
            setOpenDialog(false);
            setCurrentErreur({ nom: '', tempsDefaut: '', image: null });
            setIsEditing(false);
        } catch (error) {
            console.error('Erreur lors de l\'opération:', error);
        }
    };

    const handleDelete = async (erreurId) => {
        try {
            await deleteErreur(idexp, erreurId);
            fetchErreurs();
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };


    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'nom', headerName: 'Nom', width: 200 },
        { field: 'tempsDefaut', headerName: 'Temps par défaut', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 220,
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

    const textFields = [
        <TextField
            id="nom"
            label="Nom de l'erreur"
            fullWidth
            value={currentErreur.nom}
            onChange={(e) => setCurrentErreur({ ...currentErreur, nom: e.target.value })}
        />,
        <TextField
            id="tempsDefaut"
            label="Temps par défaut (mm:ss)"
            type="text"
            fullWidth
            value={currentErreur.tempsDefaut}
            onChange={(e) => {
                setCurrentErreur({ ...currentErreur, tempsDefaut: e.target.value });
                setTempsError(!validateTempsFormat(e.target.value));
            }}
            error={tempsError}
            helperText={tempsError ? "Format invalide. Utilisez mm:ss (ex: 15:30)" : ""}
        />,
        <TextField
            id="image"
            type="file"
            fullWidth
            onChange={(e) => setCurrentErreur({ ...currentErreur, image: e.target.files[0] })}
        />
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <IconButton onClick={() => navigate('../raquettes')}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h5">Gestion des erreurs</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <CustomDataGrid
                        name="une erreur"
                        width='50%'
                        columns={columns}
                        elements={erreurs}
                        onClickButton={() => setOpenDialog(true)}
                    />
                </Grid>
            </Grid>

            <CustomModal
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onValid={handleSave}
                title="Ajouter une erreur"
                textFields={textFields}
            />
            <CustomModal
                open={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                    setIsEditing(false);
                    setCurrentErreur({ nom: '', tempsDefaut: '', image: null });
                }}
                onValid={handleSave}
                title={isEditing ? "Modifier une erreur" : "Ajouter une erreur"}
                textFields={textFields}
            />
        </Box>
    );
};

export default ErreurListe;