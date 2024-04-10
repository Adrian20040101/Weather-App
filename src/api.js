export const geoApiOptions = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'ec74fa9834msh50e383cf8b7f74dp159310jsnfe7939bd8321',
      'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
  };

export const fetchWeatherData = async (lat, lon) => {
  try {
      const response = await fetch(`${weatherUrl}/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`);
      if (!response.ok) {
          throw new Error('Failed to fetch weather data');
      }
      const weatherData = await response.json();
      return weatherData;
  } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
  }
};

export const url = "https://wft-geo-db.p.rapidapi.com/v1/geo";
export const weatherUrl = "https://api.openweathermap.org/data/2.5";
export const weatherApiKey = "94ca6d090866b1e6d68403d7e8cd1738";
