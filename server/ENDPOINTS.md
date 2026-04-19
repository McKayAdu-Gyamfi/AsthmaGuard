# API Endpoints Documentation

This document lists all active and planned endpoints for the Smart Asthma Backend.

## Active Endpoints

### General
*   **GET /**
    *   **Description**: Root health check.
    *   **Auth Required**: No
    *   **Response**: `{ success: true, message: "Smart Asthma Risk API is running 🚀" }`

### Authentication (BetterAuth)
Managed by BetterAuth at `/api/auth`.
*   `POST /api/auth/sign-in/email`: Sign in with email and password.
*   `POST /api/auth/sign-up/email`: Register a new user.
*   `GET /api/auth/get-session`: Get current user session.
*   `POST /api/auth/sign-out`: Sign out the current user.

### Environment Data
Root: `/api/v1/environment`

*   **GET /current**
    *   **Description**: Get current weather and air quality conditions for a location.
    *   **Auth Required**: Yes
    *   **Input**: Query parameters `lat`, `lon` (optional).
    *   **Response**: `{ success: true, data: { cloud, temp, humidity, aqi, pm25, ... } }`

### Risk Assessment
Root: `/api/risk`

*   **GET /**
    *   **Description**: Get a sample risk assessment (currently uses static data for demo).
    *   **Auth Required**: No
    *   **Response**: `{ success: true, data: { overallRisk, mlProbability, reasons, ... } }`

*   **POST /assess**
    *   **Description**: Perform a full risk assessment based on provided features.
    *   **Auth Required**: No (currently public)
    *   **Body**: `{ aqi, pm25, humidity, temperatureC }`
    *   **Response**: `{ success: true, data: { overallRisk, mlProbability, recommendations, ... } }`

*   **POST /feedback**
    *   **Description**: Submit feedback on a prediction to improve the ML model (online learning).
    *   **Auth Required**: No
    *   **Body**: `{ features, actual, predicted }`
    *   **Response**: `{ success: true, message: "Weights updated." }`

---

## Planned Endpoints (Pending Implementation)

The following endpoints are defined in the project roadmap but have not been implemented yet.

### User Profiles
*   `GET /api/v1/users/me`
*   `PUT /api/v1/users/me`
*   `GET /api/v1/users/emergency-contacts`

### Alerts
*   `GET /api/v1/alerts`
*   `POST /api/v1/alerts`
*   `DELETE /api/v1/alerts/:id`

### Symptoms & Medications
*   `GET /api/v1/symptoms`
*   `POST /api/v1/symptoms`
*   `GET /api/v1/medications`
*   `POST /api/v1/medications`

### Emergencies
*   `POST /api/v1/emergency/trigger`
*   `GET /api/v1/emergency/status/:id`
