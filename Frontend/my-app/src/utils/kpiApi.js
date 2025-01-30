const API_URL = 'http://localhost:5000';

export const getKpi1 = async (idexp) => {
    if (!idexp) {
        console.error("Experience ID is undefined");
        return;
    }
    try {
        const response = await fetch(`${API_URL}/experience/${idexp}/getkpi1`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching KPI1:", error);
    }
};

export const getKpi5 = async (idexp) => {
    if (!idexp) {
        console.error("Experience ID is undefined");
        return;
    }
    try {
        const response = await fetch(`${API_URL}/experience/${idexp}/get_kpi5`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching KPI5:", error);
    }
};

export const getKpi10 = async (idexp) => {
    if (!idexp) {
        console.error("Experience ID is undefined");
        return;
    }
    try {
        const response = await fetch(`${API_URL}/experience/${idexp}/get_kpi10`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching KPI10:", error);
    }
};
