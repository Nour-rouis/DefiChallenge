const API_URL = 'http://localhost:5000';

export const getExperiences = async () => {
  try {
    const response = await fetch(`${API_URL}/experiences`);
    const data = await response.json();
    // Transformer idExperience en id pour le front
    return data.map(experience => ({
      ...experience,
      id: experience.idExperience,
      idExperience: undefined
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des expériences:', error);
    throw error;
  }
};

export const createExperience = async (experienceData) => {
  try {
    const formData = new FormData();
    // Transformer id en idExperience pour l'API
    const apiData = {
      ...experienceData,
      idExperience: experienceData.id,
      id: undefined
    };
    Object.keys(apiData).forEach(key => {
      if (apiData[key] !== undefined) {
        formData.append(key, apiData[key]);
      }
    });

    const response = await fetch(`${API_URL}/experience/new`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    // Transformer la réponse pour le front
    return {
      ...data,
      id: data.idExperience,
      idExperience: undefined
    };
  } catch (error) {
    console.error('Erreur lors de la création de l\'expérience:', error);
    throw error;
  }
};

export const deleteExperience = async (id) => {
  try {
    const response = await fetch(`${API_URL}/experience/${id}/delete`);
    const data = await response.json();
    // Transformer la réponse pour le front
    return {
      ...data,
      id: data.idExperience,
      idExperience: undefined
    };
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'expérience:', error);
    throw error;
  }
};

export const getExperience = async (id) => {
  try {
    const response = await fetch(`${API_URL}/experience/${id}`);
    const data = await response.json();
    // Transformer idExperience en id pour le front
    return {
      ...data,
      id: data.idExperience,
      idExperience: undefined
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'expérience:', error);
    throw error;
  }
};

export const updateExperience = async (experienceData) => {
  try {
    const formData = new FormData();
    // Transformer id en idExperience pour l'API
    const apiData = {
      ...experienceData,
      idExperience: experienceData.id,
      id: undefined
    };
    Object.keys(apiData).forEach(key => {
      if (apiData[key] !== undefined) {
        formData.append(key, apiData[key]);
      }
    });

    const response = await fetch(`${API_URL}/experience/${experienceData.id}/update`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    // Transformer la réponse pour le front
    return {
      ...data,
      id: data.idExperience,
      idExperience: undefined
    };
  } catch (error) {
    console.error('Erreur lors de la modification de l\'expérience:', error);
    throw error;
  }
}
  