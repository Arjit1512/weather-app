import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const api = {
  key: "10a877bf622fad509b601833e6a9d1b3",
  base: "https://api.openweathermap.org/data/2.5/",
};

const backendApi = "https://weather-app-backend-arjits-projects-48c7f67d.vercel.app";

function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState({});
  const [cityList, setCityList] = useState([]);
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
  
        // Check if the required properties exist before accessing them
        if (newWeatherData && newWeatherData.main && newWeatherData.main.temp && newWeatherData.weather && newWeatherData.weather[0]) {
          // Save new city to MongoDB
          axios.post(`${backendApi}`, {
            name: newWeatherData.name,
            temperature: newWeatherData.main.temp,
            condition: newWeatherData.weather[0].main,
            description: newWeatherData.weather[0].description,
          }).then(() => {
            // Fetch the updated city list from MongoDB
            axios.get(`${backendApi}`)
              .then((response) => {
                setCityList(response.data);
                localStorage.setItem('cityList', JSON.stringify(response.data));
              })
              .catch((error) => {
                console.error("Error fetching city list:", error);
              });
          })
          .catch((error) => {
            console.error("Error saving city to MongoDB:", error);
          });
        } else {
          console.error("Invalid data format from OpenWeatherMap API");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  
  const deleteCity = (id, index) => {
    console.log("Deleting city with ID:", id);
    axios.delete(`${backendApi}/${id}`)
      .then(() => {
        // Fetch the updated city list from MongoDB
        axios.get(`${backendApi}`)
          .then((response) => {
            setCityList(response.data);
            localStorage.setItem('cityList', JSON.stringify(response.data));
          })
          .catch((error) => {
            console.error("Error fetching city list:", error);
          });
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
  {city.temperature && (
    <p>Temperature: {city.temperature}°C</p>
  )}

  {/* Condition (Sunny ) */}
  {city.condition && (
    <div>
      <p>Condition: {city.condition}</p>
      <p>Description: {city.description}</p>
    </div>
  )}

  {/* Delete button with dustbin icon */}
  <button className="delete-btn" onClick={() => deleteCity(city._id, index)}>
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
