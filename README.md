# 🫁 AsthmaGuard

A web-based platform that monitors real-time environmental conditions, predicts asthma attack risk using a rule-based engine + ML layer, and guides bystanders through emergencies using an AI-powered chatbot.

---

## 🌍 Problem Statement

Asthma affects millions of people worldwide, yet most sufferers have no way of knowing when environmental conditions are dangerous until it's too late. Poor air quality, high humidity, and elevated particulate matter are all proven triggers — but this data is rarely surfaced in a way that's actionable for patients or the people around them.

AsthmaGuard bridges that gap by combining real-time environmental data with an evidence-based risk engine and an AI emergency assistant.

---

## ✨ Features

- **Real-time Risk Monitoring** — Fetches live weather and air quality data and calculates a personalised asthma risk level (`LOW` / `MODERATE` / `HIGH` / `EMERGENCY`)
- **Hybrid Risk Engine** — Rule-based scoring (EPA/GINA 2025 guidelines) fused with a logistic-regression ML layer that learns circadian asthma patterns
- **Smart Alerts** — Notifies users when environmental conditions become dangerous, with `is_read` tracking
- **AI Emergency Chatbot** — Guides bystanders step-by-step through an asthma attack in plain, calm language (powered by Groq LLM)
- **Emergency Contacts** — Email notifications sent to saved contacts via Nodemailer
- **Risk History** — Tracks and stores past readings so users can spot patterns over time
- **Medication & Symptom Tracking** — Log medications, dosages, and daily symptoms
- **Location-aware** — Works for any location, defaulting to Accra, Ghana

---

## 🏗️ Architecture

