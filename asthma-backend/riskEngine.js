/**
 * Smart Asthma Monitoring System
 * Rule-Based Risk Engine + ML Layer
 *
 * Sources:
 *  - EPA AQI Basics (airnow.gov)
 *  - GINA 2025 Global Strategy Report (ginasthma.org)
 *  - CDC Heat Health Guidelines
 *  - American Lung Association Cold Weather Guide
 *  - PMC Humidity & Asthma Systematic Review (PMC11659254)
 */

// ─────────────────────────────────────────────
// SECTION 1 — CONSTANTS & THRESHOLDS
// ─────────────────────────────────────────────

const RISK_LEVEL = Object.freeze({
  LOW:       "LOW",
  MODERATE:  "MODERATE",
  HIGH:      "HIGH",
  EMERGENCY: "EMERGENCY",
});

/**
 * AQI thresholds — EPA standard (airnow.gov)
 */
const AQI_THRESHOLDS = [
  { max: 50,  risk: RISK_LEVEL.LOW,       label: "Good" },
  { max: 100, risk: RISK_LEVEL.MODERATE,  label: "Moderate" },
  { max: 150, risk: RISK_LEVEL.HIGH,      label: "Unhealthy for Sensitive Groups" },
  { max: 200, risk: RISK_LEVEL.HIGH,      label: "Unhealthy" },
  { max: 300, risk: RISK_LEVEL.EMERGENCY, label: "Very Unhealthy" },
  { max: 500, risk: RISK_LEVEL.EMERGENCY, label: "Hazardous" },
];

/**
 * PM2.5 breakpoints — EPA NAAQS (μg/m³)
 */
const PM25_THRESHOLDS = [
  { max: 12.0, risk: RISK_LEVEL.LOW },
  { max: 35.4, risk: RISK_LEVEL.MODERATE },
  { max: 55.4, risk: RISK_LEVEL.HIGH },
  { max: 150.4,risk: RISK_LEVEL.EMERGENCY },
  { max: 9999, risk: RISK_LEVEL.EMERGENCY },
];

/**
 * Relative Humidity thresholds — EPA + asthma.net
 * Optimal indoor range: 30–50%
 * Above 65% = known asthma irritant trigger
 */
const HUMIDITY_THRESHOLDS = [
  { min: 30,  max: 50,  risk: RISK_LEVEL.LOW },
  { min: 50,  max: 60,  risk: RISK_LEVEL.MODERATE },
  { min: 60,  max: 65,  risk: RISK_LEVEL.HIGH },
  { min: 65,  max: 100, risk: RISK_LEVEL.EMERGENCY },
  // Too dry is also a concern (below 30%)
  { min: 0,   max: 30,  risk: RISK_LEVEL.MODERATE },
];

/**
 * Temperature thresholds (°C)
 * Ideal indoor: 20–21.6°C (Am. J. Respiratory & Critical Care Med., 2012)
 * Cold danger: below -12°C (American Lung Association)
 * Hot + humid danger when > 35°C with high RH
 */
const TEMP_THRESHOLDS = {
  IDEAL_MIN:       20,
  IDEAL_MAX:       21.6,
  COLD_CAUTION:    10,    // below this → moderate risk
  COLD_DANGER:    -12,    // below this → high risk
  HOT_CAUTION:    30,    // above this → moderate (compounding)
  HOT_DANGER:     35,    // above this + high RH → high risk
};

/**
 * Risk level numeric weights used for composite scoring
 */
const RISK_WEIGHT = {
  [RISK_LEVEL.LOW]:       1,
  [RISK_LEVEL.MODERATE]:  2,
  [RISK_LEVEL.HIGH]:      3,
  [RISK_LEVEL.EMERGENCY]: 4,
};


// ─────────────────────────────────────────────
// SECTION 2 — INDIVIDUAL FACTOR EVALUATORS
// ─────────────────────────────────────────────

function evaluateAQI(aqi) {
  if (aqi == null) return { risk: RISK_LEVEL.LOW, label: "No AQI data", value: null };
  for (const threshold of AQI_THRESHOLDS) {
    if (aqi <= threshold.max) {
      return { risk: threshold.risk, label: threshold.label, value: aqi };
    }
  }
  return { risk: RISK_LEVEL.EMERGENCY, label: "Hazardous", value: aqi };
}

