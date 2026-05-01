import express from "express";
import { assessRisk, updateWeights, RISK_LEVEL } from "../services/riskEngineService.js";
import { pool } from "../config/db.js";
import { createDashboardAlert } from "../services/notificationService.js";
import { optionalAuth } from "../middlewares/optionalAuth.js";
import { getWeather } from "../services/weatherService.js";
import { getAQI } from "../services/aqiService.js";

const router = express.Router();

router.use(optionalAuth);

// ─── GET /api/v1/risk ───────────────────
router.get("/", async (req, res) => {
  try {
    const lat = req.query.lat || 5.6037; // Default to Accra
    const lon = req.query.lon || -0.1870;

    let weatherData, aqiData;
    let locationName = "Accra, Ghana";

    try {
      [weatherData, aqiData] = await Promise.all([
        getWeather(lat, lon),
        getAQI(lat, lon)
      ]);
      locationName = weatherData.location || locationName;
    } catch (apiError) {
      console.warn("External API error, using fallbacks:", apiError.message);
      weatherData = { temp: 32, humidity: 75 };
      aqiData = { aqi: 120, pm25: 40 };
    }

    const input = {
      aqi: aqiData.aqi,
      pm25: aqiData.pm25 || 0,
      humidity: weatherData.humidity,
      temperatureC: weatherData.temp,
      location: locationName
    };

    const result = assessRisk(input);
    result.location = locationName;
    
    const userId = req.user ? req.user.id : null;

    // SAVE TO DATABASE (Using pool to bypass RLS)
    try {
      await pool.query(
        `INSERT INTO risk_readings (user_id, location, aqi, pm25, humidity, temperature, risk_level, risk_score)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          userId,
          locationName,
          input.aqi,
          input.pm25,
          input.humidity,
          input.temperatureC,
          result.overallRisk,
          Math.round(result.mlProbability * 100)
        ]
      );
    } catch (dbError) {
      console.error("Database insert error (risk_readings):", dbError.message);
    }

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error("Risk route error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ─── POST /api/risk/assess ───────────────────
router.post("/assess", async (req, res) => {
  const { aqi, pm25, humidity, temperatureC, location } = req.body;
  const locationName = location || "Accra, Ghana";

  const errors = [];
  if (aqi == null) errors.push("aqi is required");
  if (pm25 == null) errors.push("pm25 is required");
  if (humidity == null) errors.push("humidity is required");
  if (temperatureC == null) errors.push("temperatureC is required");

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const result = assessRisk({ aqi, pm25, humidity, temperatureC });
  result.location = locationName;
  
  const userId = req.user ? req.user.id : null;

  // SAVE TO DATABASE (Using pool to bypass RLS)
  try {
    await pool.query(
      `INSERT INTO risk_readings (user_id, location, aqi, pm25, humidity, temperature, risk_level, risk_score)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        userId,
        locationName,
        aqi,
        pm25,
        humidity,
        temperatureC,
        result.overallRisk,
        Math.round(result.mlProbability * 100)
      ]
    );
  } catch (dbError) {
    console.error("Database insert error (risk_readings):", dbError.message);
  }

  if (userId && result.overallRisk !== RISK_LEVEL.LOW) {
    const alertMessage = result.alerts
      .map((alert) => alert.message)
      .filter(Boolean)
      .join(" ");

    try {
      await createDashboardAlert(
        userId,
        locationName,
        result.overallRisk,
        alertMessage || `Asthma risk is ${result.overallRisk}. Follow the recommended precautions.`
      );
    } catch (alertError) {
      console.error("Failed to create dashboard alert:", alertError);
    }
  }

  return res.json({ success: true, data: result });
});

// ─── POST /api/risk/feedback ─────────────────
router.post("/feedback", (req, res) => {
  const { features, actual, predicted } = req.body;

  if (actual !== 0 && actual !== 1) {
    return res.status(400).json({ success: false, error: "actual must be 0 or 1" });
  }
  if (typeof predicted !== "number" || predicted < 0 || predicted > 1) {
    return res.status(400).json({ success: false, error: "predicted must be a float 0–1" });
  }

  try {
    updateWeights(features, actual, predicted);
    return res.json({ success: true, message: "Weights updated." });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
