sams-backend/
├── server.js                        # Entry point
├── package.json
├── .env.example
├── .gitignore
│
├── src/
│   ├── auth.js                      # ⭐ BetterAuth config (NEW — replaces entire auth folder)
│   │
│   ├── config/
│   │   ├── db.js                    # PostgreSQL Pool — shared by app AND BetterAuth
│   │   └── schema.sql               # DB tables (BetterAuth auto-generates its own tables)
│   │
│   ├── controllers/
│   │   ├── userController.js        # getMe, updateMe, emergency contacts
│   │   ├── environmentController.js
│   │   ├── alertController.js
│   │   ├── symptomController.js
│   │   ├── medicationController.js
│   │   └── emergencyController.js
│   │
│   ├── routes/
│   │   ├── index.js                 # Mounts all routers (NO auth routes — BetterAuth handles that)
│   │   ├── userRoutes.js
│   │   ├── environmentRoutes.js
│   │   ├── alertRoutes.js
│   │   ├── symptomRoutes.js
│   │   ├── medicationRoutes.js
│   │   └── emergencyRoutes.js
│   │
│   ├── middleware/
│   │   ├── requireAuth.js           # ⭐ Replaces auth.js — uses BetterAuth session (NEW)
│   │   ├── errorHandler.js
│   │   ├── validate.js
│   │   └── rateLimiter.js
│   │
│   ├── services/
│   │   ├── weatherService.js
│   │   ├── aqiService.js
│   │   ├── riskEngineService.js
│   │   ├── notificationService.js
│   │   └── emailService.js
│   │
│   └── utils/
│       ├── constants.js
│       ├── helpers.js
│       └── logger.js
│
└── tests/
    ├── unit/
    │   └── riskEngine.test.js
    └── integration/
        └── auth.test.js