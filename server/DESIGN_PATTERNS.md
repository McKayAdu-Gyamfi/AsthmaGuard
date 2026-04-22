# Design Patterns in Smart Asthma Backend

This document outlines the software design patterns implemented in the Smart Asthma backend to ensure scalability, maintainability, and clear separation of concerns.

## 1. Model-View-Controller (MVC) Architecture
While this is a strictly backend API (meaning there are no "Views" in the traditional sense), the project strictly adheres to the core principles of MVC through a structured layered architecture:
*   **Controllers** (`src/controllers/`): These act as the entry point for business logic. They handle incoming HTTP requests, parse query parameters and request bodies, and orchestrate calls to the service layer.
*   **Routes** (`src/routes/`): Act as the dispatcher, ensuring that requests to specific routing structures are routed to the correct controller methods.
*   **Data Access Details / Schema**: Found in `src/config/db.js` and our `schema.sql`, this conceptually acts as our Model layer, detailing database access and table schemas.

## 2. Service Object Pattern (Service Layer)
We extract complex business logic and external API integrations into a dedicated Service Layer (`src/services/`). This fulfills the Single Responsibility Principle and avoids "fat controllers".
*   **Examples:** `aqiService.js`, `weatherService.js`, `riskEngineService.js`, `notificationService.js`.
*   **Benefits:** Services can be reused easily across different controllers. For instance, the `notificationService` can be called from both an emergency trigger and an automated high-risk alert without duplicating logic.

## 3. Middleware Pattern
We utilize Express's middleware pattern extensively, especially for cross-cutting concerns like authentication, error handling, and request validation.
*   **Authentication (`requireAuth.js`)**: Instead of validating session tokens manually inside every single route, a global or router-specific middleware intercepts the request, verifies the user session securely, attaches the user object to `req.user`, and passes control to the next handler.
*   **Benefits:** DRY (Don't Repeat Yourself) code and clean centralization of security logic.

## 4. Singleton Pattern
We use the Singleton pattern primarily for our database connection management.
*   **Implementation**: In `src/config/db.js`, we instantiate a single `pg.Pool` instance and export it natively in the module.
*   **Benefits**: When controllers or services import `pool`, Node.js module caching ensures they are all using the exact same connection pool. This optimizes backend resources, limits the total number of open connections to the PostgreSQL database, and prevents connection exhaustion overhead.

## 5. Repository / DAO Concept Adaptation
By isolating queries within specific, contextual boundaries (either securely within the controllers or completely abstracted in the services layer), we adapt the data access concept. This ensures that direct SQL queries related to users, alerts, and environment data are cleanly localized preventing application-wide SQL injection liabilities.
