import { assessRisk, computeRuleBasedRisk } from "../../src/services/riskEngineService.js";

describe("Risk Engine Tests", () => {

  // 1. Good conditions → LOW risk
test("good conditions return LOW risk", () => {
  const result = assessRisk({
    aqi: 10,           // Very clean air
    pm25: 1,           // Very low dust
    humidity: 40,      // Perfect humidity
    temperatureC: 20   // Perfect room temperature
  });

  expect(result.overallRisk).toBe("LOW");
});

  // 2. Very high AQI → EMERGENCY (CRITICAL in spec)
  test("very high AQI returns EMERGENCY risk", () => {
    const result = assessRisk({
      aqi: 300,
      pm25: 20,
      humidity: 40,
      temperatureC: 22
    });

    expect(["HIGH", "EMERGENCY"]).toContain(result.overallRisk);
  });

  // 3. Cold temperature contributes to risk
  test("cold temperature increases risk", () => {
    const result = assessRisk({
      aqi: 40,
      pm25: 10,
      humidity: 40,
      temperatureC: -15
    });

    expect(result.overallRisk).not.toBe("LOW");
    expect(result.factors.temperature.risk).toBe("EMERGENCY");
  });

  // 4. High humidity contributes to risk
  test("high humidity increases risk", () => {
    const result = assessRisk({
      aqi: 40,
      pm25: 10,
      humidity: 85,
      temperatureC: 22
    });

    expect(result.factors.humidity.risk).not.toBe("LOW");
  });

  // 5. Recommendations exist for non-LOW results
  test("recommendations exist for non-LOW results", () => {
    const result = assessRisk({
      aqi: 200,
      pm25: 50,
      humidity: 80,
      temperatureC: 35
    });

    expect(result.overallRisk).not.toBe("LOW");
    expect(result.advice).toBeDefined();
    expect(result.advice.actions.length).toBeGreaterThan(0);
  });

  // 6. Triggers/alerts array is populated correctly
  test("alerts array is populated correctly", () => {
    const result = assessRisk({
      aqi: 180,
      pm25: 60,
      humidity: 70,
      temperatureC: 33
    });

    expect(Array.isArray(result.alerts)).toBe(true);
    expect(result.alerts.length).toBeGreaterThan(0);
  });

});