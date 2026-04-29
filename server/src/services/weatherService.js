import axios from 'axios';

export async function getWeather(lat, lon) {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          lat,
          lon,
          appid: apiKey,
          units: 'metric'
        }
      }
    );

    const data = response.data;

    return {
      temp:        data.main.temp,
      humidity:    data.main.humidity,
      feels_like:  data.main.feels_like,
      description: data.weather[0].description,
      wind_speed:  data.wind.speed
    };

  } catch (error) {
    if (error.response) {
      throw new Error(
        `Weather API error: ${error.response.status} - ${error.response.data.message}`
      );
    }
    throw new Error(`Failed to reach weather service: ${error.message}`);
  }
}
