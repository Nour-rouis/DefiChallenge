import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import raquetteImage from '../assets/images/Bouton ressort monté a l_envers.jpeg';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    Box,
    CircularProgress,
    Card,
    CardContent,
    CardHeader,
    IconButton
} from '@mui/material';
import {
    Timer as TimerIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import {
    getKpi1,
    getKpi2,
    getKpi10
} from '../utils/kpiApi';

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
    const { idexp, idop, idtac} = useParams();

    const [state, setState] = useState({
        kpiData: {
            kpi1: 'Loading...',
            kpi2: '0',
            kpi3: '75s',
            kpi4: '0%',
            kpi5: '0',
            kpi6: '0',
        },
        loading: true,
        error: null,
        showRaquetteSection: false,
        scannerInput: '',
        raquetteName: '',
        timer: 0
    });
    const [kpi1, setKpi1] = useState('Loading...');
    const [kpi2, setKpi2] = useState('Loading...');
    const [kpi3, setKpi3] = useState('Loading...');
    const [kpi4, setKpi4] = useState('Loading...');
    const [kpi5, setKpi5] = useState('Loading...');
    const [kpi6, setKpi6] = useState('Loading...');
    const [kpi7, setKpi7] = useState('Loading...');
    const [kpi8, setKpi8] = useState('Loading...');
    const [kpi9, setKpi9] = useState('Loading...');
    const [kpi10, setKpi10] = useState('Loading...');
    const [kpi11, setKpi11] = useState('Loading...');

    // Constants
    const TIME_CYCLE = 10;
    const ERROR_TIMES = { T1: 2, T2: 3 };
    const ERROR_FREQUENCIES = { T1: 2, T2: 1 };

    // Effet pour gérer le focus global et la saisie
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!state.showRaquetteSection && 
                !/^(?:input|textarea|select|button)$/i.test(e.target.tagName)) {
                setState(prev => ({
                    ...prev,
                    scannerInput: prev.scannerInput + e.key
                }));
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Enter' && !state.showRaquetteSection) {
                setState(prev => ({
                    ...prev,
                    showRaquetteSection: true,
                    raquetteName: prev.scannerInput,
                    scannerInput: ''
                }));
            }
        };

        window.addEventListener('keypress', handleKeyPress);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keypress', handleKeyPress);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [state.showRaquetteSection]);

    // Gestionnaires d'événements
    const handleRepair = () => {
        setState(prev => {
            const newKpi2 = parseInt(prev.kpiData.kpi2) + 1;
            const kpi4 = (100 * newKpi2) / 30;
            const tempsObjectif = calculateObjectiveTime();
            const kpi5Value = ((100 * tempsObjectif) / parseInt(prev.kpiData.kpi3)).toFixed(2);

            return {
                ...prev,
                kpiData: {
                    ...prev.kpiData,
                    kpi2: newKpi2.toString(),
                    kpi4: `${kpi4.toFixed(2)}%`,
                    kpi5: kpi5Value
                }
            };
        });
    };

    const handleThrowAway = () => {
        setState(prev => ({
            ...prev,
            kpiData: {
                ...prev.kpiData,
                kpi6: (parseInt(prev.kpiData.kpi6) + 1).toString()
            }
        }));
    };

    // Utilitaires
    const calculateObjectiveTime = () => {
        return Object.entries(ERROR_TIMES).reduce((total, [error, time]) =>
            total + (time * (ERROR_FREQUENCIES[error] || 0)), TIME_CYCLE);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    // Effets
    useEffect(() => {
        const fetchData = async () => {
            try {
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

        const handleUpdateKpiData = async () => {
            const kpi1Data = await getKpi1(idexp, idop, idtac);
            const kpi2Data = await getKpi2(idexp, idop, idtac);
            const kpi10Data = await getKpi10(idexp, idop, idtac);
            
            console.log(kpi1Data);
            console.log(kpi2Data);
            console.log(kpi10Data);
        };

        handleUpdateKpiData();

        fetchData();
    }, [idexp]);

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
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                        <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardHeader title="Indicateurs KPI" />
                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                {Object.entries(state.kpiData).map(([key, value]) => (
                                    <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant="subtitle1">{KPI_LABELS[parseInt(key.slice(3)) - 1]}</Typography>
                                        <Typography>{value}</Typography>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
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

                    <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                        <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardHeader title="Actions" />
                            <CardContent sx={{
                                flexGrow: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                justifyContent: 'center'
                            }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<CheckCircleIcon />}
                                    onClick={handleRepair}
                                    fullWidth
                                >
                                    Réparer
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={handleThrowAway}
                                    fullWidth
                                >
                                    Jeter
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                        <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardHeader title="Chronomètre" />
                            <CardContent sx={{
                                flexGrow: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <TimerIcon sx={{ fontSize: 30 }} />
                                    <Typography variant="h4">
                                        {formatTime(state.timer)}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
};

export default KpiDashboard;