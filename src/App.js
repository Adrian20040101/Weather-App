import './App.css';
import Search from './components/search/search';
import CurrentWeather from './components/current-weather/current-weather';
import { weatherUrl, weatherApiKey } from './api';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Forecast from './components/forecast/forecast-weather';
import LoginPage from './components/authentication/login'
import SignupPage from './components/authentication/signup';
import { auth } from './config/firebase-config';

function App() {

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastWeather, setForecastWeather] = useState(null);
  const [user, setUser] = useState(null);


  useEffect(() => {
    const isLoggedIn = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => isLoggedIn();
}, []);

  const handleOnSearchChange = (data) => {
    const [lat, lon] = data.value.split(" ");

    const currentWeatherFetch = fetch(`${weatherUrl}/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`);
    const forecastWeatherFetch = fetch(`${weatherUrl}/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`);

    Promise.all([currentWeatherFetch, forecastWeatherFetch])
    .then(async (response) => {
      const currentWeatherResponse = await response[0].json();
      const forecastWeatherResponse = await response[1].json();

      console.log(currentWeatherResponse);

      setCurrentWeather({city: data.label, ...currentWeatherResponse});
      setForecastWeather({city: data.label, ...forecastWeatherResponse});
    })
    .catch((err) => {
      console.error(err)
      return [];
    });
    
  };

  return (
    <Router>
      <div className="container">
        <Switch>
          <Route path="/" exact>
            <Search onSearchChange={handleOnSearchChange} userId={user ? user.uid : null}/>
            {currentWeather && <CurrentWeather data={currentWeather} userId={user ? user.uid : null}/>}
            {forecastWeather && <Forecast data={forecastWeather}/>}
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/signup">
            <SignupPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