function evaluatePM25(pm25) {
  if (pm25 == null) return { risk: RISK_LEVEL.LOW, label: "No PM2.5 data", value: null };
  for (const threshold of PM25_THRESHOLDS) {
    if (pm25 <= threshold.max) {
      return { risk: threshold.risk, value: pm25 };
    }
  }
  return { risk: RISK_LEVEL.EMERGENCY, value: pm25 };
}

function evaluateHumidity(rh) {
  if (rh == null) return { risk: RISK_LEVEL.LOW, label: "No humidity data", value: null };
  // Check each range
  for (const band of HUMIDITY_THRESHOLDS) {
    if (rh >= band.min && rh < band.max) {
      return { risk: band.risk, value: rh };
    }
  }
  // Exactly 100%
  return { risk: RISK_LEVEL.EMERGENCY, value: rh };
}

function evaluateTemperature(tempC, rh = null) {
  if (tempC == null) return { risk: RISK_LEVEL.LOW, label: "No temp data", value: null };

  // Life-threatening cold
  if (tempC < TEMP_THRESHOLDS.COLD_DANGER) {
    return {
      risk: RISK_LEVEL.EMERGENCY,
      label: "Extreme cold — stay indoors",
      value: tempC,
    };
  }

  // Hot + humid combination (CDC Heat Health guidelines)
  if (tempC > TEMP_THRESHOLDS.HOT_DANGER && rh != null && rh > 60) {
    return {
      risk: RISK_LEVEL.HIGH,
      label: "Hot & humid — airway constriction risk elevated",
      value: tempC,
    };
  }

  // Plain cold caution
  if (tempC < TEMP_THRESHOLDS.COLD_CAUTION) {
    return {
      risk: RISK_LEVEL.MODERATE,
      label: "Cold air — cover mouth and nose outdoors",
      value: tempC,
    };
  }

  // Plain heat caution
  if (tempC > TEMP_THRESHOLDS.HOT_CAUTION) {
    return {
      risk: RISK_LEVEL.MODERATE,
      label: "Hot weather — ozone levels may be elevated",
      value: tempC,
    };
  }

  // Ideal range
  if (
    tempC >= TEMP_THRESHOLDS.IDEAL_MIN &&
    tempC <= TEMP_THRESHOLDS.IDEAL_MAX
  ) {
    return { risk: RISK_LEVEL.LOW, label: "Ideal temperature", value: tempC };
  }

  return { risk: RISK_LEVEL.LOW, label: "Acceptable temperature", value: tempC };
}


// ─────────────────────────────────────────────
// SECTION 3 — COMPOSITE RULE-BASED ENGINE
// ─────────────────────────────────────────────

/**
 * computeRuleBasedRisk
 * Combines all environmental factors using evidence-based rules.
 *
 * @param {object} env - Environmental readings
 * @param {number} env.aqi          - Air Quality Index
 * @param {number} env.pm25         - PM2.5 in μg/m³
 * @param {number} env.humidity     - Relative humidity in %
 * @param {number} env.temperatureC - Temperature in °C
 *
 * @returns {object} result - { overallRisk, factors, alerts, advice }
 */
function computeRuleBasedRisk(env) {
  const { aqi, pm25, humidity, temperatureC } = env;

  // Evaluate each factor independently
  const factors = {
    aqi:         evaluateAQI(aqi),
    pm25:        evaluatePM25(pm25),
    humidity:    evaluateHumidity(humidity),
    temperature: evaluateTemperature(temperatureC, humidity),
  };

  // ── Hard override rules ────────────────────
  // Any single EMERGENCY factor → whole result is EMERGENCY
  const hasEmergency = Object.values(factors).some(
    (f) => f.risk === RISK_LEVEL.EMERGENCY
  );
  if (hasEmergency) {
    return buildResult(RISK_LEVEL.EMERGENCY, factors, env);
  }

  // AQI > 150 alone → HIGH (EPA: universally unhealthy above 150)
  if (aqi != null && aqi > 150) {
    return buildResult(RISK_LEVEL.HIGH, factors, env);
  }

  // PM2.5 > 35.5 alone → HIGH
  if (pm25 != null && pm25 > 35.5) {
    return buildResult(RISK_LEVEL.HIGH, factors, env);
  }

  // Hot + humid combined → HIGH (CDC Heat Health guidelines)
  if (temperatureC != null && temperatureC > 35 && humidity != null && humidity > 60) {
    return buildResult(RISK_LEVEL.HIGH, factors, env);
  }

  // ── Compound moderate rules ────────────────
  // Two or more MODERATE factors → escalate to HIGH
  const moderateCount = Object.values(factors).filter(
    (f) => f.risk === RISK_LEVEL.MODERATE
  ).length;

  if (moderateCount >= 2) {
    return buildResult(RISK_LEVEL.HIGH, factors, env);
  }

  // ── Default: take the highest single factor ─
  const riskOrder = [
    RISK_LEVEL.EMERGENCY,
    RISK_LEVEL.HIGH,
    RISK_LEVEL.MODERATE,
    RISK_LEVEL.LOW,
  ];
  for (const level of riskOrder) {
    if (Object.values(factors).some((f) => f.risk === level)) {
      return buildResult(level, factors, env);
    }
  }

  return buildResult(RISK_LEVEL.LOW, factors, env);
}

