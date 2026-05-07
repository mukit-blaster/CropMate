import axios from 'axios';

export const API_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? '' // same-origin: rely on Vercel rewrites for /api/*
    : 'http://localhost:5001');

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

export default api;
