// src/utils/axios.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true // ✅ this line is CRUCIAL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token && typeof token === "string") {
        // DON'T re-add Bearer if it's already included
        config.headers.Authorization = token.startsWith("Bearer") ?
            token :
            `Bearer ${token}`;
    }
    return config;
});

export default api;