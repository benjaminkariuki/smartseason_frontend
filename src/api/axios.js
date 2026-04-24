// src/api/axios.js
import axios from 'axios';

const api = axios.create({
    // Vite will inject the Vercel URL in production, but fallback to localhost for local coding
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000', 
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true, 
    withXSRFToken: true,
});

export default api;