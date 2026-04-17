import { config } from 'dotenv';
config();

import axios from 'axios';

async function getAQIData(lat, lon) {
  const token = process.env.WAQI_TOKEN;

  try {
    const response = await axios.get(
      `https://api.waqi.info/feed/geo:${lat};${lon}/`,
      { params: { token } }
    );

    const data = response.data;

    if (data.status === 'error') {
      throw new Error(`WAQI API error: ${data.data || 'Unknown error'}`);
    }

    const station = data.data;

    return {
      aqi:                station.aqi,
      pm25:               station.iaqi?.pm25?.v || null,
      pm10:               station.iaqi?.pm10?.v || null,
      dominant_pollutant: station.dominentpol   || null,
    };

  } catch (error) {
    if (error.response) {
      throw new Error(`AQI API error: ${error.response.status}`);
    }
    throw new Error(`Failed to reach AQI service: ${error.message}`);
  }
}

