import React, { useState, useEffect } from "react";
import { AsyncPaginate } from 'react-select-async-paginate';
import { url, geoApiOptions } from "../../api";
import './search.css';
import CurrentWeather from "../current-weather/current-weather";
import { getFavoritesByUserId, getLocationDataById, addRecentSearch, getRecentsByUserId } from "../firebase-interaction/firestore-interaction";
import { fetchWeatherData } from "../../api";

const Search = ({ onSearchChange, userId }) => {
    const [search, setSearch] = useState(null);
    const [favoriteLocations, setFavoriteLocations] = useState([]);
    const [favoriteWeatherData, setFavoriteWeatherData] = useState([]);
    const [recents, setRecents] = useState([]);
    const [recentsData, setRecentsData] = useState([]);

    useEffect(() => {
        if (userId) {
            fetchFavoriteLocations();
            fetchRecents();
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

    const fetchRecents = async () => {
        try {
            const recentSearchesIds = await getRecentsByUserId(userId);
            const recentSearchesData = await getLocationDataById(recentSearchesIds);
            setRecents(recentSearchesData);
            const recentWeatherDetails = await fetchWeatherForRecents(recentSearchesData);
            setRecentsData(recentWeatherDetails);
        } catch (error) {
            console.error('Error fetching recent searches:', error);
        }
    };

    const fetchWeatherForRecents = async (recentLocations) => {
        try {
            const recentsWeatherData = [];
            for (const recent of recentLocations) {
                const weatherData = await fetchWeatherData(recent.latitude, recent.longitude);
                recentsWeatherData.push({ recent, weatherData });
            }
            return recentsWeatherData;
        } catch (error) {
            console.error('Error fetching weather data for favorites:', error);
            throw error;
        }
    }

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

    const handleOnChange = async (data) => {
        console.log(data);
        setSearch(data);
        onSearchChange(data);
        await addRecentSearch(userId, data);
        fetchRecents();
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
                Your Favorites
                {userId ? (
                    <div className="favorite-locations-widgets">
                        {favoriteWeatherData.length > 0 ? (
                            favoriteWeatherData.map(({ location, weatherData }) => (
                                <div onClick={() => handleFavoriteWeatherClick(location.latitude, location.longitude, location.city, location.country_code)}>
                                    <CurrentWeather data={{ ...weatherData, city: `${location.city},${location.country_code}` }} />
                                </div>
                            ))
                        ) : (
                            <p className="subtitle-text">No favorites found</p>
                        )}
                    </div>
                ) : (
                    <p className="subtitle-text">Log in to see favorites</p>
                )}
            </div>
        
            <div className="recent-searches">
                Recent Searches
                {userId ? (
                    <div className="recent-searches-widgets">
                        {recentsData.length > 0 ? (
                            recentsData.map(({ recent, weatherData }) => (
                                <div onClick={() => handleFavoriteWeatherClick(recent.latitude, recent.longitude, recent.city, recent.country_code)}>
                                    <CurrentWeather data={{ ...weatherData, city: `${recent.city},${recent.country_code}` }} />
                                </div>
                            ))
                        ) : (
                            <p className="subtitle-text">No recent searches found</p>
                        )}
                    </div>
                ) : (
                    <p className="subtitle-text">Log in to see recent searches</p>
                )}
            </div>

            </>
            )}
        </div>
    );
}

export default Search;