/**
 * buildResult — assembles the full response object with user-facing advice
 * following GINA 2025 and EPA guidelines.
 */
function buildResult(overallRisk, factors, env) {
  const advice = getAdvice(overallRisk, env);
  const alerts = getAlerts(overallRisk, factors);

  return {
    overallRisk,
    factors,
    alerts,
    advice,
    timestamp: new Date().toISOString(),
  };
}

function getAdvice(risk, env) {
  const base = {
    [RISK_LEVEL.LOW]: {
      message: "Conditions are safe for most people with asthma in Accra.",
      actions: [
        "Continue normal activities, but always carry your rescue inhaler.",
        "Monitor air quality daily via the app."
      ],
    },
    [RISK_LEVEL.MODERATE]: {
      message: "Mild risk detected. Take preventive steps now to avoid symptoms later.",
      actions: [
        "Limit time outdoors, especially in traffic or dusty areas.",
        "Keep windows closed and use a fan or AC.",
        "Stay hydrated — drink plenty of water.",
        "Have your controller medication ready."
      ],
    },
    [RISK_LEVEL.HIGH]: {
      message: "High risk of asthma symptoms today in Accra. Act early to prevent an attack.",
      actions: [
        "Stay indoors as much as possible. Close windows and doors.",
        "Use air conditioning or a dehumidifier to bring humidity below 50%.",
        "Avoid outdoor exercise. Move workouts indoors.",
        "Take your controller inhaler exactly as prescribed (GINA 2025).",
        "Keep rescue inhaler (SABA) with you at all times.",
        "Notify a family member of current conditions."
      ],
    },
    [RISK_LEVEL.EMERGENCY]: {
      message: "EMERGENCY CONDITIONS in Accra — very high chance of asthma attack. Protect yourself immediately.",
      actions: [
        "Do NOT go outdoors unless absolutely necessary.",
        "If outside, return indoors right away and close all windows.",
        "Run AC or dehumidifier on full to lower humidity and filter air.",
        "Use rescue inhaler (4 puffs, 1 per minute) if you feel any tightness, cough, or shortness of breath.",
        "Contact your doctor or call emergency services (112 or 999) if symptoms do not improve in 15–20 minutes.",
        "Alert your emergency contacts now.",
        "Stay hydrated and rest in a cool, low-humidity room."
      ],
    },
  };

  let advice = { ...base[risk] };

  // Accra-specific additions
  if (env.humidity != null && env.humidity > 65) {
    advice.actions.push("High humidity is a major trigger in Accra — use a dehumidifier or AC to bring indoor humidity below 50%.");
  }
  if (env.temperatureC != null && env.temperatureC > 30) {
    advice.actions.push("Hot weather can worsen symptoms — stay in cool shaded or air-conditioned spaces and drink water regularly.");
  }
  if (env.pm25 != null && env.pm25 > 35) {
    advice.actions.push("Dust and PM2.5 levels are elevated — keep windows closed and avoid busy roads.");
  }

  return advice;
}

