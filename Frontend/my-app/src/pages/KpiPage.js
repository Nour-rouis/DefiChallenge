import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Button, Box, CircularProgress, TextField } from '@mui/material';
import raquetteImage from '../assets/images/Bouton ressort monté a l_envers.jpeg';
import { getKpi1 } from '../utils/kpiApi';

const KpiPage = ({ idexp }) => {
    const [kpiData, setKpiData] = useState({
        kpi1: 'Loading...',
        kpi2: '0',
        kpi3: '75s',
        kpi4: '0%',
        kpi5: '0',
        kpi6: '0',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRaquetteSection, setShowRaquetteSection] = useState(false);
    const [scannerInput, setScannerInput] = useState('');
    const [raquetteName, setRaquetteName] = useState('');
    const [timer, setTimer] = useState(0);
    const timeCycle = 10; 
    const errorTimes = { T1: 2, T2: 3 };
    const errorFrequencies = { T1: 2, T2: 1 };

    useEffect(() => {
        const fetchKpiData = async () => {
            try {
                const kpi1Value = await getKpi1(idexp);
                setKpiData(prev => ({ ...prev, kpi1: kpi1Value }));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchKpiData();
        const interval = setInterval(() => setTimer(prev => prev + 1), 1000);
        return () => clearInterval(interval);
    }, [idexp]);

    useEffect(() => {
        const totalRepairTime = timer;
        const kpi3Value = (totalRepairTime / 600) * 100;
        setKpiData(prev => ({ ...prev, kpi3: kpi3Value.toFixed(2) + 's' }));
    }, [timer]);

    const handleInputSubmit = (event) => {
        if (event.key === 'Enter') {
            setShowRaquetteSection(true);
            setRaquetteName(scannerInput);
            setScannerInput('');
        }
    };

    const calculateObjectiveTime = () => {
        return Object.keys(errorTimes).reduce((total, error) => {
            return total + (errorTimes[error] * (errorFrequencies[error] || 0));
        }, timeCycle);
    };

    const handleRepair = () => {
        setKpiData(prev => {
            const newKpi2 = parseInt(prev.kpi2) + 1;
            const kpi4 = (100 * newKpi2) / 30;
            const tempsObjectifDuMoment = calculateObjectiveTime();
            const kpi5Value = ((100 * tempsObjectifDuMoment) / parseInt(prev.kpi3)).toFixed(2);
            return { ...prev, kpi2: newKpi2.toString(), kpi4: kpi4.toFixed(2) + '%', kpi5: kpi5Value };
        });
    };

    const handleThrowAway = () => {
        setKpiData(prev => ({ ...prev, kpi6: (parseInt(prev.kpi6) + 1).toString() }));
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
    if (error) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><Typography variant="h6" color="error">Error: {error}</Typography></Box>;

    return (
        <Container maxWidth="lg" style={{ marginTop: '20px' }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <Typography variant="h5" gutterBottom>KPI Data</Typography>
                        {Object.entries(kpiData).map(([key, value]) => (
                            <Typography key={key} variant="body1" gutterBottom>
                                {`${key.replace('kpi', 'KPI ')}: ${value}`}
                            </Typography>
                        ))}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                        <Typography variant="h5" gutterBottom>Scanner Input</Typography>
                        <TextField label="Scanner Input" variant="outlined" value={scannerInput} onChange={(e) => setScannerInput(e.target.value)} onKeyDown={handleInputSubmit} placeholder="Scan or type here" />
                    </Paper>
                </Grid>
                {showRaquetteSection && (
                    <Grid item xs={12}>
                        <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom>Nom de la raquette : {raquetteName || 'Scannez une raquette pour afficher son nom'}</Typography>
                            <img src={raquetteImage} alt="Raquette" style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }} />
                        </Paper>
                    </Grid>
                )}
                {showRaquetteSection && (
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                            <Typography variant="h5" gutterBottom>Actions</Typography>
                            <Box display="flex" flexDirection="column" gap={2}>
                                <Button variant="contained" color="primary" onClick={handleRepair}>Réparer</Button>
                                <Button variant="contained" color="secondary" onClick={handleThrowAway}>Jeter</Button>
                            </Box>
                        </Paper>
                    </Grid>
                )}
            </Grid>
            <Paper elevation={3} style={{ padding: '10px', textAlign: 'center', marginTop: '20px' }}>
                <Typography variant="h6" gutterBottom>Timer: {formatTime(timer)}</Typography>
            </Paper>
        </Container>
    );
};

export default KpiPage;