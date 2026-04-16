# 🫁 Asthma Support System

A web-based platform that monitors real-time environmental conditions, predicts asthma attack risk, and guides bystanders through emergencies using an AI-powered chatbot.

## 🌍 Problem Statement

Asthma affects millions of people worldwide, yet most sufferers have no way of knowing when environmental conditions are dangerous until it's too late. Poor air quality, high humidity, and elevated particulate matter are all proven triggers — but this data is rarely surfaced in a way that's actionable for patients or the people around them.

This system bridges that gap.


## ✨ Features

- **Real-time Risk Monitoring** — Fetches live weather and air quality data and calculates a personalised asthma risk level (Low / Medium / High)
- **Smart Alerts** — Notifies users when environmental conditions become dangerous
- **AI Emergency Chatbot** — Guides bystanders step-by-step through an asthma attack in plain, calm language
- **Risk History** — Tracks and stores past readings so users can spot patterns over time
- **Location-aware** — Works for any location, defaulting to Accra, Ghana


## 🏗️ Architecture

```
┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│                 │        │                 │        │                 │
│    Frontend     │ ──────▶│    Backend      │──────▶ │   Supabase DB   │
│    (React)      │        │   (Node.js)     │        │  (PostgreSQL)   │
│                 │◀────── │                 │◀────── │                 │
└─────────────────┘        └────────┬────────┘        └─────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
            ┌─────────────┐ ┌────────────┐ ┌─────────────┐
            │OpenWeatherMap│ │  OpenAQ /  │ │  Claude AI  │
            │     API     │ │  IQAir API │ │     API     │
            └─────────────┘ └────────────┘ └─────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, CSS |
| Backend | Node.js, Express |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| Weather Data | OpenWeatherMap API |
| Air Quality | OpenAQ / IQAir API |
| AI Chatbot | Claude API (Anthropic) |
| Version Control | Git + GitHub |

---

## 📁 Project Structure

```
asthma-support-system/
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page-level components
│   │   ├── services/          # API call functions
│   │   └── App.js
│   └── package.json
│
├── backend/                   # Node.js + Express server
│   ├── src/
│   │   ├── routes/            # API route definitions
│   │   ├── services/          # Business logic
│   │   │   ├── weatherService.js    # Climate data fetching
│   │   │   ├── riskService.js       # Risk calculation rules
│   │   │   └── supabaseService.js   # Database operations
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org) (v18 or higher)
- [Git](https://git-scm.com)
- A [Supabase](https://supabase.com) account (free)
- An [OpenWeatherMap](https://openweathermap.org) API key (free)
- An [Anthropic](https://console.anthropic.com) API key

### 1. Clone the Repository

```bash
git clone https://github.com/your-team/asthma-support-system.git
cd asthma-support-system
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
OPENWEATHER_API_KEY=your_openweathermap_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_claude_api_key
```

Start the backend server:

```bash
node src/server.js
```

The backend will run at `http://localhost:5000`

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

The app will open at `http://localhost:3000`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/risk` | Fetch current risk level for a location |
| `GET` | `/api/history` | Get past risk readings |
| `POST` | `/api/chat` | Send a message to the AI chatbot |

### Example: GET /api/risk

**Request:**
```
GET /api/risk?location=Accra,Ghana
```

**Response:**
```json
{
  "location": "Accra, Ghana",
  "climateData": {
    "aqi": 3,
    "pm25": 38.4,
    "humidity": 74,
    "temperature": 29.4
  },
  "risk": {
    "level": "HIGH",
    "score": 75,
    "factors": ["Moderate air quality", "Elevated fine particles", "High humidity"],
    "advice": "Stay indoors. Avoid outdoor exercise. Keep inhaler accessible."
  }
}
```

---

## 🧮 Risk Calculation Logic

Risk is scored out of 100 based on three environmental factors:

| Factor | Condition | Points |
|---|---|---|
| **AQI** | Very Poor (5) | +50 |
| | Poor (4) | +35 |
| | Moderate (3) | +20 |
| | Good (1–2) | +5 |
| **PM2.5** | > 55 µg/m³ | +30 |
| | > 35 µg/m³ | +20 |
| | > 12 µg/m³ | +10 |
| **Humidity** | > 80% | +20 |
| | > 65% | +10 |

**Risk Levels:**

| Score | Level | Meaning |
|---|---|---|
| 70–100 | 🔴 HIGH | Stay indoors. Keep inhaler accessible. |
| 40–69 | 🟡 MEDIUM | Carry your inhaler. Limit outdoor activity. |
| 0–39 | 🟢 LOW | Conditions are safe for most people. |

---

## 🗄️ Database Schema

### `risk_readings`
Stores every climate reading fetched by the system.

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| location | TEXT | Location name |
| aqi | INTEGER | Air Quality Index (1–5) |
| pm25 | DECIMAL | Fine particle concentration (µg/m³) |
| humidity | INTEGER | Relative humidity (%) |
| temperature | DECIMAL | Temperature in Celsius |
| risk_level | TEXT | LOW / MEDIUM / HIGH |
| risk_score | INTEGER | Calculated score (0–100) |
| recorded_at | TIMESTAMP | When the reading was taken |

### `alerts`
Stores alerts generated for users.

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | References auth.users |
| location | TEXT | Location of the alert |
| risk_level | TEXT | Risk level at time of alert |
| message | TEXT | Alert message shown to user |
| created_at | TIMESTAMP | When the alert was created |

### `user_profiles`
Stores user preferences and saved locations.

| Column | Type | Description |
|---|---|---|
| id | UUID | References auth.users |
| full_name | TEXT | User's display name |
| location | TEXT | Preferred location |
| latitude | DECIMAL | Location latitude |
| longitude | DECIMAL | Location longitude |
| notify_on_high | BOOLEAN | Alert on HIGH risk |
| notify_on_medium | BOOLEAN | Alert on MEDIUM risk |

---

## 👥 Team & Responsibilities

| Member | Role |
|---|---|
| Nana Kay & Keli| Frontend — UI components, dashboard, chatbot interface |
|Marc-Etienne & Favour | Backend — API routes, authentication, server setup |
| Marc-Etienne, Favour & Suzie| Database, Climate Data & Risk Logic — Supabase schema, weather API integration, risk calculation |
| Marc-Etienne, Favour | AI chatbot |

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
feat: add new feature
fix: fix a bug
docs: update documentation
refactor: restructure code without changing behaviour
```

---

## ⚠️ Environment Variables

Never commit your `.env` file. It contains secret API keys. It is listed in `.gitignore` by default.

Use `.env.example` as a template — it shows which variables are needed without exposing real values.

---

## 📄 License

This project was built as a student project. All rights reserved by the team Asthma Guard.

---

## 🙏 Acknowledgements

- [OpenWeatherMap](https://openweathermap.org) for weather and air quality data
- [Supabase](https://supabase.com) for the database and authentication
- [Anthropic](https://anthropic.com) for the Claude AI API
