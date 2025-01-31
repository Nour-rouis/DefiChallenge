const API_URL = 'http://localhost:5000';

export const createAnalyse = async (experienceId, operatorId, taskId, raquetteId, analyseData) => {
  try {
    const formData = new FormData();
    formData.append('dateDebut', analyseData.dateDebut);
    formData.append('dateFin', analyseData.dateFin);
    formData.append('isErreur', analyseData.isErreur);
    formData.append('kpis', JSON.stringify(analyseData.kpis));

    const response = await fetch(`${API_URL}/experience/${experienceId}/operator/${operatorId}/tache/${taskId}/raquette/${raquetteId}/verification`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Échec de la création de l'analyse: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la création de l\'analyse:', error);
    throw error;
  }
};