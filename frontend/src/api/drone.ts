import axios from "./axios";

export const getDrones = async () => {
    try {
        const response = await axios.get("/drones");
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getRecentDrones = async () => {
    try {
        const response = await axios.get("/drones/recents");
        return response.data;
    } catch (error) {
        console.error(error);
    }
}