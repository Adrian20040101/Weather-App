import { useState } from "react";
import "./current-weather.css";
import { IconButton } from '@mui/material';
import { StarBorder, Star } from '@mui/icons-material';


const CurrentWeather = ({ data }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    const toggleFavorite = () => {
      setIsFavorite(prev => !prev);
    };

    return (
        
        <div className="weather">
            <div className="top">
                <div className="favorite-icon">
                    <IconButton onClick={toggleFavorite} edge="end">
                        {isFavorite ? <Star sx={{color: 'yellow'}} /> : <StarBorder sx={{color: 'yellow'}} />}
                    </IconButton>
                </div>
                <div>
                    <p className="city"> {data.city} </p>
                    <p className="weather-description"> {data.weather[0].description} </p>
                </div>
                <img alt="weather" className="weather-icon" src={`icons/${data.weather[0].icon}.png`}></img>
            </div>
            <div className="bottom">
                <p className="temperature"> {Math.round(data.main.temp)}°C </p>
                <div className="details">
                    <div className="parameter-row">
                        <span className="parameter-label"> Details </span>
                    </div>
                    <div className="parameter-row">
                        <span className="parameter-label"> Feels Like </span>
                        <span className="parameter-value"> {Math.round(data.main.feels_like)}°C </span>
                    </div>
                    <div className="parameter-row">
                        <span className="parameter-label"> Wind </span>
                        <span className="parameter-value"> {data.wind.speed} m/s </span>
                    </div>
                    <div className="parameter-row">
                        <span className="parameter-label"> Humidity </span>
                        <span className="parameter-value"> {data.main.humidity}% </span>
                    </div>
                    <div className="parameter-row">
                        <span className="parameter-label"> Pressure </span>
                        <span className="parameter-value"> {data.main.pressure} Pa </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CurrentWeather;