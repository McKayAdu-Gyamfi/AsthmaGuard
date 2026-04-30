-- TEST USER

INSERT INTO "user" (
  id, name, email, email_verified,
  created_at, updated_at
) VALUES (
  'test-user-001',
  'Stephen Marcus',
  'stephen@test.com',
  true,
  NOW(),
  NOW()
);


INSERT INTO user_profiles (
  id, location, latitude, longitude,
  notify_on_high, notify_on_medium
) VALUES (
  'test-user-001',
  'Accra, Ghana',
  5.6037,
  -0.1870,
  true,
  false
);


INSERT INTO risk_readings
  (location, latitude, longitude, aqi, pm25, pm10, humidity, temperature, risk_level, risk_score, recorded_at)
VALUES
  ('Accra, Ghana', 5.6037, -0.1870, 4, 55.3, 32.1, 79, 29.4, 'HIGH',   85, NOW() - INTERVAL '0 days'),
  ('Accra, Ghana', 5.6037, -0.1870, 3, 38.4, 28.0, 74, 28.1, 'MEDIUM', 55, NOW() - INTERVAL '1 days'),
  ('Accra, Ghana', 5.6037, -0.1870, 2, 18.2, 15.3, 60, 27.5, 'LOW',    25, NOW() - INTERVAL '2 days'),
  ('Accra, Ghana', 5.6037, -0.1870, 4, 52.1, 30.4, 82, 30.2, 'HIGH',   80, NOW() - INTERVAL '3 days'),
  ('Accra, Ghana', 5.6037, -0.1870, 3, 41.0, 25.6, 71, 28.9, 'MEDIUM', 60, NOW() - INTERVAL '4 days'),
  ('Accra, Ghana', 5.6037, -0.1870, 2, 12.5, 10.2, 55, 27.0, 'LOW',    20, NOW() - INTERVAL '5 days'),
  ('Accra, Ghana', 5.6037, -0.1870, 5, 67.8, 45.3, 85, 31.0, 'HIGH',   95, NOW() - INTERVAL '6 days');


INSERT INTO alerts
  (user_id, location, risk_level, aqi, message, created_at)
VALUES
  ('test-user-001', 'Accra, Ghana', 'HIGH',   4, 'Dangerous air quality detected. Stay indoors and keep your inhaler accessible.', NOW() - INTERVAL '0 days'),
  ('test-user-001', 'Accra, Ghana', 'HIGH',   4, 'Air quality remains poor. Avoid outdoor exercise today.',                        NOW() - INTERVAL '3 days'),
  ('test-user-001', 'Accra, Ghana', 'MEDIUM', 3, 'Moderate risk today. Carry your inhaler if going outside.',                     NOW() - INTERVAL '4 days'),
  ('test-user-001', 'Accra, Ghana', 'HIGH',   5, 'Very poor air quality. Conditions are dangerous for asthma sufferers.',         NOW() - INTERVAL '6 days');


INSERT INTO emergency_contacts
  (user_id, name, phone, relationship, created_at)
VALUES
  ('test-user-001', 'Kwame Mensah',  '+233241234567', 'Father',  NOW()),
  ('test-user-001', 'Ama Owusu',     '+233209876543', 'Mother',  NOW()),
  ('test-user-001', 'Dr. Asante',    '+233301234567', 'Doctor',  NOW());
