import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import raquetteImage from '../assets/images/Bouton ressort monté a l_envers.jpeg';
import {
    Container,
    Grid2 as Grid,
    Typography,
    Box,
    CircularProgress,
    Card,
    CardContent,
    CardHeader,
    Snackbar,
    IconButton,
} from '@mui/material';
import {
    Timer as TimerIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';
import {
    getKpi1,
    getKpi2,
    getKpi6,
    getKpi9,
    getKpi10,
    getNombreRaquettes
} from '../utils/kpiApi';
import { getRaquettes } from '../utils/RaquetteApi';
import CloseIcon from '@mui/icons-material/Close';
import { getVisibiliteKpi } from '../utils/tacheApi';
import { createAnalyse } from '../utils/analyseApi';


const KPI_LABELS = [
    'Temps cible',
    'Nombre de raquettes contrôlées',
    'Temps écoulé',
    'Taux d\'avancement',
    'Productivité à l\'instant t',
    'Nombre de produits jetés',
    'Nombre de non conformités',
    'Taux de qualité',
    'Prédiction du temps de réparation',
    'Nombre d\'erreurs loupées',
    'Temps restant',
];

function KpiDashboard() {
    const navigate = useNavigate();
    const { idexp, idop, idtac } = useParams();

    const [state, setState] = useState({
        kpiData: {
            kpi1: 'Loading...',
            kpi2: '0',
            kpi3: '75s',
            kpi4: '0%',
            kpi5: '0',
            kpi6: '0',
            kpi7: '0',
            kpi8: '0',
            kpi9: '0',
            kpi10: '0',
            kpi11: '0'
        },
        loading: true,
        error: null,
        showRaquetteSection: false,
        scannerInput: '',
        raquetteName: '',
        dateDebutScan: '',
        timer: 0,
        visibiliteKpi: [],
    });

    const [raquettes, setRaquettes] = useState([]);
    const [textSnackbar, setTextSnackbar] = useState('');
    const TIME_CYCLE = 10;
    const ERROR_TIMES = { T1: 2, T2: 3 };
    const ERROR_FREQUENCIES = { T1: 2, T2: 1 };

    const handleFinish = async () => {
        navigate(`/experience/${idexp}/operateur/${idop}/configtache`);
    }

    const handleRepair = () => {
        setState(prevState => {
            const analyseData = {
                dateDebut: prevState.dateDebutScan,
                dateFin: new Date().toISOString(),
                isErreur: 1,
                kpis: prevState.kpiData
            }
            createAnalyse(idexp, idop, idtac, raquettes.find(r => r.nomRaquette === prevState.raquetteName).idRaquette, analyseData);
            setTextSnackbar(`Vous venez de réparer ${prevState.raquetteName}`);

            setRaquettes(prev => prev.map(raquette => {
                if (raquette.nomRaquette === prevState.raquetteName) {
                    return { ...raquette, isScanned: true }
                }

                return raquette
            }
            ));

            const newKpi2 = parseInt(prevState.kpiData.kpi2) + 1;
            const kpi4 = (100 * newKpi2) / 30;
            const tempsObjectif = calculateObjectiveTime();
            const kpi5Value = ((100 * tempsObjectif) / parseInt(prevState.kpiData.kpi3)).toFixed(2);

            return {
                ...prevState,
                kpiData: {
                    ...prevState.kpiData,
                    kpi2: newKpi2.toString(),
                    kpi4: `${kpi4.toFixed(2)}%`,
                    kpi5: kpi5Value
                },
                showRaquetteSection: false,
                raquetteName: '',
            };
        });
    };

    const handleCloseSnackbar = () => {
        setTextSnackbar('');
    };

    const handleValidate = () => {
        setState(prevState => {
            const analyseData = {
                dateDebut: prevState.dateDebutScan,
                dateFin: new Date().toISOString(),
                isErreur: 0,
                kpis: prevState.kpiData
            }
            createAnalyse(idexp, idop, idtac, raquettes.find(r => r.nomRaquette === prevState.raquetteName).idRaquette, analyseData);
            setTextSnackbar(`Vous venez de valider ${prevState.raquetteName}`);
            setRaquettes(prev => prev.map(raquette => {
                if (raquette.nomRaquette === prevState.raquetteName) {
                    return { ...raquette, isScanned: true }
                }

                return raquette
            }
            ));
            return {
                ...prevState,
                showRaquetteSection: false,
                raquetteName: '',
            }
        });

        console.log('Réparer clicked');
    };

    const handleThrowAway = () => {
        setState(prevState => {
            const analyseData = {
                dateDebut: prevState.dateDebutScan,
                dateFin: new Date().toISOString(),
                isErreur: 2,
                kpis: prevState.kpiData
            }
            createAnalyse(idexp, idop, idtac, raquettes.find(r => r.nomRaquette === prevState.raquetteName).idRaquette, analyseData);
            setTextSnackbar(`Vous venez de jeter ${prevState.raquetteName}`);

            setRaquettes(prevRaquettes =>
                prevRaquettes.map(raquette =>
                    raquette.nomRaquette === prevState.raquetteName
                        ? { ...raquette, isScanned: true }
                        : raquette
                )
            );
            return {

                ...prevState,
                kpiData: {
                    ...prevState.kpiData,
                    kpi6: (parseInt(prevState.kpiData.kpi6) + 1).toString()
                },
                showRaquetteSection: false,
                raquetteName: '',
            }
        });
    };

    const calculateObjectiveTime = () => {
        return Object.entries(ERROR_TIMES).reduce((total, [error, time]) =>
            total + (time * (ERROR_FREQUENCIES[error] || 0)), TIME_CYCLE);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!/^(?:input|textarea|select|button)$/i.test(e.target.tagName)) {
                if (e.key !== 'Enter' && e.key !== 'Shift') {
                    setState(prev => ({
                        ...prev,
                        scannerInput: prev.scannerInput + e.key
                    }));
                } else if (e.key === 'Enter') {
                    setState(prev => {
                        const currentState = { ...prev };

                        if (!currentState.showRaquetteSection) {
                            const raquette = raquettes.find(r => r.nomRaquette === currentState.scannerInput);

                            if (raquette) {
                                if (raquette.isScanned) {
                                    setTextSnackbar(`La raquette ${currentState.scannerInput} a déjà été scannée`);
                                    return { ...currentState, scannerInput: ''};
                                } else {
                                    return {
                                        ...currentState,
                                        showRaquetteSection: true,
                                        raquetteName: currentState.scannerInput,
                                        scannerInput: '',
                                        dateDebutScan:new Date().toISOString()
                                    };
                                }
                            } else {
                                setTextSnackbar(`La raquette ${currentState.scannerInput} n'existe pas`);
                                return { ...currentState, scannerInput: '' };
                            }
                        } else {
                            switch (currentState.scannerInput.trim()) {
                                case 'Valider':
                                    handleValidate();
                                    break;
                                case 'Erreur':
                                case 'Jeter':
                                    handleThrowAway();
                                    break;
                                case 'Reparer':
                                    handleRepair();
                                    break;
                                default:
                                    console.log(currentState.scannerInput);
                                    break;
                            }
                            return { ...currentState, scannerInput: '' };
                        }
                    });
                }
            }
        };

        const raquettesNotScanned = raquettes.filter(raquette => !raquette.isScanned);

        if (raquettesNotScanned.length === 0 && !state.loading && !state.error) {
            handleFinish();
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);

        // eslint-disable-next-line
    }, [raquettes]);

    useEffect(() => {
        const initRaquettesAndVisibiliteKpi = async () => {
            const fetchedRaquettes = await getRaquettes(idexp);
            // Ajouter isScanned: false à chaque raquette
            const raquettesWithScanStatus = fetchedRaquettes.map(raquette => ({
                ...raquette,
                isScanned: false
            }));
            setRaquettes(raquettesWithScanStatus);

            const visibiliteKpi = await getVisibiliteKpi(idexp, idop, idtac);
            const kpiToShow = visibiliteKpi.visibiliteKpi.split(',');

            setState(prev => ({
                ...prev,
                visibiliteKpi: kpiToShow
            }));
        };

        const initializeData = async () => {
            try {
                await initRaquettesAndVisibiliteKpi();
                await new Promise(resolve => setTimeout(resolve, 1000));
                setState(prev => ({ ...prev, loading: false }));
            } catch (err) {
                setState(prev => ({
                    ...prev,
                    error: err.message,
                    loading: false
                }));
            }
        };

        initializeData();
        // eslint-disable-next-line
    }, [idexp, idop, idtac]);
    useEffect(() => {
        const handleUpdateKpiData = async () => {
            if (!state.raquetteName) return;

            try {
                const [
                    nbRaquettes,
                    kpi2Data,
                    kpi6Data,
                    kpi10Data,
                    kpi1Data
                ] = await Promise.all([
                    getNombreRaquettes(idexp, idop, idtac),
                    getKpi2(idexp, idop, idtac),
                    getKpi6(idexp, idop, idtac),
                    getKpi10(idexp, idop, idtac),
                    getKpi1(idexp, idop, idtac)
                ]);

                const currentRaquette = raquettes.find(
                    (raquette) => raquette.nomRaquette === state.raquetteName
                );

                if (!currentRaquette) return;

                const kpi9Data = await getKpi9(
                    idexp,
                    idop,
                    idtac,
                    currentRaquette.idRaquette
                );

                const kpi7Value = kpi6Data.raquettesJetees + kpi10Data.erreursNonDetectees;

                setState(prev => ({
                    ...prev,
                    kpiData: {
                        kpi1: kpi1Data.tempsCible,
                        kpi2: kpi2Data.nbRaquettesControlees,
                        kpi3: prev.kpiData.kpi3,
                        kpi4: (100 * kpi2Data.nbRaquettesControlees / nbRaquettes).toFixed(2),
                        kpi5: prev.kpiData.kpi5,
                        kpi6: kpi6Data.raquettesJetees,
                        kpi7: kpi7Value,
                        kpi8: (100 * (kpi2Data.nbRaquettesControlees - kpi7Value) / kpi2Data.nbRaquettesControlees).toFixed(2),
                        kpi9: kpi9Data.tempsReparation,
                        kpi10: kpi10Data.erreursNonDetectees,
                        kpi11: kpi1Data.tempsCible - prev.kpiData.kpi3
                    }
                }));
            } catch (error) {
                console.error('Error updating KPI data:', error);
                setTextSnackbar('Erreur lors de la mise à jour des KPIs');
            }
        };

        handleUpdateKpiData();
        // eslint-disable-next-line
    }, [state.raquetteName, idexp, idop, idtac, raquettes]);

    useEffect(() => {
        let interval;
        if (state.showRaquetteSection) {
            interval = setInterval(() => {
                setState(prev => {
                    const newTimer = prev.timer + 1;
                    const kpi3Value = ((newTimer / 600) * 100).toFixed(2);
                    return {
                        ...prev,
                        timer: newTimer,
                        kpiData: {
                            ...prev.kpiData,
                            kpi3: `${kpi3Value}s`
                        }
                    };
                });
            }, 1000);
        }
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [state.showRaquetteSection]);

    if (state.loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (state.error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Card>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <WarningIcon color="error" sx={{ fontSize: 48 }} />
                        <Typography color="error">Error: {state.error}</Typography>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {!state.showRaquetteSection ? (
                <Card sx={{ maxWidth: 600, margin: '0 auto' }}>
                    <CardHeader title="Scanner une raquette" />
                    <CardContent>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Scannez le code de la raquette...
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <Grid container width={"100%"} justifyContent={"space-around"}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <TimerIcon sx={{ fontSize: 30 }} />
                            <Typography variant="h4">
                                {formatTime(state.timer)}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid container height={"70vh"} width={"100%"} justifyContent={"space-between"} alignItems={"center"} sx={{ mt: 4 }}>
                        <Grid item xs={12} md={6} sx={{ display: 'flex' }} width={"45%"}>
                            <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardHeader title="Indicateurs KPI" />
                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    {Object.entries(state.kpiData).map(([key, value]) => {
                                        if (!state.visibiliteKpi.includes(key.toUpperCase())) return null;
                                        return (
                                            <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                <Typography variant="subtitle1">{KPI_LABELS[parseInt(key.slice(3)) - 1]}</Typography>
                                                <Typography>{value}</Typography>
                                            </Box>)
                                    })}
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6} sx={{ display: 'flex' }} width={"45%"}>
                            <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardHeader title={`Raquette ${state.raquetteName}`} />
                                <CardContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Box
                                        component="img"
                                        src={raquetteImage}
                                        alt="Raquette"
                                        sx={{
                                            width: '100%',
                                            height: 'auto',
                                            borderRadius: 1,
                                            maxHeight: '300px',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                </>
            )}
            <Snackbar
                open={textSnackbar !== ''}
                autoHideDuration={6000}
                onClose={() => handleCloseSnackbar()}
                message={textSnackbar}
                action={<IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={() => handleCloseSnackbar()}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>}
            />
        </Container>
    );
};

export default KpiDashboard;