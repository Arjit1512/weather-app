import axios from 'axios';

const api = {
  key: "10a877bf622fad509b601833e6a9d1b3",
  base: "https://api.openweathermap.org/data/2.5/",
};

export const fetchWeatherData = async (search) => {
  try {
    const response = await axios.get(`${api.base}weather?q=${search}&units=metric&APPID=${api.key}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};
