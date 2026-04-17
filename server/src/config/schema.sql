-- Better Auth core schema for PostgreSQL

CREATE TABLE "user" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    email_verified BOOLEAN NOT NULL,
    image TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE "session" (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES "user"(id),
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE "account" (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES "user"(id),
    account_id TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP,
    password TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE "verification" (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Asthma Risk Monitoring Tables

CREATE TABLE risk_readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  latitude DECIMAL,
  longitude DECIMAL,
  aqi INTEGER,
  pm25 DECIMAL,
  pm10 DECIMAL,
  humidity INTEGER,
  temperature DECIMAL,
  risk_level TEXT CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
  risk_score INTEGER,
  recorded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES "user"(id),
  location TEXT,
  risk_level TEXT,
  aqi INTEGER,
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_profiles (
  id TEXT REFERENCES "user"(id) PRIMARY KEY,
  location TEXT DEFAULT 'Accra, Ghana',
  latitude DECIMAL DEFAULT 5.6037,
  longitude DECIMAL DEFAULT -0.1870,
  notify_on_high BOOLEAN DEFAULT TRUE,
  notify_on_medium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
