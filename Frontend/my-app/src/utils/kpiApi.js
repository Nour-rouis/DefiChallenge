const API_URL = 'http://localhost:5000';

export const getKpi1 = async (idexp, idop, idtache) => {
    if (!idexp) {
        console.error("Experience ID is undefined");
        return;
    }
    try {
        const response = await fetch(`${API_URL}/experience/${idexp}/operator/${idop}/tache/${idtache}/getkpi1`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching KPI1:", error);
    }
};

export const getKpi2 = async (idexp, idop, idtache) => {
    if (!idexp) {
        console.error("Experience ID is undefined");
        return;
    }
    try {
        const response = await fetch(`${API_URL}/experience/${idexp}/operator/${idop}/tache/${idtache}/getkpi2`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching KPI2:", error);
    }
};

export const getKpi6 = async (idexp, idop, idtache) => {
    if (!idexp) {
        console.error("Experience ID is undefined");
        return;
    }
    try {
        const response = await fetch(`${API_URL}/experience/${idexp}/operator/${idop}/tache/${idtache}/getkpi6`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching KPI6:", error);
    }
}

export const getKpi9 = async (idexp, idop, idtache, idraquette) => {
    if (!idexp) {
        console.error("Experience ID is undefined");
        return;
    }
    try {
        const response = await fetch(`${API_URL}/experience/${idexp}/operator/${idop}/tache/${idtache}/analyse/${idraquette}/getkpi9`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching KPI9:", error);
    }
}

export const getKpi10 = async (idexp, idop, idtache) => {
    if (!idexp) {
        console.error("Experience ID is undefined");
        return;
    }
    try {
        const response = await fetch(`${API_URL}/experience/${idexp}/operator/${idop}/tache/${idtache}/getkpi10`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching KPI10:", error);
    }
}

export const getNombreRaquettes = async (idexp, idop, idtache) => {
    if (!idexp) {
        console.error("Experience ID is undefined");
        return;
    }
    try {
        const response = await fetch(`${API_URL}/experience/${idexp}/raquettes`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.length;
    } catch (error) {
        console.error("Error fetching Nombre Raquette:", error);
    }
}
