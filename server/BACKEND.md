# Backend Functional Flow & Logic

This document describes how the Smart Asthma backend components interact to serve requests.

## Request Lifecycle

1.  **Entry Point**: All requests start at `server.js`.
2.  **Environment Setup**: `dotenv` loads environment variables, and `server.js` initializes the Express application.
3.  **Authentication Layer**:
    *   **Better Auth**: Mounted at `/api/auth`. It handles login, registration, and session management using PostgreSQL.
    *   **Middleware**: `src/middlewares/requireAuth.js` is used to protect private routes. It checks the session via the BetterAuth API.
4.  **Routing**:
    *   Requests are routed to specific routers in `src/routes/`.
    *   Example: `/api/v1/environment/*` for weather/AQI logic.
    *   Example: `/api/risk/*` for asthma risk assessment.
    *   Example: `/api/v1/users/*`, `/api/v1/alerts/*`, `/api/v1/emergency/*` for core user data and emergency handling.
5.  **Controllers**:
    *   Controllers in `src/controllers/` receive the request, validate input (optionally using schemas in `src/schemas/`), and call the appropriate services.
6.  **Services**:
    *   Business logic resides in `src/services/`.
    *   `aqiService.js`: Fetches air quality data from external APIs (WAQI).
    *   `weatherService.js`: Fetches weather data (OpenWeather).
    *   `riskEngineService.js`: Contains the core ML-based risk assessment logic.
    *   `notificationService.js`: Dispatches alerts via Nodemailer, SMS, and WhatsApp.
7.  **Database**:
    *   `src/config/db.js` provides a shared PostgreSQL pool.
    *   Services use this pool or the Supabase client to persist/fetch data.

## Core Technologies

*   **Node.js & Express**: Web server framework.
*   **BetterAuth**: Modern authentication framework with PostgreSQL adapter.
*   **PostgreSQL**: Primary database for auth and core application data.
*   **Supabase**: Used for additional cloud features and storage.
*   **Vitest & Supertest**: Testing suite for unit and integration tests.

## Running the Backend

1.  Navigate to the `server` directory.
2.  Ensure `.env` is configured.
3.  Run `npm start` (or `node server.js`).
4.  Run tests with `npm test`.