function getAlerts(risk, factors) {
  const alerts = [];

  if (factors.aqi?.risk === RISK_LEVEL.HIGH || factors.aqi?.risk === RISK_LEVEL.EMERGENCY) {
    alerts.push({ type: "AQI", message: `AQI is ${factors.aqi.value} — ${factors.aqi.label}` });
  }
  if (factors.pm25?.risk === RISK_LEVEL.HIGH || factors.pm25?.risk === RISK_LEVEL.EMERGENCY) {
    alerts.push({ type: "PM2.5", message: `PM2.5 is ${factors.pm25.value} μg/m³ — unhealthy range` });
  }
  if (factors.humidity?.risk !== RISK_LEVEL.LOW) {
    alerts.push({ type: "Humidity", message: `Humidity is ${factors.humidity.value}% — ${factors.humidity.risk.toLowerCase()} risk` });
  }
  if (factors.temperature?.risk !== RISK_LEVEL.LOW) {
    alerts.push({ type: "Temperature", message: factors.temperature.label });
  }

  return alerts;
}


// ─────────────────────────────────────────────
// SECTION 4 — ML LAYER (Logistic Regression)
// ─────────────────────────────────────────────
//
// This lightweight ML layer learns from historical readings + attack outcomes.
// It does NOT replace the rule engine — it runs alongside it and can
// override LOW/MODERATE predictions upward when historical patterns suggest risk.
//
// Architecture: Logistic Regression with hand-tuned initial weights.
// In production: retrain weights using your stored patient data.
//
// Features (X):
//   x0: AQI (normalised 0–1 over range 0–500)
//   x1: PM2.5 (normalised 0–1 over range 0–200)
//   x2: Humidity (normalised 0–1 over range 0–100)
//   x3: Temperature (normalised 0–1, mapped from -20°C to 50°C)
//   x4: AQI × Humidity interaction term (captures hot-humid synergy)
//   x5: Hour of day sin(2π×hour/24) — captures circadian asthma pattern
//   x6: Hour of day cos(2π×hour/24)
//
// Label (y): 1 = asthma event occurred within next 4 hours, 0 = no event

/**
 * Normalisation helpers
 */
