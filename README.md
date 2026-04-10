
performance-insights/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Performance.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── performance.js
│   │   └── reports.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Layout.js
    │   │   ├── Sidebar.js
    │   │   └── ScoreBar.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── Users.js
    │   │   ├── Performance.js
    │   │   ├── MyPerformance.js
    │   │   └── Reports.js
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json





PORT=5000
MONGO_URI=mongodb://localhost:27017/performance_insights



## API Endpoints

| Method | Route | Access |
|--------|-------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Auth |
| GET | /api/users | Admin |
| PATCH | /api/users/:id/status | Admin |
| DELETE | /api/users/:id | Admin |
| GET | /api/performance | Auth |
| POST | /api/performance | Admin |
| PUT | /api/performance/:id | Admin |
| DELETE | /api/performance/:id | Admin |
| GET | /api/reports/summary | Auth |

---

