import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Button, Box, CircularProgress } from '@mui/material';

const KpiPage = () => {
    const [kpiData, setKpiData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Commented out the actual API call to prevent it from running
        // fetch('http://localhost:5000/kpi')
        //     .then(response => {
        //         if (!response.ok) {
        //             throw new Error('Network response was not ok');
        //         }
        //         return response.json();
        //     })
        //     .then(data => {
        //         setKpiData(data);
        //         setLoading(false);
        //     })
        //     .catch(error => {
        //         setError(error);
        //         setLoading(false);
        //     });

        // Mock response for testing (replace this with actual API response later)
        const mockData = {
            kpi1: '1000',
            kpi2: '500',
            kpi3: '75%',
        };
        setKpiData(mockData);
        setLoading(false);
    }, []);

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
                                        {key}: {value}
                                    </Typography>
                                ))}
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Action Buttons Section */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                        <Typography variant="h5" gutterBottom>
                            Actions
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <Button variant="contained" color="primary" onClick={() => console.log('Réparer clicked')}>
                                Réparer
                            </Button>
                            <Button variant="contained" color="secondary" onClick={() => console.log('Jeter clicked')}>
                                Jeter
                            </Button>
                            <Button variant="contained" color="success" onClick={() => console.log('Raquette Suivante clicked')}>
                                Raquette Suivante
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Raquette Image and Name Section */}
                <Grid item xs={12}>
                    <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            Raquette Actuelle
                        </Typography>
                        <img
                            src="/path-to-raquette-image.jpg"  // Replace with actual image path
                            alt="Raquette"
                            style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }}
                        />
                        <Typography variant="body1">Nom de la raquette : Raquette XYZ</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default KpiPage;
