import { pool } from '../config/db.js';
import { getWeather } from '../services/weatherService.js';
import { getAQI } from '../services/aqiService.js';
import { assessRisk } from '../services/riskEngineService.js';

export const getCurrentConditions = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Missing required lat or lng query parameters.' });
    }

    // Call services in parallel using Promise.all
    const [weatherData, aqiData] = await Promise.all([
      getWeather(parseFloat(lat), parseFloat(lng)),
      getAQI(parseFloat(lat), parseFloat(lng))
    ]);

    // Calculate risk
    const riskResult = assessRisk({
      aqi: aqiData.aqi,
      pm25: aqiData.pm25,
      humidity: weatherData.humidity,
      temperatureC: weatherData.temperature
    });

    const riskData = {
      risk_level: riskResult.overallRisk,
      risk_score: riskResult.mlProbability * 100 // Scale to 0-100 or something similar
    };

    // Save reading to database
    // user_id comes from the requireAuth middleware (req.user.id)
    const userId = req.user.id;

    const query = `
      INSERT INTO environmental_readings 
        (user_id, temperature, humidity, aqi, pm25, risk_level, risk_score)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      userId,
      weatherData.temperature,
      weatherData.humidity,
      aqiData.aqi,
      aqiData.pm25,
      riskData.risk_level,
      riskData.risk_score
    ];

    const result = await pool.query(query, values);
    const savedReading = result.rows[0];

    // Return full result to the client
    return res.status(200).json({
      message: 'Current conditions fetched and saved successfully',
      data: savedReading
    });

  } catch (error) {
    console.error('Error getting current conditions:', error);
    return res.status(500).json({ error: 'Failed to retrieve current environmental conditions.', details: error.message });
  }
};
