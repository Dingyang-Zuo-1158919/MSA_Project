import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const agent = {
    getAllSceneries: async () => {
        try {
            const response = await axios.get(`${API_URL}/Sceneries/Index`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    addScenery: async (sceneryAddRequest: object) => {
        try {
            const response = await axios.post(`${API_URL}/Sceneries/AddScenery`, sceneryAddRequest);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateScenery: async (sceneryUpdateRequest: object) => {
        try {
          const response = await axios.put(`${API_URL}/Sceneries/Update`, sceneryUpdateRequest);
          return response.data;
        } catch (error) {
          throw error;
        }
      },
    
      deleteScenery: async (scenery: object) => {
        try {
          const response = await axios.delete(`${API_URL}/Sceneries/Delete`, scenery);
          return response.data;
        } catch (error) {
          throw error;
        }
      }

}

export default agent;