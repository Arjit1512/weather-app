import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const api = {
  key: "10a877bf622fad509b601833e6a9d1b3",
  base: "https://api.openweathermap.org/data/2.5/",
};

const deleteApi = "https://jsonplaceholder.typicode.com/posts"; // Replace with your actual delete endpoint

function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState({});
  const [cityList, setCityList] = useState([]);

  // Load city list from localStorage on component mount
  useEffect(() => {
    const savedCityList = localStorage.getItem('cityList');
    if (savedCityList) {
      setCityList(JSON.parse(savedCityList));
    }
  }, []);

  const searchPressed = () => {
    axios.get(`${api.base}weather?q=${search}&units=metric&APPID=${api.key}`)
      .then((response) => {
        const newWeatherData = response.data;

        // Save new city to cityList
        setCityList((prevCityList) => [...prevCityList, newWeatherData]);

        // Save updated cityList to localStorage
        localStorage.setItem('cityList', JSON.stringify(cityList));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const deleteCity = (id, index) => {
    // Simulate delete request using axios.delete
    axios.delete(`${deleteApi}/${id}`)
      .then(() => {
        const updatedCityList = cityList.filter((_, i) => i !== index);
        setCityList(updatedCityList);
        localStorage.setItem('cityList', JSON.stringify(updatedCityList));
      })
      .catch((error) => {
        console.error("Error deleting city:", error);
      });
  };

  return (
    <div className="App">
      <h1>Weather App</h1>

      <div>
        <input
          type="text"
          placeholder="Add your city..."
          onChange={(e) => setSearch(e.target.value)}
        ></input>

        <button onClick={searchPressed}>Add</button>
      </div>

      {cityList.length > 0 && (
        <div className="weather-cards-container">
          {cityList.map((city, index) => (
            <div key={index} className="weather-card">
              {/* Location */}
              <p>Location: {city.name}</p>

              {/* Temperature Celsius */}
              <p>Temperature: {city.main.temp}°C</p>

              {/* Condition (Sunny ) */}
              <p>Condition: {city.weather[0].main}</p>
              <p>Description: {city.weather[0].description}</p>

              {/* Delete button with dustbin icon */}
              <button className="delete-btn" onClick={() => deleteCity(city.id, index)}>
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
