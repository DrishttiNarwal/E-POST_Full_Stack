// import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
// import { getToken, removeToken } from './tokens';

// const AUTH_TOKEN_KEY = "jwtToken"; // Consider moving to src/lib/constants.ts

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
//   headers: { 'Content-Type': 'application/json' },
// });

// // Attach token to every request
// api.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token = getToken();
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Handle 401 responses (unauthenticated)
// api.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error: AxiosError) => {
//     if (error.response?.status === 401) {
//       removeToken();
//       delete api.defaults.headers.common['Authorization'];
//       if (typeof window !== 'undefined') {
//         // window.location.href = '/'; // Redirect to login
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getToken, removeToken } from './tokens';

const AUTH_TOKEN_KEY = "jwtToken"; // Optional: Move to constants.ts

const api = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ Hardcoded for dev, or use .env
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeToken();
      delete api.defaults.headers.common['Authorization'];
      if (typeof window !== 'undefined') {
        // Optionally redirect to login
        // window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
