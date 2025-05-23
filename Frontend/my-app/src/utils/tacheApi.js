const API_URL = 'http://localhost:5000';

export const createTache = async (iaNbErreurDetecte, visibiliteKpi, idExp, idOpe) => {
  const formData = new FormData();
  formData.append('iaNbErreurDetecte', iaNbErreurDetecte);
  formData.append('visibiliteKpi', visibiliteKpi);

  const response = await fetch(`${API_URL}/experience/${idExp}/operator/${idOpe}/tache/new`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Failed to create raquette: ${response.statusText}`);
  }
  
  return await response.json();
}

export const getNbTacheParOperateur = async (idExp, idOpe) => {
  const response = await fetch(`${API_URL}/experience/${idExp}/operator/${idOpe}/nbtaches`);
  if (!response.ok) {
    throw new Error(`Failed to fetch tache count: ${response.statusText}`);
  }
  return await response.json();
}

export const getVisibiliteKpi = async (idExp, idOpe, idTache) => {
  const response = await fetch(`${API_URL}/experience/${idExp}/operator/${idOpe}/tache/${idTache}/getVisibiliteKpi`);
  if (!response.ok) {
    throw new Error(`Failed to fetch tache count: ${response.statusText}`);
  }
  return await response.json();
}

export const getErreurToShow = async (idExp, idOpe, idTache) => {
  const response = await fetch(`${API_URL}/experience/${idExp}/operator/${idOpe}/tache/${idTache}/getErreurAffiche`);
  if (!response.ok) {
    throw new Error(`Failed to fetch tache count: ${response.statusText}`);
  }
  return await response.json();
}

export const exportTache = async (idExp, idOpe, idTache) => {
  const response = await fetch(`${API_URL}/experience/${idExp}/operator/${idOpe}/tache/${idTache}/export`);
  if (!response.ok) {
    throw new Error(`Failed to fetch tache count: ${response.statusText}`);
  }
  return await response.json();
}