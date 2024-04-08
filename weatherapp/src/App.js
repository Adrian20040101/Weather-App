import './App.css';
import Search from './components/search/search';
import CurrentWeather from './components/current-weather/current-weather';

function App() {

  const handleOnSearchChange = (data) => {
    const [lat, lon] = data.value.split(" ");
    
    const currentWeatherFetch = fetch()
  }

  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange}/>
      <CurrentWeather />
    </div>
  );
}

export default App;
