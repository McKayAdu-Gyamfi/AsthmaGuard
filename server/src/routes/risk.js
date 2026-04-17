/**
 * routes/risk.js
 * Express route for the Smart Asthma Risk Engine.
 *
 *  GET /api/risk
 * 
 * POST /api/risk/assess
 *   Body: { aqi, pm25, humidity, temperatureC }
 *   Returns: full risk assessment object
 *
 * POST /api/risk/feedback
 *   Body: { features, actual, predicted }
 *   Used after a confirmed event to update ML weights (online learning)
 */

import express from "express";
import { assessRisk, updateWeights, RISK_LEVEL } from "../riskEngine.js";
import supabase from "../supabaseService.js";
const router  = express.Router();


// ─── GET /api/risk ───────────────────
router.get("/", async (req, res) => {
  try {
    const input = {
      aqi: 120,
      pm25: 40,
      humidity: 75,
      temperatureC: 32
    };

    const result = assessRisk(input);

    // SAVE TO SUPABASE
    const{error}=await supabase.from("risk_readings").insert([
      {
        location: "Accra, Ghana",
        aqi: input.aqi,
        pm25: input.pm25,
        humidity: input.humidity,
        temperature: input.temperatureC,
        risk_level: result.overallRisk,
        risk_score: Math.round(result.mlProbability * 100)
      }
    ]);
    if (error) {
  console.error("Supabase insert error:", error);
   }

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
// ─── POST /api/risk/assess ───────────────────
router.post("/assess", async (req, res) => {
  const { aqi, pm25, humidity, temperatureC } = req.body;

  // Basic input validation
  const errors = [];

if (aqi == null) errors.push("aqi is required");
if (pm25 == null) errors.push("pm25 is required");
if (humidity == null) errors.push("humidity is required");
if (temperatureC == null) errors.push("temperatureC is required");

if (aqi != null && (typeof aqi !== "number" || aqi < 0))
  errors.push("aqi must be a non-negative number");

if (pm25 != null && (typeof pm25 !== "number" || pm25 < 0))
  errors.push("pm25 must be a non-negative number");

if (humidity != null && (typeof humidity !== "number" || humidity < 0 || humidity > 100))
  errors.push("humidity must be 0–100");

if (temperatureC != null && typeof temperatureC !== "number")
  errors.push("temperatureC must be a number");

if (errors.length > 0) {
  return res.status(400).json({
    success: false,
    errors
  });
}

  const result = assessRisk({ aqi, pm25, humidity, temperatureC });

// 🔥 SAVE TO SUPABASE
  const{error}= await supabase.from("risk_readings").insert([
     {
    location: "Accra, Ghana",
    aqi,
    pm25,
    humidity,
    temperature: temperatureC,
    risk_level: result.overallRisk,
    risk_score: Math.round(result.mlProbability * 100)
  }
]);
if (error) {
  console.error("Supabase insert error:", error);
}

return res.json({ success: true, data: result });
});

// ─── POST /api/risk/feedback ─────────────────
// Call this from your app whenever a patient confirms they had an attack,
// or after a monitoring period with no event. Improves ML accuracy over time.
router.post("/feedback", (req, res) => {
  const { features, actual, predicted } = req.body;

  if (actual !== 0 && actual !== 1) {
    return res.status(400).json({ success: false, error: "actual must be 0 or 1" });
  }
  if (typeof predicted !== "number" || predicted < 0 || predicted > 1) {
    return res.status(400).json({ success: false, error: "predicted must be a float 0–1" });
  }

  updateWeights(features, actual, predicted);
  return res.json({ success: true, message: "Weights updated." });
});

export default router;
