import { useState, useEffect } from "react";
import "./current-weather.css";
import { IconButton } from '@mui/material';
import { StarBorder, Star } from '@mui/icons-material';
import { addToFavorites, removeFromFavorites, getFavoritesByUserId, getLocationDataById } from "../firebase-interaction/firestore-interaction";
import { db } from "../../config/firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";


const CurrentWeather = ({ data }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const mockUserId = 'Sndjs24hb3FH2kk33'
    const [userId, setUserId] = useState(mockUserId);
    const [locationId, setLocationId] = useState('');

    useEffect(() => {
        fetchLocationId();
    }, [data]);

    const fetchLocationId = async () => {
    try {
        if (data.city) {
            const favoriteLocationIds = await getFavoritesByUserId(userId);
            const favoriteLocationsData = await getLocationDataById(favoriteLocationIds);
            const isFavorite = favoriteLocationsData.some(favorite =>
                favorite.city === data.city.split(",")[0] &&
                favorite.country_code === data.city.split(",")[1]
            );

            setIsFavorite(isFavorite);
        }
    } catch (error) {
        console.error('Error fetching location id:', error);
    }
};


    const toggleFavorite = async () => {
      setIsFavorite(prev => !prev);
      if (!isFavorite) {
        const newLocationId = await addToFavorites(userId, {
            city: data.city.split(",")[0],
            country_code: data.city.split(",")[1],
            latitude: data.coord.lat,
            longitude: data.coord.lon
        });
        setLocationId(newLocationId);
      } else {
        await removeFromFavorites(userId, {
            city: data.city.split(",")[0],
            country_code: data.city.split(",")[1]
        })

      }
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