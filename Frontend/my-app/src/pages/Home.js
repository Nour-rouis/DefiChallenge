import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Typography, Paper, Divider, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // Importez l'icône d'ajout

function Home() {
    const [newTask, setNewTask] = useState('');
    const [tasks, setTasks] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleAddTask = () => {
        if (newTask.trim() !== '') {
            setTasks([...tasks, { id: Date.now(), text: newTask }]);
            setNewTask('');
        }
    };

    const handleDeleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const handleManageTask = (id) => {
        // Logic to manage task
    };

    const formatDate = (date) => {
        return date.toLocaleDateString();
    };

    const formatTime = (time) => {
        return time.toLocaleTimeString();
    };

    return (
        <>
           
            <Box sx={{ padding: 3, minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}> {/* Arrière-plan plus clair */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1"> {/* Titre plus important */}
                        Bienvenue
                    </Typography>
                    <Paper elevation={3} sx={{ padding: 1.5, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'white' }}> {/* Fond blanc pour l'horloge */}
                        <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 'medium', color: '#333' }}>{formatDate(currentTime)}</Typography>
                        <Divider orientation="vertical" flexItem /> {/* Séparateur vertical */}
                        <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 'medium', color: '#333' }}>{formatTime(currentTime)}</Typography>
                    </Paper>
                </Box>
                
              
                <Paper elevation={3} sx={{ padding: 3, borderRadius: '8px', flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: 'white' }}> {/* Conteneur principal avec fond blanc */}
                <Typography variant="h5" component="h2">
                    Ajoutez une nouvelle tâche
                  </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
                    
                        <TextField
                            fullWidth
                            label="Nouvelle tâche"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            onKeyPress={(e) => { if (e.key === 'Enter') { handleAddTask(); } }}
                            variant="outlined" // Style plus moderne pour le TextField
                        />
                        <Fab color="primary" aria-label="add" onClick={handleAddTask}> {/* Bouton flottant pour ajouter */}
                            <AddIcon />
                        </Fab>
                    </Box>
                    <Divider sx={{ mb: 2 }} /> {/* Séparateur avant la liste */}
                    <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
                        {tasks.map((task) => (
                            <ListItem
                                key={task.id}
                                secondaryAction={
                                    <>
                                        <IconButton edge="end" aria-label="manage" onClick={() => handleManageTask(task.id)}>
                                            <Button variant="outlined" size="small">Gérer</Button> {/* Style Outlined pour le bouton Gérer */}
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(task.id)}>
                                            <DeleteIcon color="error" /> {/* Icône de suppression en rouge */}
                                        </IconButton>
                                    </>
                                }
                                sx={{ borderBottom: '1px solid #eee' }} // Ajout d'une bordure entre les éléments de la liste
                            >
                                <ListItemText primary={task.text} primaryTypographyProps={{ variant: 'body1' }} /> {/* Style pour le texte de la tâche */}
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Box>
        </>
    );
}

export default Home;