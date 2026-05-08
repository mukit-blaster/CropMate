<div align="center">

# CropMate

### AI-Powered Smart Farming Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-cropmate--sigma.vercel.app-22c55e?style=for-the-badge&logo=vercel)](https://cropmate-sigma.vercel.app/)

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)

CropMate is a full-stack smart farming web application that helps farmers make data-driven decisions using AI. It provides AI-powered crop prediction, plant disease detection, a machinery & labor hiring system, a crop marketplace, and a farming knowledge hub — all in one platform.

</div>

---

## Features

| Feature | Description |
|---|---|
| **AI Crop Predictor** | Enter soil type, pH level, humidity, and temperature to get Gemini-powered crop recommendations |
| **Disease Detector** | Upload a leaf photo for instant AI diagnosis and treatment suggestions |
| **Hire Machinery & Labor** | Browse and book tractors, harvesters, and skilled farm workers with scheduling |
| **Marketplace** | Buy and sell seeds, fertilizers, and crop medicines |
| **Knowledge Hub** | Curated farming tips and guides with category filtering and search |
| **Coverage Map** | Interactive Leaflet map showing service availability across Bangladesh |
| **Authentication** | Email/password and Google sign-in via Firebase with role-based access |
| **Admin Dashboard** | Manage users, bookings, listings, and view platform analytics |

---

## Tech Stack

### Frontend
- **React 18** + **Vite 7** — fast SPA with HMR
- **Tailwind CSS v4** + **DaisyUI** — utility-first styling
- **React Router v7** — client-side routing
- **Firebase** — authentication (email/password + Google OAuth)
- **Leaflet** + **React Leaflet** — interactive maps
- **Axios** — HTTP client
- **React Hook Form** — form management
- **React Markdown** — renders AI responses as formatted markdown

### Backend
- **Node.js** + **Express 5** — REST API
- **MongoDB** + **Mongoose** — database and ODM
- **Google Generative AI (Gemini)** — crop prediction and disease detection
- **Multer** — multipart image upload handling
- **CORS** + **dotenv** — cross-origin support and environment configuration

### Infrastructure
- **Vercel** — unified deployment (SPA + serverless API from one repository)
- **MongoDB Atlas** — cloud-hosted database

---

## Project Structure

```
CropMate/
├── cropmate-frontend/          # React + Vite SPA
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Route-level page components
│   │   ├── context/            # Auth context and provider
│   │   ├── hooks/              # Custom React hooks
│   │   ├── routes/             # Route guards (PrivateRoute, AdminRoute)
│   │   └── layout/             # Root and auth layouts
│   └── package.json
├── cropmate-backend/           # Express REST API
│   ├── src/
│   │   ├── routes/             # users, bookings, admin, predictions,
│   │   │                         detections, knowledge, sell, ai
│   │   ├── models/             # Mongoose schemas
│   │   ├── middleware/         # Auth and error middleware
│   │   ├── db.js               # Cached MongoDB connection (serverless-safe)
│   │   └── index.js            # Express app entry point
│   └── package.json
├── api/
│   └── index.js                # Vercel serverless function entry point
├── vercel.json                 # Unified Vercel deployment config
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key
- Firebase project (for authentication)

### 1. Clone the repository

```bash
git clone https://github.com/mukit-blaster/CropMate.git
cd CropMate
```

### 2. Install dependencies

```bash
# Backend
cd cropmate-backend && npm install

# Frontend
cd ../cropmate-frontend && npm install
```

### 3. Configure environment variables

Create `cropmate-backend/.env`:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
CLIENT_ORIGIN=http://localhost:5173
PORT=5001
NODE_ENV=development
```

Create `cropmate-frontend/.env`:

```env
VITE_API_URL=http://localhost:5001
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run the development servers

```bash
# Terminal 1 — Backend (http://localhost:5001)
cd cropmate-backend && npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd cropmate-frontend && npm run dev
```

---

## Deployment

The repository is configured for a **single Vercel project** that serves both the React SPA and the Express API as a serverless function.

### Steps

1. Push the repository to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo
3. Set **Root Directory** to empty (repo root) and **Framework Preset** to **Other**
4. Add the following **Environment Variables** in the Vercel dashboard:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `GEMINI_API_KEY` | Google Gemini API key |
| `CLIENT_ORIGIN` | Your Vercel deployment URL |
| `NODE_ENV` | `production` |
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

> Leave `VITE_API_URL` **empty** in production — the frontend uses same-origin `/api/*` routing via Vercel rewrites.

5. Click **Deploy**

**Vercel routing** (defined in `vercel.json`):
- `/api/*` → Express serverless function
- `/*` → React SPA (`index.html`)

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/users` | Create or upsert a user |
| `GET` | `/api/users/:uid` | Get user by Firebase UID |
| `POST` | `/api/bookings` | Create a booking |
| `GET` | `/api/bookings/user/:userId` | Get bookings for a user |
| `POST` | `/api/ai/predict-crop` | AI crop recommendation (soil/weather inputs) |
| `POST` | `/api/ai/detect-disease` | AI plant disease detection (image upload) |
| `GET` | `/api/knowledge` | List knowledge hub articles |
| `GET` | `/api/sell` | List marketplace items |
| `GET` | `/api/admin/stats` | Admin dashboard statistics (admin only) |

---

## License

This project is licensed under the [MIT License](LICENSE).
