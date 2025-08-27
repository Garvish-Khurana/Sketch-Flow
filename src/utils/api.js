import axios from 'axios';

const baseURL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
  withCredentials: false,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(error)
);

export const apiGet = (url, config = {}) => axiosInstance.get(url, config);
export const apiPost = (url, data, config = {}) => axiosInstance.post(url, data, config);
export const apiPut = (url, data, config = {}) => axiosInstance.put(url, data, config);
export const apiDelete = (url, config = {}) => axiosInstance.delete(url, config);

const api = { get: apiGet, post: apiPost, put: apiPut, delete: apiDelete };
export default api;
