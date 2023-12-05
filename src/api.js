import axios from 'axios';

const backendApi = "https://weather-app-backend-xi.vercel.app/api/cities";

export const saveCity = async (data) => {
  try {
    await axios.post(`${backendApi}`, data);
  } catch (error) {
    console.error("Error saving city:", error);
    throw error;
  }
};

export const deleteCity = async (id) => {
    try {
      await axios.delete(`${backendApi}/${id}`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error(`City with ID ${id} not found.`);
      } else {
        console.error("Error deleting city:", error);
      }
      throw error;
    }
  };
  
export const getCityList = async () => {
  try {
    const response = await axios.get(`${backendApi}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching city list:", error);
    throw error;
  }
};
