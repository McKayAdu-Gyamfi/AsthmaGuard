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

### User Profiles
Root: `/api/v1/users`

*   **GET /me**: Get the current user's profile.
*   **PUT /me**: Update the current user's profile.
*   **GET /emergency-contacts**: Retrieves a user's tracked emergency contacts.
*   **DELETE /emergency-contacts/:email**: Deletes an emergency contact given their email.

### Alerts
Root: `/api/v1/alerts`

*   **GET /**: Return all alerts for the logged-in user, ordered by date.
*   **POST /**: Create a new alert manually.
*   **PUT /:id/read**: Mark a specific alert as read.
*   **DELETE /:id**: Delete (dismiss) an alert.

### Symptoms & Medications
Root: `/api/v1/symptoms` and `/api/v1/medications`

*   **GET /api/v1/symptoms**: Get logged symptoms.
*   **POST /api/v1/symptoms**: Log a new symptom.
*   **DELETE /api/v1/symptoms/:id**: Delete a tracked symptom.
*   **GET /api/v1/medications**: Get user medications.
*   **POST /api/v1/medications**: Add a new medication.
*   **POST /api/v1/medications/:id/taken**: Log when a user takes a specific medication.
*   **DELETE /api/v1/medications/:id**: Delete a tracked medication.

### Emergencies
Root: `/api/v1/emergency`

*   **GET /guide**: Returns step-by-step asthma emergency guide as JSON (No Auth Required).
*   **POST /trigger**: Record an emergency and use notification services to alert contacts.
*   **POST /notify-contacts**: Send an emergency email to all contacts via Nodemailer.
*   **PATCH /:id/resolve**: Mark an active emergency as resolved.

### Chat
Root: `/api/v1/chat`

*   **POST /**: Send a message to the AI Asthma doctor.

### History
Root: `/api/v1/history`

*   **GET /**: Retrieve user's historical data (symptoms, medications, risk assessments).