function normalise(value, min, max) {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

/**
 * Initial weights — derived from literature-based feature importance.
 * Replace `weights` with trained values once you have labelled data.
 *
 * weights[0] = bias
 * weights[1..7] = feature coefficients
 */
const ML_WEIGHTS = {
  bias:          -2.1,
  aqi:            2.8,   // Strong predictor — EPA AQI study (PMC9278633)
  pm25:           2.2,   // PM2.5 independent predictor
  humidity:       1.5,   // Humidity systematic review (PMC11659254)
  temperature:    1.8,   // Extreme temp meta-analysis (ScienceDirect 2022)
  aqiHumidity:    1.4,   // Synergy term: hot-humid combined (CDC)
  hourSin:       -0.6,   // Circadian: asthma attacks peak late night/early morning
  hourCos:       -0.4,
};

/**
 * buildFeatureVector
 * Extracts and normalises features from raw environmental data.
 */
function buildFeatureVector(env) {
  const hour = new Date().getHours();
  const aqiNorm   = normalise(env.aqi ?? 0,          0,   500);
  const pm25Norm  = normalise(env.pm25 ?? 0,         0,   200);
  const rhNorm    = normalise(env.humidity ?? 50,    0,   100);
  const tempNorm  = normalise(env.temperatureC ?? 20, -20, 50);
  const hourSin   = Math.sin((2 * Math.PI * hour) / 24);
  const hourCos   = Math.cos((2 * Math.PI * hour) / 24);
  const interactAqiRh = aqiNorm * rhNorm;

  return { aqiNorm, pm25Norm, rhNorm, tempNorm, interactAqiRh, hourSin, hourCos };
}

/**
 * mlPredict
 * Returns probability (0–1) that an asthma event will occur within ~4 hours.
 *
 * @param {object} env - Same environmental readings object as rule engine
 * @returns {object} { probability, mlRisk, features }
 */
function mlPredict(env) {
  const features = buildFeatureVector(env);
  const w = ML_WEIGHTS;

  const z =
    w.bias +
    w.aqi         * features.aqiNorm +
    w.pm25        * features.pm25Norm +
    w.humidity    * features.rhNorm +
    w.temperature * features.tempNorm +
    w.aqiHumidity * features.interactAqiRh +
    w.hourSin     * features.hourSin +
    w.hourCos     * features.hourCos;

  const probability = sigmoid(z);

  // Map probability to risk level
  let mlRisk;
  if (probability < 0.25)      mlRisk = RISK_LEVEL.LOW;
  else if (probability < 0.50) mlRisk = RISK_LEVEL.MODERATE;
  else if (probability < 0.75) mlRisk = RISK_LEVEL.HIGH;
  else                          mlRisk = RISK_LEVEL.EMERGENCY;

  return { probability: Math.round(probability * 1000) / 1000, mlRisk, features };
}

/**
 * updateWeights (Online learning — gradient descent step)
 * Call this after a confirmed asthma event or non-event to improve accuracy over time.
 *
 * @param {object} features    - Feature vector from buildFeatureVector()
 * @param {number} actual      - 1 if event occurred, 0 if not
 * @param {number} predicted   - Probability returned by mlPredict
 * @param {number} learningRate - Default 0.01 (small to avoid instability)
 */
function updateWeights(features, actual, predicted, learningRate = 0.01) {
  const error = actual - predicted;     // gradient of log-loss

  ML_WEIGHTS.bias         += learningRate * error;
  ML_WEIGHTS.aqi          += learningRate * error * features.aqiNorm;
  ML_WEIGHTS.pm25         += learningRate * error * features.pm25Norm;
  ML_WEIGHTS.humidity     += learningRate * error * features.rhNorm;
  ML_WEIGHTS.temperature  += learningRate * error * features.tempNorm;
  ML_WEIGHTS.aqiHumidity  += learningRate * error * features.interactAqiRh;
  ML_WEIGHTS.hourSin      += learningRate * error * features.hourSin;
  ML_WEIGHTS.hourCos      += learningRate * error * features.hourCos;

  // Persist updated weights to your DB here:
  // await db.query('UPDATE ml_weights SET weights = $1', [JSON.stringify(ML_WEIGHTS)]);
}


// ─────────────────────────────────────────────
// SECTION 5 — COMBINED PIPELINE
// ─────────────────────────────────────────────

/**
 * assessRisk
 * Main entry point. Runs both engines and fuses the result.
 * The ML layer can only raise the risk level, never lower it.
 * (Safety-first: clinical rules always take precedence.)
 *
 * @param {object} env - { aqi, pm25, humidity, temperatureC }
 * @returns {object} Full assessment result
 */
function assessRisk(env) {
  const ruleResult = computeRuleBasedRisk(env);
  const mlResult   = mlPredict(env);

  // Fuse: take the higher of the two risk levels
  const finalRisk =
    RISK_WEIGHT[mlResult.mlRisk] > RISK_WEIGHT[ruleResult.overallRisk]
      ? mlResult.mlRisk
      : ruleResult.overallRisk;

  // Rebuild advice if ML elevated the risk
  const advice =
    finalRisk !== ruleResult.overallRisk
      ? getAdvice(finalRisk, env)
      : ruleResult.advice;

  return {
    overallRisk:  finalRisk,
    ruleRisk:     ruleResult.overallRisk,
    mlRisk:       mlResult.mlRisk,
    mlProbability: mlResult.probability,
    factors:      ruleResult.factors,
    alerts:       ruleResult.alerts,
    advice,
    timestamp:    new Date().toISOString(),
  };
}


// ─────────────────────────────────────────────
// SECTION 6 — EXAMPLE USAGE & QUICK TEST (ES Modules)
// ─────────────────────────────────────────────

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("═══════════════════════════════════════════════");
  console.log("  SMART ASTHMA RISK ENGINE — TEST OUTPUT");
  console.log("═══════════════════════════════════════════════\n");

  const testCases = [
    {
      label: "Accra — Typical harmattan day",
      env: { aqi: 145, pm25: 38, humidity: 72, temperatureC: 34 },
    },
    {
      label: "Safe morning conditions",
      env: { aqi: 42, pm25: 8, humidity: 45, temperatureC: 21 },
    },
    {
      label: "Dangerous pollution spike",
      env: { aqi: 210, pm25: 75, humidity: 80, temperatureC: 36 },
    },
    {
      label: "Moderate — two factors elevated",
      env: { aqi: 95, pm25: 20, humidity: 62, temperatureC: 31 },
    },
  ];

  for (const tc of testCases) {
    const result = assessRisk(tc.env);
    console.log(`📍 ${tc.label}`);
    console.log(`   FINAL RISK  → ${result.overallRisk}`);
    console.log(`   ML Probability → ${result.mlProbability}%`);
    console.log("");
  }
}

// ─────────────────────────────────────────────
// EXPORTS (ES Modules)
// ─────────────────────────────────────────────

export {
  assessRisk,
  computeRuleBasedRisk,
  mlPredict,
  updateWeights,
  RISK_LEVEL,
};

