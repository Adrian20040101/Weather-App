import React, { useState, useEffect } from "react";
import { AsyncPaginate } from 'react-select-async-paginate';
import { url, geoApiOptions } from "../../api";
import './search.css';
import UserFavorites from '../favorites-retrieval/favorites'
import CurrentWeather from "../current-weather/current-weather";
import { getFavoritesByUserId, getLocationDataById } from "../firebase-interaction/firestore-interaction";
import { fetchWeatherData } from "../../api";

const Search = ({onSearchChange, userId}) => {

    const [search, setSearch] = useState(null);
    const [favoriteLocations, setFavoriteLocations] = useState([]);
    const [favoriteWeatherData, setFavoriteWeatherData] = useState([]);

    useEffect(() => {
        if (userId) {
            fetchFavoriteLocations();
        }
    }, [userId]);

    const fetchFavoriteLocations = async () => {
        try {
            const favoriteLocationIds = await getFavoritesByUserId(userId);
            const favoriteLocationsData = await getLocationDataById(favoriteLocationIds);
            setFavoriteLocations(favoriteLocationsData);
            const favoriteWeatherDetails = await fetchWeatherForFavorites(favoriteLocationsData);
            setFavoriteWeatherData(favoriteWeatherDetails);
        } catch (error) {
            console.error('Error fetching favorite locations:', error);
        }
    };

    const fetchWeatherForFavorites = async (favoriteLocations) => {
        try {
            const favoriteWeatherData = [];
            for (const location of favoriteLocations) {
                const weatherData = await fetchWeatherData(location.latitude, location.longitude);
                favoriteWeatherData.push({ location, weatherData });
            }
            return favoriteWeatherData;
        } catch (error) {
            console.error('Error fetching weather data for favorites:', error);
            throw error;
        }
    };

    const loadOptions = async (input) => {
        return fetch (
            `${url}/cities?minPopulation=0&namePrefix=${input}`,
            geoApiOptions
        )
        .then((response) => response.json())
        .then((response) => {
            return {
                options: response.data.map((city) => {
                    return {
                        value: `${city.latitude} ${city.longitude}`,
                        label: `${city.name}, ${city.countryCode}`,
                    }
                })
            }
        })
        .catch((err) => console.error(err));
    };

    const handleOnChange = (data) => {
        setSearch(data);
        onSearchChange(data);
    }

    const handleFavoriteWeatherClick = (latitude, longitude, city, countryCode) => {
        const selectedOption = { value: `${latitude} ${longitude}`, label: `${city},${countryCode}` };
        setSearch(selectedOption);
        handleOnChange(selectedOption);
    };
    

    return (
        <div>
            <AsyncPaginate
                placeholder="Search for a city..."
                debounceTimeout={600}
                value={search}
                onChange={handleOnChange}
                loadOptions={loadOptions}
            />

            {!search && (
                <>
                    <div className="favorite-locations">
                        Favorites
                        {favoriteWeatherData.map(({ location, weatherData }) => (
                            <div onClick={() => handleFavoriteWeatherClick(location.latitude, location.longitude, location.city, location.country_code)}>
                                <CurrentWeather data={{ ...weatherData, city: `${location.city},${location.country_code}` }} />
                            </div>
                        ))}

                    </div>

                    { !userId && (
                        <p>Log in to save favorites</p>
                    )}
                    <div className="recent-searches">
                        Recent Searches
                    </div>
                </>
            )}
        </div>
    );
}

export default Search;
