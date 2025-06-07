// src/api/axios.js or axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ backend root
  withCredentials: true, // include cookies if using sessions
});

export default api;
