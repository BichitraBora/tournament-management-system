import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Uses the proxy from vite.config.js
    withCredentials: true, // Crucial for sending the JWT cookie
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;