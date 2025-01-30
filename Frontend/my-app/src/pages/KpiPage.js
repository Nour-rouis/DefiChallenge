import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Button, Box, CircularProgress, TextField } from '@mui/material';
import raquetteImage from '../assets/images/Bouton ressort monté a l_envers.jpeg';
import { useNavigate, useParams } from 'react-router-dom';
import { getKpi5, getKpi1, getKpi10 } from '../utils/kpiApi';
import * as XLSX from 'xlsx'; // Import the xlsx library

const KpiPage = () => {
    const [kpiData, setKpiData] = useState({
        kpi1: '10',
        kpi2: '0',
        kpi3: '0s',
        kpi4: '0%',
        kpi5: '0',
        kpi6: '0',
        kpi7: '0',
        kpi8: '0',
        kpi9: '10',
        kpi10: '0',
        kpi11: '0',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRaquetteSection, setShowRaquetteSection] = useState(false);
    const [scannerInput, setScannerInput] = useState('');
    const [raquetteName, setRaquetteName] = useState('');
    const [timer, setTimer] = useState(0);
    const [repairTime, setRepairTime] = useState(0);
    const [kpi5, setKpi5] = useState('0');
    const [kpi1, setKpi1] = useState('0');
    const [kpi10, setKpi10] = useState('0');
    const navigate = useNavigate();
    const { idexp } = useParams();

    // Function to export KPI data to Excel
    const exportToExcel = () => {
        // Convert kpiData object to an array of objects
        const data = Object.entries(kpiData).map(([key, value]) => ({
            KPI: key,
            Value: value,
        }));

        // Create a worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Create a workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'KPI Data');

        // Generate Excel file and trigger download
        XLSX.writeFile(workbook, 'KPI_Data.xlsx');
    };

    useEffect(() => {
        const fetchKpi5 = async () => {
            try {
                setLoading(true);
                const fetchedKpi5 = await getKpi5(idexp);
                setKpi5(fetchedKpi5 || '0');
            } catch (error) {
                console.error('Error fetching KPI5:', error);
                setError('Failed to load KPI5');
            } finally {
                setLoading(false);
            }
        };

        const fetchKpi1 = async () => {
            try {
                setLoading(true);
                const fetchedKpi1 = await getKpi1(idexp);
                setKpi1(fetchedKpi1 || '0');
            } catch (error) {
                console.error('Error fetching KPI1:', error);
                setError('Failed to load KPI1');
            } finally {
                setLoading(false);
            }
        };

        const fetchKpi10 = async () => {
            try {
                setLoading(true);
                const fetchedKpi10 = await getKpi10(idexp);
                setKpi10(fetchedKpi10 || '0');
            } catch (error) {
                console.error('Error fetching KPI10:', error);
                setError('Failed to load KPI10');
            } finally {
                setLoading(false);
            }
        };

        if (idexp) {
            fetchKpi5();
            fetchKpi1();
            fetchKpi10();
        }
    }, [idexp]);

    useEffect(() => {
        if (kpi5 !== null && kpi1 !== null && kpi10 !== null) {
            setKpiData((prevKpiData) => ({
                ...prevKpiData,
                kpi1: kpi1.toString(),
                kpi5: kpi5.toString(),
                kpi10: kpi10.toString(),
                kpi7: (parseInt(kpi10) + parseInt(prevKpiData.kpi6)).toString(),
                kpi8: ((100 * (parseInt(prevKpiData.kpi2) - (parseInt(kpi10) + parseInt(prevKpiData.kpi6))) / parseInt(prevKpiData.kpi2)).toFixed(2) + '%'),
                kpi11: (parseInt(kpi1) - parseInt(prevKpiData.kpi3)).toString(),
            }));
        }
    }, [kpi5, kpi1, kpi10]);

    useEffect(() => {
        const totalRepairTime = repairTime + timer;
        setKpiData((prevKpiData) => ({
            ...prevKpiData,
            kpi3: totalRepairTime + 's',
        }));
    }, [repairTime, timer]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleInputChange = (event) => {
        setScannerInput(event.target.value);
    };

    const handleInputSubmit = (event) => {
        if (event.key === 'Enter') {
            setShowRaquetteSection(true);
            setRaquetteName(scannerInput);
            console.log('Scanned Input:', scannerInput);
            setScannerInput('');
        }
    };

    const handleRepair = () => {
        setKpiData((prevKpiData) => {
            const newKpi2 = parseInt(prevKpiData.kpi2) + 1;
            const kpi4 = (100 * newKpi2) / 30;

            const tempsObjectifDuMoment = kpi5 ? parseInt(kpi5) : 0;
            const kpi3Value = parseInt(prevKpiData.kpi3);

            const kpi5Value = kpi3Value !== 0 ? (100 * tempsObjectifDuMoment) / kpi3Value : 0;

            return {
                ...prevKpiData,
                kpi2: newKpi2.toString(),
                kpi4: kpi4.toFixed(2) + '%',
                kpi5: kpi5Value.toFixed(2) + '%',
            };
        });

        console.log('Réparer clicked');
    };

    const handleThrowAway = () => {
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
        setTimer(0);
        setRepairTime(0);
        setShowRaquetteSection(false);
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
                    Error: {error}
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
                        <Box>
                            {Object.entries(kpiData).map(([key, value]) => (
                                <Typography key={key} variant="body1" gutterBottom>
                                    {key === 'kpi1' ? 'Temps cible (kpi1)' :
                                     key === 'kpi2' ? 'Nb de raquettes contrôlées (kpi2)' :
                                     key === 'kpi3' ? 'Temps écoulé (kpi3)' :
                                     key === 'kpi4' ? 'Taux d’avancement (en %) (kpi4)' :
                                     key === 'kpi6' ? 'Nb de raquettes jetées (kpi6)' :
                                     key === 'kpi5' ? 'Productivité à l’instant t (%) (kpi5)' : key
                                    }
                                    {`: ${value}`}
                                </Typography>
                            ))}
                        </Box>
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
                                src={raquetteImage}
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
                                <Button variant="contained" color="info" onClick={exportToExcel}>
                                    Exporter les KPI en Excel
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                )}
            </Grid>

            {/* Timer Section */}
            <Paper elevation={3} style={{ padding: '10px', textAlign: 'center', marginTop: '20px' }}>
                <Typography variant="h6" gutterBottom>
                    Timer: {formatTime(timer)}
                </Typography>
            </Paper>
        </Container>
    );
};

export default KpiPage;