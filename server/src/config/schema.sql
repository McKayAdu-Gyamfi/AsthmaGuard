-- ============================================================
-- Better Auth Core Schema (Snake Case — Best for PostgreSQL)
-- ============================================================

CREATE TABLE "user" (
    id               TEXT PRIMARY KEY,
    name             TEXT NOT NULL,
    email            TEXT NOT NULL UNIQUE,
    email_verified   BOOLEAN NOT NULL DEFAULT FALSE,
    image            TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "session" (
    id           TEXT PRIMARY KEY,
    user_id      TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    token        TEXT NOT NULL UNIQUE,
    expires_at   TIMESTAMPTZ NOT NULL,
    ip_address   TEXT,
    user_agent   TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "account" (
    id                        TEXT PRIMARY KEY,
    account_id                TEXT NOT NULL,
    provider_id               TEXT NOT NULL,
    user_id                   TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    access_token              TEXT,
    refresh_token             TEXT,
    id_token                  TEXT,
    access_token_expires_at   TIMESTAMPTZ,
    refresh_token_expires_at  TIMESTAMPTZ,
    scope                     TEXT,
    password                  TEXT,
    created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "verification" (
    
    id           TEXT PRIMARY KEY,
    identifier   TEXT NOT NULL,
    value        TEXT NOT NULL,
    expires_at   TIMESTAMPTZ NOT NULL,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Asthma Risk Monitoring Tables
-- ============================================================

CREATE TABLE risk_readings (
    id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     TEXT        REFERENCES "user"(id) ON DELETE CASCADE,
    location    TEXT        NOT NULL,
    latitude    DECIMAL,
    longitude   DECIMAL,
    aqi         INTEGER,
    pm25        DECIMAL,
    pm10        DECIMAL,
    humidity    INTEGER,
    temperature DECIMAL,
    risk_level  TEXT        CHECK (risk_level IN ('LOW', 'MODERATE', 'HIGH', 'EMERGENCY')),
    risk_score  INTEGER,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE alerts (
    id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id    TEXT        REFERENCES "user"(id) ON DELETE CASCADE,
    location   TEXT,
    risk_level TEXT,
    aqi        INTEGER,
    message    TEXT,
    is_read    BOOLEAN     DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_profiles (
    id                 TEXT        REFERENCES "user"(id) ON DELETE CASCADE PRIMARY KEY,
    location           TEXT        DEFAULT 'Accra, Ghana',
    asthma_severity    TEXT        DEFAULT 'Moderate',
    latitude           DECIMAL     DEFAULT 5.6037,
    longitude          DECIMAL     DEFAULT -0.1870,
    notify_on_high     BOOLEAN     DEFAULT TRUE,
    notify_on_medium   BOOLEAN     DEFAULT FALSE,
    emergency_contacts JSONB       DEFAULT '[]',
    created_at         TIMESTAMPTZ DEFAULT NOW(),
    updated_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE emergencies (
    id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id    TEXT        REFERENCES "user"(id) ON DELETE CASCADE,
    location   TEXT        NOT NULL,
    status     TEXT        DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Health Tracking Tables
-- ============================================================

CREATE TABLE symptoms (
    id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id    TEXT        NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    type       TEXT        NOT NULL,
    severity   INTEGER     CHECK (severity BETWEEN 1 AND 5),
    notes      TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE medications (
    id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id    TEXT        NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    name       TEXT        NOT NULL,
    dosage     TEXT,
    type       TEXT        CHECK (type IN ('Controller', 'Rescue')),
    frequency  TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE medication_logs (
    id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    medication_id UUID        REFERENCES medications(id) ON DELETE CASCADE,
    user_id       TEXT        NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    taken_at      TIMESTAMPTZ DEFAULT NOW()
);
