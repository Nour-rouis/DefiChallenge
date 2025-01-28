const API_URL = 'http://localhost:5000';

export const getErreurs = async (experienceId) => {
    try {
        const response = await fetch(`${API_URL}/experience/${experienceId}/erreurs`);
        const data = await response.json();
        return data.map(erreur => ({
            ...erreur,
            id: erreur.idErreur,
            idErreur: undefined
        }));
    } catch (error) {
        console.error('Erreur lors de la récupération des erreurs:', error);
        throw error;
    }
};

export const createErreur = async (experienceId, erreurData) => {
    try {
        const formData = new FormData();
        formData.append('nom', erreurData.nom);
        formData.append('tempsDefaut', erreurData.tempsDefaut);
        if (erreurData.image) {
            formData.append('image', erreurData.image);
        }

        const response = await fetch(`${API_URL}/experience/${experienceId}/erreur/new`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        return {
            ...data,
            id: data.idErreur,
            idErreur: undefined
        };
    } catch (error) {
        console.error('Erreur lors de la création de l\'erreur:', error);
        throw error;
    }
};

export const deleteErreur = async (experienceId, erreurId) => {
    try {
        const response = await fetch(`${API_URL}/experience/${experienceId}/erreur/${erreurId}/delete`, {
            method: 'GET'
        });
        const data = await response.json();
        return {
            ...data,
            id: data.idErreur,
            idErreur: undefined
        };
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'erreur:', error);
        throw error;
    }
};

export const updateErreur = async (experienceId, erreurId, erreurData) => {
    try {
        const formData = new FormData();
        formData.append('nom', erreurData.nom);
        formData.append('tempsDefaut', erreurData.tempsDefaut);
        if (erreurData.image) {
            formData.append('image', erreurData.image);
        }

        const response = await fetch(`${API_URL}/experience/${experienceId}/erreur/${erreurId}/update`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        return {
            ...data,
            id: data.idErreur,
            idErreur: undefined
        };
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'erreur:', error);
        throw error;
    }
};