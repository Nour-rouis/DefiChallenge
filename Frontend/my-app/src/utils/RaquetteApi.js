const API_URL = 'http://localhost:5000';

export const createRaquette = async (raquette, id) => {
  const formData = new FormData();
  formData.append('nomRaquette', raquette.idRaquette);
  formData.append('idErreur', null);

  const response = await fetch(`${API_URL}/experience/${id}/raquette/new`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Failed to create raquette: ${response.statusText}`);
  }
}

export const getRaquettes = async (id) => {
    const response = await fetch(`${API_URL}/experience/${id}/raquettes`);
    if (!response.ok) {
        throw new Error(`Failed to get raquette: ${response.statusText}`);
    }
    return await response.json();
}

export const deleteRaquette = async (experienceId, raquetteId) => {
  const response = await fetch(`${API_URL}/experience/${experienceId}/raquette/${raquetteId}/delete`, {
      method: 'GET'
  });

  if (!response.ok) {
      throw new Error(`Failed to delete raquette: ${response.statusText}`);
  }

  return await response.json();
}