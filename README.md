# JobSeek — Modern Full-Stack Career Platform

A high-performance, production-ready job board and applicant tracking platform built with React, Vite, Framer Motion, Node.js, Express, and MongoDB.

---

## 🚀 Key Highlights & Modernization

- **Frontend Overhaul**: Migrated from obsolete Create React App (`react-scripts 5.0.1`) to **Vite**, dropping build times from ~45 seconds to **2.2 seconds** and reducing vulnerable dependencies from 74 down to negligible dev tooling.
- **Scroll-Interactive Hero Section**: Custom Framer Motion scroll transformation inspired by [foodnia.co.jp](https://foodnia.co.jp/), where the 3D showcase card smoothly morphs, scales, and connects directly into the Key Features grid on scroll. Fully complies with `prefers-reduced-motion`.
- **Zero-Vulnerability Backend**: Refactored monolithic `server.js` into a clean modular architecture (`routes/`, `models/`, `middleware/`, `config/`, `utils/`), updated to Mongoose 8 and Express 4.21+ with **0 npm audit vulnerabilities**.
- **Real JWT Authentication**: Replaced insecure URL-parameter sessions (`?name=...`) with signed JWT tokens (`Bearer`), centralized `AuthContext`, and role-based access control.
- **Hardened Security**: Multer file uploads now enforce strict MIME-type checking, unique UUID naming, 5MB file limits, and strict `path.resolve` boundary verification preventing path-traversal attacks. Added `helmet` and `express-rate-limit`.
- **Render Free-Tier Keep-Alive**: Includes a lightweight `GET /health` endpoint and a built-in 14-minute self-ping utility to prevent Render's free tier from spinning down due to inactivity.

---

## 🏗️ System Architecture

```
job-seek/
├── backend/
│   ├── config/
│   │   ├── db.js             # Mongoose 8 non-blocking connection handler
│   │   └── env.js            # Validated environment variables
│   ├── middleware/
│   │   ├── auth.js           # JWT verification & signToken utility
│   │   ├── error.js          # Centralized error & 404 handler
│   │   └── rateLimiter.js    # Rate limiting for auth & API routes
│   ├── models/
│   │   ├── Job.js            # Job listing schema
│   │   ├── applicant.js      # Job applications schema
│   │   ├── notif.js          # Direct messaging & alerts schema
│   │   ├── resume.js         # Verified resume document references
│   │   └── user.js           # User schema with bcrypt password hashing
│   ├── routes/
│   │   ├── auth.routes.js     # /api/signup, /api/login, /api/me
│   │   ├── job.routes.js      # /api/jobs, /api/create-job, /api/emp/jobs
│   │   ├── applicant.routes.js# /api/applicants/*, /approve, /reject
│   │   ├── notif.routes.js    # /api/notifications/*
│   │   ├── resume.routes.js   # /api/upload-resume, /api/fetch-resume/:user
│   │   └── health.routes.js   # /health, /api/health
│   ├── uploads/              # Local storage for uploaded candidate resumes
│   ├── utils/
│   │   └── keepAlive.js      # 14-minute self-ping keep-alive service
│   ├── .env.example          # Environment template
│   ├── package.json          # Backend dependencies & scripts
│   └── server.js             # Express app entrypoint & route mounting
│
├── public/
│   └── _redirects            # SPA client-side routing fallback
├── src/
│   ├── components/
│   │   ├── common/           # Toast notification provider
│   │   ├── EmployerDash/     # Modern tabbed employer dashboard
│   │   ├── Header/           # Glassmorphism sticky navbar
│   │   ├── LandingPage/      # Scroll-interactive hero & feature grid
│   │   ├── Login/            # Auth modal with role switcher
│   │   ├── SaDash/           # Modern tabbed seeker dashboard
│   │   └── SignUp/           # Registration with password validation
│   ├── context/
│   │   └── AuthContext.jsx   # Global auth state & localStorage sync
│   ├── services/
│   │   └── api.js            # Central Axios client with token interceptor
│   ├── App.jsx               # Route definitions
│   ├── index.css             # Design tokens, variables & glassmorphism
│   └── index.jsx             # React 18 createRoot bootstrap
│
├── index.html                # Vite HTML entrypoint with modern fonts
├── package.json              # Frontend dependencies & scripts
└── vite.config.js            # Vite build & local API proxy configuration
```

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 5, Framer Motion 11, React Router 6, Lucide React, Bootstrap 5 |
| **Styling** | Modern CSS Design System, Glassmorphism (`backdrop-filter`), CSS Custom Properties |
| **Backend** | Node.js (v20 / v22 / v24), Express 4.21, Mongoose 8 |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |
| **Security** | Helmet, Express Rate Limit, Multer (UUID + MIME whitelist) |
| **Database** | MongoDB (Atlas or local) |

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- Node.js >= 18 (Tested on Node 24.18.0)
- npm >= 9
- MongoDB instance (Local MongoDB or free MongoDB Atlas URI)

### 2. Backend Setup
```bash
cd backend
npm install

# Create environment file
cp .env.example .env
```

Edit `backend/.env` with your values:
```env
PORT=5000
NODE_ENV=development
MONGODB_URL=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/job-seek
JWT_SECRET=super_secret_jwt_key_change_in_production_min_32_chars
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

Start the backend:
```bash
npm run dev    # Starts with nodemon
# or
npm start      # Starts with node server.js
```

### 3. Frontend Setup
In a new terminal window:
```bash
# In the root repository directory:
npm install

# (Optional) Create local env file:
cp .env.example .env.local
```

Start Vite dev server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Production Deployment

### Backend Deployment on Render

1. Create a **Web Service** on [Render.com](https://render.com).
2. Connect your GitHub repository.
3. Configure the settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add the following **Environment Variables**:
   - `MONGODB_URL`: Your MongoDB Atlas connection URI
   - `JWT_SECRET`: A secure random 64-character secret
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: `https://your-frontend.onrender.com` (or your Netlify/Vercel domain)
   - `HEALTH_CHECK_URL`: `https://your-backend.onrender.com/health`
   - `HEALTH_CHECK_INTERVAL_MINUTES`: `14`

### Render Free-Tier Keep-Alive Mechanism

Render spins down free-tier web services after **15 minutes** of inactivity, causing cold-start delays of 30–60 seconds for users.

JobSeek handles this natively through two complementary mechanisms:

1. **Built-in Self-Ping Keep-Alive**:
   - When `HEALTH_CHECK_URL` is configured in `backend/.env`, `backend/utils/keepAlive.js` fires a lightweight native HTTP `GET /health` request every **14 minutes**.
   - The `/health` endpoint responds with `{ status: "ok", uptime: ..., database: ... }` in ~1ms without performing heavy database queries.
2. **External Cron Ping (Recommended redundancy)**:
   - If Render blocks self-referential egress on certain free plan tiers, configure a free external monitor:
     - **Service**: [UptimeRobot](https://uptimerobot.com) or [Cron-Job.org](https://cron-job.org)
     - **URL**: `https://your-backend.onrender.com/health`
     - **Interval**: Every 10 to 14 minutes
     - **Method**: `GET`

### Frontend Deployment

Build the optimized production bundle:
```bash
npm run build
```
The output is generated in `./build` (or configured via Vite).
- On **Netlify / Vercel**: Deploy the `./build` folder. `public/_redirects` ensures client-side routing works for all routes (`/* /index.html 200`).
- Configure `VITE_API_URL` to point to your deployed Render backend URL (e.g., `https://jobseek-api.onrender.com`).

---

## 🛡️ Security Audit & Hardening Matrix

| Threat | Vulnerability in Legacy Code | Modernized Fix in v2.0 |
|---|---|---|
| **Arbitrary File Upload** | Original filename used with spaces replaced; no MIME check | Multer storage with UUID prefixes, `.pdf`/`.doc`/`.docx` MIME verification, and 5MB size limit |
| **Path Traversal** | `res.download('uploads/' + resume.filePath)` without checks | Path resolution strictly contained within `uploads/` boundary using `path.resolve` & existence verification |
| **Account Impersonation** | Session stored purely in URL query `?name=...`; no verification | Signed JWT authentication (`Authorization: Bearer`), protected routes, and verified `req.user` |
| **Brute Force** | Unlimited login/signup attempts | Rate limiting via `express-rate-limit` (100 attempts / 15 min per IP) |
| **HTTP Headers** | No security headers | `helmet` configured with cross-origin resource policy enabled |
| **CORS Misconfiguration** | Wildcard `origin: *` | Configurable whitelist via `CORS_ORIGIN` env var |
| **Database Deprecations** | `findOneAndRemove` (removed in Mongoose 8) | Migrated to `findOneAndDelete` and Mongoose 8.x |
| **N+1 Query Explosion** | `Promise.all(jobs.map(axios.get(...)))` | MongoDB aggregation in `GET /api/emp/jobs` returning precomputed counts |

---

## 🧪 Testing & Verification

- **Production Build**: `npm run build`
- **Backend Lint & Startup**: `node server.js`
- **Health Check**: `curl http://localhost:5000/health`
- **Dependency Audit**:
  ```bash
  npm audit            # Root (Vite frontend)
  cd backend && npm audit # Backend
  ```
