import axios, { AxiosRequestConfig } from "axios";
import { AddToCollectionRequest } from "../models/AddToCollectionRequest";


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

  getSceneryById: async (Id: string) => {
    try {
      const response = await axios.get(`${API_URL}/Sceneries/GetScenery`, { params: { Id: Id } })
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addScenery: async (sceneryAddRequest: FormData, config: AxiosRequestConfig) => {
    try {
      const response = await axios.post(`${API_URL}/Sceneries/AddScenery`, sceneryAddRequest, {
        ...config,
        headers: {
          ...config.headers,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateScenery: async (sceneryUpdateRequest: FormData, config: AxiosRequestConfig) => {
    try {
      const response = await axios.put(`${API_URL}/Sceneries/Update`, sceneryUpdateRequest, {
        ...config,
        headers: {
          ...config.headers,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteScenery: async (Id: string, config: AxiosRequestConfig) => {
    try {
      const response = await axios.delete(`${API_URL}/Sceneries/Delete`, {
        ...config,
        headers: {
          ...config.headers,
        },
        withCredentials: true,
        params: { id: Id }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  fetchUserUpload: async (userId: number, config: AxiosRequestConfig) => {
    try {
      const response = await axios.get(`${API_URL}/Sceneries/GetSceneriesByUserId`, {
        ...config,
        headers: {
          ...config.headers,
        },
        withCredentials: true,
        params: { userId: userId }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addToCollection: async (userId: number, sceneryId: string, config: AxiosRequestConfig) => {
    try {
      const requestData: AddToCollectionRequest = {
        userId: userId,
        sceneryId: sceneryId
      };

      const response = await axios.post(`${API_URL}/Collections/AddToCollection`, requestData, {
        ...config,
        headers: {
          ...config.headers,
        },
        withCredentials: true,
      },);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  removeFromCollection: async (userId: number, sceneryId: string, config: AxiosRequestConfig) => {
    try {
      const response = await axios.delete(`${API_URL}/Collections/RemoveFromCollection`, {
        ...config,
        headers: {
          ...config.headers,
        },
        withCredentials: true,
        params: {
          userId: userId,
          sceneryId: sceneryId
        }
      },);
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  fetchUserCollection: async (userId: number, config: AxiosRequestConfig) => {
    try {
      const response = await axios.get(`${API_URL}/Collections/UserCollection`, {
        ...config,
        headers: {
          ...config.headers,
        },
        withCredentials: true,
        params: { userId: userId }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCollectionById: async (userId:number, Id: string, config: AxiosRequestConfig) => {
    try {
      const response = await axios.get(`${API_URL}/Collections/GetCollectionById`, {
        ...config,
        headers: {
          ...config.headers,
        },
        withCredentials: true,
        params: {userId: userId, sceneryId: Id}
      });
      return response.data;
    }catch (error) {
      throw error;
    }
  }
}

export default agent;