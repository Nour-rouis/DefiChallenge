import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Button, Box, CircularProgress, TextField } from '@mui/material';
import raquetteImage from '../assets/images/Bouton ressort monté a l_envers.jpeg';

const KpiPage = () => {
    const [kpiData, setKpiData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRaquetteSection, setShowRaquetteSection] = useState(false); // State to toggle visibility
    const [scannerInput, setScannerInput] = useState(''); // State to hold scanner input
    const [raquetteName, setRaquetteName] = useState(''); // State to hold the raquette name
    const [timer, setTimer] = useState(0); // State for the timer
    const [repairTime, setRepairTime] = useState(0); // Total repair time for KPI3
    const [kpi5, setKpi5] = useState(null);
    const timeCycle = 10; // Temps moyen par cycle (en minutes)
    const errorTimes = { T1: 2, T2: 3 }; // Temps d'erreurs (T1, T2, etc.)
    const errorFrequencies = { T1: 2, T2: 1 }; // Fréquence de chaque erreur (nombre d'occurrences)

    useEffect(() => {
        // Mock response for testing (replace this with actual API response later)
        const mockData = {
            kpi1: '1000', // from API
            kpi2: '0',
            kpi3: '75s', // Placeholder for KPI3
            kpi4: '0%', 
            kpi5: '0',
            kpi6: '0', 
        };
        setKpiData(mockData);
        setLoading(false);

        // Start timer interval for total time
        const interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer + 1);
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Update KPI3 whenever the repair time changes
        const totalRepairTime = repairTime + timer;
        const kpi3Value = (totalRepairTime / 600) * 100; // Example logic for KPI3 calculation (out of 600 seconds)
        setKpiData((prevKpiData) => ({
            ...prevKpiData,
            kpi3: kpi3Value.toFixed(2) + 's', // Format KPI3 as seconds
        }));
    }, [repairTime, timer]);

    const handleInputChange = (event) => {
        setScannerInput(event.target.value);
    };

    const handleInputSubmit = (event) => {
        if (event.key === 'Enter') {
            setShowRaquetteSection(true); // Show the raquette section
            setRaquetteName(scannerInput); // Update raquette name with scanned input
            console.log('Scanned Input:', scannerInput); // Log or process the scanned input
            setScannerInput(''); // Clear the input field
        }
    };
    const calculateObjectiveTime = () => {
        let totalTime = timeCycle; // Start with the time cycle value
        // Loop through each error and calculate the additional time based on frequency
        for (let error in errorTimes) {
            if (errorFrequencies[error]) {
                totalTime += errorTimes[error] * errorFrequencies[error];
            }
        }
        return totalTime; // Return the total objective time
    };
    const handleRepair = () => {
        // Increment the value of KPI2 by 1
        setKpiData((prevKpiData) => {
            const newKpi2 = parseInt(prevKpiData.kpi2) + 1;
            const kpi4 = (100 * newKpi2) / 30; // Calculate KPI4
    
            // Calculate KPI5: Productivité à l'instant t
            const tempsObjectifDuMoment = calculateObjectiveTime(); // Get the current time (which is your "Temps objectif")
            const kpi3Value = parseInt(prevKpiData.kpi3); // Get the value of KPI3
            const kpi5Value = ((100 * tempsObjectifDuMoment) / kpi3Value).toFixed(2); // Calculate KPI5
    
            return {
                ...prevKpiData,
                kpi2: newKpi2.toString(),
                kpi4: kpi4.toFixed(2) + '%',  // Format KPI4 as a percentage
            };
        });
    
        // Update KPI5
        setKpi5(((100 * timer) / parseInt(kpiData.kpi3)).toFixed(2));
        console.log('Réparer clicked');
    };
    

    const handleThrowAway = () => {
        // Increment the value of KPI6 by 1
        setKpiData((prevKpiData) => {
            const newKpi6 = parseInt(prevKpiData.kpi6) + 1;
            return {
                ...prevKpiData,
                kpi6: newKpi6.toString(),
            };
        });
        console.log('Jeter clicked');
    };

    const handleNextRaquette = () => {
        console.log('Raquette Suivante clicked');
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography variant="h6" color="error">
                    Error: {error.message}
                </Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" style={{ marginTop: '20px' }}>
            <Grid container spacing={4}>
                {/* KPI Display Section */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                    <Typography variant="h5" gutterBottom>
                KPI Data
            </Typography>
            {kpiData && (
                <Box>
                    {Object.entries(kpiData).map(([key, value]) => (
                        <Typography key={key} variant="body1" gutterBottom>
                            {key === 'kpi1' ? 'Temps cible(kpi1)' :
                            key === 'kpi2' ? 'Nb de raquettes contrôlées(kpi2)' :
                            key === 'kpi3' ? 'Temps écoulé (kpi3)' :
                            key === 'kpi4' ? 'Taux d’avancement (en %) (kpi4)' :
                            key === 'kpi6' ? 'Nb de raquettes jetées (kpi6)' :
                            key === 'kpi5' ? 'Productivité à l’instant t (%) (kpi5)' : key
                            }
                            {`: ${key === 'kpi5' ? kpi5 : value}`}
                        </Typography>
                    ))}
                </Box>
            )}

                    
                    </Paper>
                </Grid>

                {/* Scanner Input Section */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                        <Typography variant="h5" gutterBottom>
                            Scanner Input
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <TextField
                                label="Scanner Input"
                                variant="outlined"
                                value={scannerInput}
                                onChange={handleInputChange}
                                onKeyDown={handleInputSubmit}
                                placeholder="Scan or type here"
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* Raquette Image and Name Section */}
                {showRaquetteSection && (
                    <Grid item xs={12}>
                        <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom>
                                Nom de la raquette : {raquetteName || 'Scannez une raquette pour afficher son nom'}
                            </Typography>
                            <img
                                src={raquetteImage} // Replace with actual image path
                                alt="Raquette"
                                style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }}
                            />
                        </Paper>
                    </Grid>
                )}

                {/* Action Buttons Section */}
                {showRaquetteSection && (
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                            <Typography variant="h5" gutterBottom>
                                Actions
                            </Typography>
                            <Box display="flex" flexDirection="column" gap={2}>
                                <Button variant="contained" color="primary" onClick={handleRepair}>
                                    Réparer
                                </Button>
                                <Button variant="contained" color="secondary" onClick={handleThrowAway}>
                                    Jeter
                                </Button>
                                <Button variant="contained" color="success" onClick={handleNextRaquette}>
                                    Raquette Suivante
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                )}
            </Grid>

            {/* Timer Section at the bottom of the page */}
            <Paper elevation={3} style={{ padding: '10px', textAlign: 'center', marginTop: '20px' }}>
                <Typography variant="h6" gutterBottom>
                    Timer: {formatTime(timer)}
                </Typography>
            </Paper>
        </Container>
    );
};

export default KpiPage;
