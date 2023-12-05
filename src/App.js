import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { fetchWeatherData } from './client';
import { saveCity, deleteCity, getCityList } from './api';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { showToast } from './components/toasthelper.jsx';


function App() {
  const [search, setSearch] = useState("");
  const [cityList, setCityList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCityListFromLocalStorage = async () => {
      try {
        setLoading(true);
        const savedCityList = localStorage.getItem('cityList');
        if (savedCityList) {
          setCityList(JSON.parse(savedCityList));
        }
      } catch (error) {
        console.error("Error fetching city list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCityListFromLocalStorage();
  }, []); 

  const searchPressed = async () => {
    try {
      setLoading(true);
      const newWeatherData = await fetchWeatherData(search);

      if (newWeatherData && newWeatherData.main && newWeatherData.main.temp && newWeatherData.weather && newWeatherData.weather[0]) {
        await saveCity({
          name: newWeatherData.name,
          temperature: newWeatherData.main.temp,
          condition: newWeatherData.weather[0].main,
          description: newWeatherData.weather[0].description,
        });

        const updatedCityList = await getCityList();
        setCityList(updatedCityList);
        localStorage.setItem('cityList', JSON.stringify(updatedCityList));

        showToast('City added successfully!', 'success');
      } else {
        console.error("Invalid data format from OpenWeatherMap API");
        showToast('Unable to fetch data. Please enter a valid city name.', 'error');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast('Unable to fetch data. Please enter a valid city name.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCity = async (id, index) => {
    try {
      setLoading(true);
      console.log("Deleting city with ID:", id);
      await deleteCity(id);

      const updatedCityList = await getCityList();
      setCityList(updatedCityList);
      localStorage.setItem('cityList', JSON.stringify(updatedCityList));

      showToast('City deleted successfully!', 'success');
    } catch (error) {
      console.error("Error deleting city:", error);
      showToast('Error deleting city. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
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

        {loading ? (
          <LoadingSpinner />
        ) : (
          cityList.length > 0 && (
            <div className="weather-cards-container">
              {cityList.map((city, index) => (
                <div key={index} className="weather-card">
                  <p>Location: {city.name}</p>

                  {city.temperature && (
                    <p>Temperature: {city.temperature}°C</p>
                  )}

                  {city.condition && (
                    <div>
                      <p>Condition: {city.condition}</p>
                      <p>Description: {city.description}</p>
                    </div>
                  )}

                  <button className="delete-btn" onClick={() => handleDeleteCity(city._id, index)}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </>
  );
}

export default App;
