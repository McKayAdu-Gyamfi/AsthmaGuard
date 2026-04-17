const axios = require('axios');

async function getAQIData(lat, lon) {
  const token = process.env.WAQI_TOKEN;

  try {
    const response = await axios.get(
      `https://api.waqi.info/feed/geo:${lat};${lon}/`,
      {
        params: { token }
      }
    );

    const data = response.data;

    // WAQI sometimes responds with status "error" even on a 200 OK
    // This is the graceful handling the task is asking for
    if (data.status === 'error') {
      throw new Error(`WAQI API error: ${data.data || 'Unknown error'}`);
    }

    const station = data.data;

    // Return only the clean fields we need
    // Some stations don't report every pollutant
    // so we use || null as a fallback
    return {
      aqi:                station.aqi,
      pm25:               station.iaqi?.pm25?.v || null,
      pm10:               station.iaqi?.pm10?.v || null,
      dominant_pollutant: station.dominentpol   || null,
    };

  } catch (error) {
    if (error.response) {
      throw new Error(
        `AQI API error: ${error.response.status} - ${error.response.data}`
      );
    }
    throw new Error(`Failed to reach AQI service: ${error.message}`);
  }
}

module.exports = { getAQIData };

// TEMPORARY TEST — delete after confirming
getAQIData(5.6037, -0.1870)
  .then(data => console.log('✅ AQI data:', data))
  .catch(err => console.error('❌ Error:', err.message));
