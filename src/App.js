import './App.css';
import Search from './components/search/search';
import CurrentWeather from './components/current-weather/current-weather';
import { weatherUrl, weatherApiKey } from './api';
import { useState } from 'react';
import Forecast from './components/forecast/forecast-weather';

function App() {

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastWeather, setForecastWeather] = useState(null);

  const handleOnSearchChange = (data) => {
    const [lat, lon] = data.value.split(" ");
    const currentWeatherFetch = fetch(`${weatherUrl}/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`);
    const forecastWeatherFetch = fetch(`${weatherUrl}/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`);

    Promise.all([currentWeatherFetch, forecastWeatherFetch])
    .then(async (response) => {
      const currentWeatherResponse = await response[0].json();
      const forecastWeatherResponse = await response[1].json();

      setCurrentWeather({city: data.label, ...currentWeatherResponse});
      setForecastWeather({city: data.label, ...forecastWeatherResponse});
    })
    .catch((err) => {
      console.error(err)
      return [];
    });
    
  };

  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange}/>
      {currentWeather && <CurrentWeather data={currentWeather}/>}
      {forecastWeather && <Forecast data={forecastWeather}/>}
    </div>
  );
}

export default App;