```
┌─────────────────┐        ┌──────────────────┐        ┌─────────────────┐
│                 │        │                  │        │                 │
│    Frontend     │──────▶ │    Backend       │──────▶ │  Supabase DB    │
│  (React + Vite) │        │ (Node.js/Express)│        │  (PostgreSQL)   │
│                 │◀────── │                  │◀────── │                 │
└─────────────────┘        └────────┬─────────┘        └─────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
            ┌─────────────┐ ┌────────────┐ ┌─────────────┐
            │OpenWeatherMap│ │    WAQI    │ │  Groq LLM   │
            │     API     │ │    API     │ │     API     │
            └─────────────┘ └────────────┘ └─────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS |
| Backend | Node.js, Express 5 |
| Database | Supabase (PostgreSQL) |
| Authentication | Better Auth v1 (email/password + Google OAuth) |
| Weather Data | OpenWeatherMap API |
| Air Quality | WAQI (World Air Quality Index) API |
| AI Chatbot | Groq LLM API |
| Email Alerts | Nodemailer |
| CI/CD | Jenkins (declarative pipeline) |
| Version Control | Git + GitHub |

---

## 📁 Project Structure

```
software-engineering-final-project/
│
├── client/                        # React + Vite frontend
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Page-level components
│   │   ├── lib/                   # Auth client, utilities
│   │   └── App.tsx
│   ├── vite.config.ts
│   └── package.json
│
├── server/                        # Node.js + Express backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── auth.js            # Better Auth configuration
│   │   │   ├── db.js              # PostgreSQL pool
│   │   │   └── schema.sql         # Full database schema
│   │   ├── controllers/           # Request handlers
│   │   ├── middlewares/           # Auth, error handling
│   │   ├── routes/                # API route definitions
│   │   └── services/
│   │       ├── riskEngineService.js  # Rule engine + ML layer
│   │       ├── aqiService.js         # Air quality fetching
│   │       ├── weatherService.js     # Weather data
│   │       ├── chatService.js        # Groq AI chatbot
│   │       ├── emailService.js       # Nodemailer
│   │       └── notificationService.js
│   ├── tests/
│   │   ├── unit/                  # Unit tests (Vitest)
│   │   └── integration/           # Integration tests (Supertest)
│   ├── server.js                  # Entry point
│   ├── .env.test                  # Safe test-only env vars (committed)
│   └── package.json
│
├── Jenkinsfile                    # CI/CD pipeline definition
├── .dockerignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18+
- [Git](https://git-scm.com)
- A [Supabase](https://supabase.com) project (free tier works)
- A [WAQI](https://aqicn.org/api/) API token (free)
- A [Groq](https://console.groq.com) API key (free)
- A [Google Cloud](https://console.cloud.google.com) OAuth 2.0 client (for Google Sign-In)

### 1. Clone the Repository

```bash
git clone https://github.com/SMarco2310/Software-engineering-final-project.git
cd Software-engineering-final-project
```

### 2. Set Up the Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder (never commit this):

```env
PORT=4000

# PostgreSQL / Supabase
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@aws-1-eu-central-1.pooler.supabase.com:5432/postgres

# Better Auth
BETTER_AUTH_SECRET=your-super-secret-key
BETTER_AUTH_URL=http://localhost:4000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# External APIs
WAQI_TOKEN=your_waqi_token
WEATHER_API_KEY=your_openweathermap_key
GROQ_API_KEY=your_groq_api_key

# Supabase (for direct client usage)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
```

Apply the database schema to your Supabase project:

```bash
# Copy contents of server/src/config/schema.sql and run in Supabase SQL Editor
```

Start the backend:

```bash
npm run dev
```

The server runs at `http://localhost:4000`

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

The app runs at `http://localhost:5173`

---

## 🔌 API Endpoints

### Authentication (`/api/auth/*`)
Handled by Better Auth. Key endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/sign-up/email` | Register with email & password |
| `POST` | `/api/auth/sign-in/email` | Log in with email & password |
| `GET`  | `/api/auth/sign-in/social?provider=google` | Google OAuth sign-in |
| `POST` | `/api/auth/sign-out` | Sign out |

### Application API (`/api/*`)
All routes below require an authenticated session.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/risk` | Fetch current risk assessment for user's location |
| `GET` | `/api/history` | Get past risk readings |
| `GET` | `/api/alerts` | Get all alerts for user |
| `POST` | `/api/alerts` | Create a manual alert |
| `PUT` | `/api/alerts/:id/read` | Mark an alert as read |
| `DELETE` | `/api/alerts/:id` | Dismiss an alert |
| `GET` | `/api/symptoms` | Get logged symptoms |
| `POST` | `/api/symptoms` | Log a new symptom |
| `GET` | `/api/medications` | Get medications |
| `POST` | `/api/medications` | Add a medication |
| `POST` | `/api/emergency` | Trigger emergency alert |
| `POST` | `/api/chat` | Send a message to the AI chatbot |

---

## 🧮 Risk Engine

Risk is calculated by combining two models:

### 1. Rule-Based Engine (EPA / GINA 2025)

| Factor | Threshold | Risk Level |
|---|---|---|
| AQI | ≤ 50 | LOW |
| AQI | 51–100 | MODERATE |
| AQI | 101–200 | HIGH |
| AQI | > 200 | EMERGENCY |
| PM2.5 | ≤ 12 µg/m³ | LOW |
| PM2.5 | 12.1–35.4 | MODERATE |
| PM2.5 | > 35.4 | HIGH |
| Humidity | 30–50% | LOW (optimal) |
| Humidity | > 65% | EMERGENCY |
| Temperature | 20–21.6°C | LOW (ideal) |
| Temperature | < -12°C | EMERGENCY |

**Compound rules:** two or more `MODERATE` factors → escalates to `HIGH`.

### 2. ML Layer (Logistic Regression)

A lightweight logistic regression model runs alongside the rule engine using normalised AQI, PM2.5, humidity, temperature, and time-of-day features (circadian pattern). The final risk is the **higher** of the two models — the ML layer can only raise risk, never lower it (safety-first).

---

## 🗄️ Database Schema

### Better Auth Tables
| Table | Purpose |
|---|---|
| `user` | Core user identity (camelCase columns required by Better Auth v1) |
| `session` | Active sessions |
| `account` | OAuth provider accounts |
| `verification` | Email verification tokens |

### Application Tables
| Table | Purpose |
|---|---|
| `risk_readings` | Historical environmental readings + risk scores |
| `alerts` | User alerts with `is_read` status |
| `user_profiles` | Preferences, location, emergency contacts (JSONB) |
| `emergencies` | Emergency events log |
| `symptoms` | User-logged symptom entries |
| `medications` | Medication records |
| `medication_logs` | Medication intake history |

---

## 🔁 CI/CD with Jenkins

The project uses a **Jenkins declarative pipeline** defined in `Jenkinsfile`.

### Pipeline Stages

```
Checkout → Install Dependencies → Test → Build Client → Deploy
```

| Stage | What It Does |
|---|---|
| **Checkout** | Prints branch and commit info |
| **Install** | `npm ci` for both `server/` and `client/` (runs in parallel) |
| **Test** | Runs `vitest run` (32 unit + integration tests, `NODE_ENV=test`) |
| **Build** | `tsc && vite build` — produces `client/dist/` |
| **Deploy** | Placeholder — update with your deployment target |

### Running Jenkins Locally (Docker)

```bash
docker run -d \
  --name jenkins \
  --restart=always \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts
```

Open `http://localhost:8080`, complete the setup wizard, then create a **Pipeline** job pointing at this repo with `Jenkinsfile` as the script path.

### Test Environment

`server/.env.test` contains safe fake values for CI — it is intentionally committed to the repo. The real `.env` is always gitignored.

---

## 🌿 Git Workflow

We follow a **feature branch** workflow. Never commit directly to `main`.

```bash
# 1. Always pull latest main before starting work
git pull origin main

# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes, then commit
git add .
git commit -m "feat: describe what you built"

# 4. Push your branch
git push origin feature/your-feature-name

# 5. Open a Pull Request on GitHub for review
```

### Commit Message Format

```
feat:     add a new feature
fix:      fix a bug
docs:     update documentation
refactor: restructure code without changing behaviour
test:     add or update tests
ci:       update pipeline or CI config
```

---

## ⚠️ Environment Variables

Never commit your `.env` file. It is gitignored by default.

- `server/.env` → real secrets for local development and production
- `server/.env.test` → safe fake values for CI/testing (committed ✅)

---

## 👥 Team & Responsibilities

| Member | Role |
|---|---|
| Nana Kay & Keli | Frontend — UI components, dashboard, chatbot interface |
| Marc-Etienne & Favour | Backend — API routes, authentication, server setup |
| Marc-Etienne, Favour & Suzie | Database, Climate Data & Risk Logic — schema, weather API, risk engine |
| Marc-Etienne, Favour | AI chatbot & emergency system |

---

## 📄 License

This project was built as a student project. All rights reserved by the AsthmaGuard team.

---

## 🙏 Acknowledgements

- [WAQI](https://aqicn.org) for real-time air quality data
- [OpenWeatherMap](https://openweathermap.org) for weather data
- [Supabase](https://supabase.com) for the database
- [Better Auth](https://better-auth.com) for authentication
- [Groq](https://groq.com) for the LLM API
- EPA AQI Basics, GINA 2025 Global Strategy Report, and CDC Heat Health Guidelines for the risk engine thresholds
