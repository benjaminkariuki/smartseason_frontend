// src/api/axios.js
import axios from 'axios';

const api = axios.create({
    // Replace with your Laravel local server URL if it differs
    baseURL: 'http://localhost:8000', 
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    // CRITICAL: This tells Axios to include cookies/credentials in cross-domain requests
    withCredentials: true, 
    withXSRFToken: true,
});

export default api;