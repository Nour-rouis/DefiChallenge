import React, { useEffect, useState } from 'react';
import {
    Button,
    FormControlLabel,
    Typography,
    Grid2 as Grid,
    Box,
    FormControl,
    RadioGroup,
    Radio,
    FormLabel,
    IconButton,
    Divider,
    TextField,
    Snackbar,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getExperience, updateExperience } from '../utils/experienceApi';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import OperatorList from '../components/OperatorList';
import CustomModal from '../components/CustomModal';
import { getRaquettes } from '../utils/RaquetteApi';

function GestionExperience() {
    const { idexp } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [experience, setExperience] = useState(null);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [nbTache, setNbTache] = useState(0);
    const [raquettesLength, setRaquettesLength] = useState(0);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [tmoyError, setTmoyError] = useState(false);
    const [openOperatorModal, setOpenOperatorModal] = useState(false);
    const [newOperator, setNewOperator] = useState({
        nom: '',
        prenom: '',
        nivExp: '50'
    });

    const handleStartSequence = () => {
        setOpenOperatorModal(true);
    };

    const handleCloseOperatorModal = () => {
        setOpenOperatorModal(false);
    };

    const handleSaveOperator = async () => {
        try {
            const formData = new FormData();
            formData.append('nom', newOperator.nom);
            formData.append('prenom', newOperator.prenom);
            formData.append('nivExp', newOperator.nivExp);

            const response = await fetch(`http://localhost:5000/experience/${idexp}/operator/new`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (data.state === 'success') {
                navigate(`/experience/${idexp}/operateur/${data.id}/configtache`);
            }
        } catch (error) {
            console.error('Erreur lors de la création de l\'opérateur:', error);
        }
    };

    const validateTempsFormat = (temps) => {
        const regex = /^(\d+):([0-5][0-9])$/;
        return regex.test(temps);
    };

    const handleOptionChange = (option) => {
        setExperience({ ...experience, option });
    };

    const handleBack = () => {
        navigate('/')
    }

    const handleEditRaquettes = () => {
        navigate('./raquettes');
    }

    const handleEditTache = () => {
        setOpen(true);
    }

    const handleCloseTache = () => {
        setOpen(false);
    }

    const [openTmoy, setOpenTmoy] = useState(false);
    const [tmoy, setTmoy] = useState(0);

    const handleSaveTmoy = async () => {
        if (!validateTempsFormat(tmoy)) {
            setTmoyError(true);
            return;
        }
        setOpenTmoy(false);
        setExperience({ ...experience, Tmoy: tmoy });
        await updateExperience({ ...experience, Tmoy: tmoy });
    };

    const handleCloseTmoy = () => {
        setOpenTmoy(false);
    };

    const handleSaveTache = async () => {
        setOpen(false);
        setExperience({ ...experience, nombreTache: nbTache });
        await updateExperience({ ...experience, nombreTache: nbTache });
    }

    const handleSave = async () => {
        await updateExperience(experience);
        setOpenSnackbar(true);
    }

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                setLoading(true);
                const data = await getExperience(idexp);
                console.log(data)
                setExperience(data);
                setNbTache(data.nombreTache);
                setTmoy(data.Tmoy);  // Ajoutez cette ligne
                const raquettes = await getRaquettes(idexp);
                setRaquettesLength(raquettes.length);
                setError(null);
            } catch (err) {
                setError('Erreur lors du chargement de l\'expérience');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (idexp) {
            fetchExperience();
        }
    }, [idexp]);

    const textFields = [experience ? <TextField
        id="nombre"
        label="Nombre de tâches"
        type='number'
        fullWidth
        value={nbTache}
        onChange={(e) => {
            if (parseInt(e.target.value) > 0 && parseInt(e.target.value) <= 100) {
                setNbTache(parseInt(e.target.value));
            }
        }
        }
    /> : null];


    if (loading) {
        return <Typography>Chargement...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Grid container spacing={2} margin={2}>
            <Grid item size={12}>
                <Grid container spacing={2} alignItems={'center'} >
                    <IconButton
                        onClick={handleBack}
                        aria-label="retour"
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h5">
                        {experience.nom}
                    </Typography>
                </Grid>
                <Grid container flexDirection="row" justifyContent='space-around'>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1">
                            Nombre de raquettes: {raquettesLength}
                        </Typography>
                        <IconButton
                            size="small"
                            onClick={handleEditRaquettes}
                            aria-label="modifier le nombre de raquettes"
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1">
                            Tmoy: {experience.Tmoy}
                        </Typography>
                        <IconButton
                            size="small"
                            onClick={() => setOpenTmoy(true)}
                            aria-label="modifier Tmoy"
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1">
                            Nombre de tâches: {experience.nombreTache}
                        </Typography>
                        <IconButton
                            size="small"
                            onClick={handleEditTache}
                            aria-label="modifier le nombre de tâches"
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>
            <Divider sx={{ width: '100%' }} orientation='horizontal' />
            <Grid container item size={24} flexDirection="row" justifyContent={'space-evenly'}>
                <FormControl>
                    <FormLabel>Options de calcul du temps cible</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue={experience.option}
                        name="radio-buttons-group"
                    >
                        <FormControlLabel control={<Radio onChange={() => handleOptionChange("A")} value={"A"} />} label="Option A: Tc = Tmoy" />
                        <FormControlLabel control={<Radio onChange={() => handleOptionChange("B")} value={"B"} />} label="Option B: Tc = Tmoy * (30/24)" />
                        <FormControlLabel control={<Radio onChange={() => handleOptionChange("C")} value={"C"} />} label="Option C: Tc = Tmoy + (T1 + T2 + ... + T6)" />
                        <FormControlLabel control={<Radio onChange={() => handleOptionChange("D")} value={"D"} />} label="Option D: Option A * expertise" />
                        <FormControlLabel control={<Radio onChange={() => handleOptionChange("E")} value={"E"} />} label="Option E: Option B * expertise" />
                        <FormControlLabel control={<Radio onChange={() => handleOptionChange("F")} value={"F"} />} label="Option F: Option C * expertise" />
                    </RadioGroup>
                </FormControl>
                <OperatorList />
            </Grid>
            <Grid container size={12} flexDirection="row" alignItems="center" justifyContent="space-evenly" width="100%">
                <Button variant="contained" onClick={handleSave}>
                    Enregistrer les parametres d'experiences
                </Button>

                <Button
                    variant="contained"
                    color='success'
                    onClick={handleStartSequence}
                >
                    Démarrer la séquence
                </Button>
            </Grid>
            <CustomModal isEditing={true} onValid={handleSaveTache} onClose={handleCloseTache} open={open} title={"Le nombre de tâches"} textFields={textFields} />+<CustomModal
                isEditing={true}
                onValid={handleSaveTmoy}
                onClose={handleCloseTmoy}
                open={openTmoy}
                title={"Tmoy"}
                textFields={[
                    experience ?
                        <TextField
                            id="tmoy"
                            label="Tmoy"
                            type="text"
                            fullWidth
                            value={tmoy}
                            onChange={(e) => {
                                setTmoy(e.target.value);
                                setTmoyError(!validateTempsFormat(e.target.value));
                            }}
                            error={tmoyError}
                            helperText={tmoyError ? "Format invalide. Utilisez mm:ss (ex: 15:30)" : ""}
                        />
                        : null
                ]}
            />
            <CustomModal
                isEditing={false}
                onValid={handleSaveOperator}
                onClose={handleCloseOperatorModal}
                open={openOperatorModal}
                title="Nouvel opérateur"
                textFields={[
                    <TextField
                        id="nom"
                        label="Nom"
                        fullWidth
                        value={newOperator.nom}
                        onChange={(e) => setNewOperator({ ...newOperator, nom: e.target.value })}
                    />,
                    <TextField
                        id="prenom"
                        label="Prénom"
                        fullWidth
                        value={newOperator.prenom}
                        onChange={(e) => setNewOperator({ ...newOperator, prenom: e.target.value })}
                    />,
                    <FormControl fullWidth>
                        <InputLabel>Niveau d'expérience</InputLabel>
                        <Select
                            value={newOperator.nivExp}
                            label="Niveau d'expérience"
                            onChange={(e) => setNewOperator({ ...newOperator, nivExp: e.target.value })}
                        >
                            <MenuItem value="50">50%</MenuItem>
                            <MenuItem value="100">100%</MenuItem>
                            <MenuItem value="200">200%</MenuItem>
                        </Select>
                    </FormControl>
                ]}
            />
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                message="Paramètres enregistrés"
                action={<IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={() => setOpenSnackbar(false)}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>}
            />
        </Grid>
    );
}

export default GestionExperience;