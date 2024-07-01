import axios, { AxiosRequestConfig } from "axios";
import { AddToCollectionRequest } from "../models/AddToCollectionRequest";

// Retrieve API_URL from environment variables using Vite's import.meta
const API_URL = import.meta.env.VITE_API_URL;

// Define an agent object to encapsulate API calls
const agent = {
  // Function to fetch all sceneries
  getAllSceneries: async () => {
    try {
      const response = await axios.get(`${API_URL}/Sceneries/Index`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Function to fetch a scenery by its ID
  getSceneryById: async (Id: string) => {
    try {
      const response = await axios.get(`${API_URL}/Sceneries/GetScenery`, { params: { Id: Id } })
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Function to add a new scenery
  addScenery: async (sceneryAddRequest: FormData, config: AxiosRequestConfig) => {
    try {
      const response = await axios.post(`${API_URL}/Sceneries/AddScenery`, sceneryAddRequest, {
        ...config,
        headers: {
          ...config.headers,
        },
        // Send credentials with request
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Function to update an existing scenery
  updateScenery: async (sceneryUpdateRequest: FormData, config: AxiosRequestConfig) => {
    try {
      const response = await axios.put(`${API_URL}/Sceneries/Update`, sceneryUpdateRequest, {
        ...config,
        headers: {
          ...config.headers,
        },
        // Send credentials with request
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Function to delete a scenery by its ID
  deleteScenery: async (Id: string, config: AxiosRequestConfig) => {
    try {
      const response = await axios.delete(`${API_URL}/Sceneries/Delete`, {
        ...config,
        headers: {
          ...config.headers,
        },
        // Send credentials with request
        withCredentials: true,
        // Parameters for the request
        params: { id: Id }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Function to fetch sceneries uploaded by a specific user
  fetchUserUpload: async (userId: number, config: AxiosRequestConfig) => {
    try {
      const response = await axios.get(`${API_URL}/Sceneries/GetSceneriesByUserId`, {
        ...config,
        headers: {
          ...config.headers,
        },
        // Send credentials with request
        withCredentials: true,
        // Parameters for the request
        params: { userId: userId }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Function to add a scenery to a user's collection
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
        // Send credentials with request
        withCredentials: true,
      },);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Function to remove a scenery from a user's collection
  removeFromCollection: async (userId: number, sceneryId: string, config: AxiosRequestConfig) => {
    try {
      const response = await axios.delete(`${API_URL}/Collections/RemoveFromCollection`, {
        ...config,
        headers: {
          ...config.headers,
        },
        // Send credentials with request
        withCredentials: true,
        // Parameters for the request
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

  // Function to fetch a user's collection of sceneries
  fetchUserCollection: async (userId: number, config: AxiosRequestConfig) => {
    try {
      const response = await axios.get(`${API_URL}/Collections/UserCollection`, {
        ...config,
        headers: {
          ...config.headers,
        },
        // Send credentials with request
        withCredentials: true,
        // Parameters for the request
        params: { userId: userId }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Function to fetch a collection by its ID
  getCollectionById: async (userId: number, Id: string, config: AxiosRequestConfig) => {
    try {
      const response = await axios.get(`${API_URL}/Collections/GetCollectionById`, {
        ...config,
        headers: {
          ...config.headers,
        },
        // Send credentials with request
        withCredentials: true,
        // Parameters for the request
        params: { userId: userId, sceneryId: Id }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default agent;