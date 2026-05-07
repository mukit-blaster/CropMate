# CropMate

Smart farming platform — AI crop prediction, disease detection, hire labor & machinery, marketplace for seeds & medicine.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)](https://vercel.com/)

---

## Project Structure

```
CropMate/
├── cropmate-frontend/        # React + Vite SPA (Tailwind v4 + DaisyUI)
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json           # Frontend-only deploy config
│   └── package.json
├── cropmate-backend/         # Express API (also runs as Vercel serverless fn)
│   ├── src/
│   │   ├── routes/           # users, bookings, admin, predictions,
│   │   │                       detections, knowledge, sell, ai
│   │   ├── models/           # Mongoose schemas
│   │   ├── middleware/
│   │   ├── db.js             # Cached MongoDB connection (serverless-safe)
│   │   └── index.js          # Express app (exports `app`)
│   ├── api/index.js          # Vercel serverless entry point
│   ├── vercel.json           # Backend-only deploy config
│   └── package.json
├── vercel.json               # Combined SPA + API deploy
├── package.json              # Root scripts
├── .env.example              # Env template
└── README.md
```

---

## Local Development

### 1. Install everything

```bash
npm run install:all
```

### 2. Configure env

```bash
cp .env.example cropmate-backend/.env
cp cropmate-frontend/.env.example cropmate-frontend/.env
# Fill in MONGO_URI, GEMINI_API_KEY, Firebase keys
```

### 3. Run both apps

```bash
npm run dev
# frontend: http://localhost:5173
# backend:  http://localhost:5001
```

Or separately:

```bash
npm run dev:backend
npm run dev:frontend
```

---

## Deploying to Vercel (one project, SPA + API)

The repository is set up so a single Vercel project deploys both the frontend and the backend.

1. Push to GitHub.
2. Import the repo in Vercel — pick the **`CropMate`** directory as the project root.
3. Vercel auto-detects `vercel.json`. Build command, output directory, and serverless function are configured.
4. In **Project Settings → Environment Variables**, add:
   - `MONGO_URI`
   - `GEMINI_API_KEY`
   - `CLIENT_ORIGIN` (your Vercel URL, e.g. `https://your-app.vercel.app`)
   - `NODE_ENV=production`
   - All `VITE_FIREBASE_*` keys (frontend Firebase config)
   - Leave `VITE_API_URL` **empty** in production — the SPA uses same-origin `/api/*` via the rewrite.
5. Deploy.

Vercel routes:
- `/` → static SPA from `cropmate-frontend/dist`
- `/api/*` → serverless function at `cropmate-backend/api/index.js` (the Express app)

### Deploying frontend and backend as two separate projects

Each app also has its own `vercel.json`. Point a Vercel project's root at `cropmate-frontend/` (frontend only) or `cropmate-backend/` (backend only).

---

## Environment variables

### Backend
| Variable          | Required | Purpose                                |
| ----------------- | -------- | -------------------------------------- |
| `MONGO_URI`       | yes      | MongoDB Atlas connection string        |
| `GEMINI_API_KEY`  | yes      | Google Generative AI key (crop & disease AI) |
| `CLIENT_ORIGIN`   | prod     | Allowed CORS origin                    |
| `PORT`            | no       | Local port (default 5001)              |
| `NODE_ENV`        | no       | `development` or `production`          |

### Frontend
| Variable                              | Required | Purpose                                          |
| ------------------------------------- | -------- | ------------------------------------------------ |
| `VITE_API_URL`                        | no       | Backend URL (leave empty in production)          |
| `VITE_FIREBASE_API_KEY` (and friends) | yes      | Firebase web SDK config                          |

---

## Features

- **Auth** — Email/password & Google sign-in (Firebase). Roles synced to MongoDB.
- **Hire** — Browse and book farm machinery / skilled labor.
- **Predict Crop** — Soil/weather inputs → Gemini-powered crop recommendations.
- **Disease Detector** — Upload leaf photo → Gemini multimodal diagnosis.
- **Knowledge Hub** — Curated farming tips with categories & search.
- **Marketplace** — Buy seeds, fertilizers, and crop medicines.
- **Coverage Map** — Leaflet map of service centers across Bangladesh.
- **Admin Dashboard** — Stats, user/role management, content moderation.

---

## API Endpoints (selected)

```
GET    /api/health                 # liveness
POST   /api/users                  # upsert user
GET    /api/users/:uid             # fetch user
POST   /api/bookings               # create booking
GET    /api/bookings/user/:userId  # user's bookings
POST   /api/ai/predict-crop        # AI crop prediction
POST   /api/ai/detect-disease      # AI disease detection (multipart image)
GET    /api/knowledge              # list tips
GET    /api/sell                   # list marketplace items
GET    /api/admin/stats            # admin dashboard (requires admin)
```

---

## License

MIT
