import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

let getAccessToken = () => localStorage.getItem('accessToken');
let setAccessToken = (token) => localStorage.setItem('accessToken', token);
let setUserRole = (role) => localStorage.setItem('userRole', role);

let logoutFn = () => {};

export const setAuthHandlers = ({ logout, updateAccessToken, updateUserRole }) => {
  logoutFn = logout;
  setAccessToken = updateAccessToken;
  setUserRole = updateUserRole;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const plainApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error.response?.status === 401;
    const isTokenExpired = error.response?.data?.error === "Expired token";

    if (isUnauthorized && isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await plainApi.post('auth/refresh-token');
        const { accessToken } = res.data;
        const decoded = jwtDecode(accessToken);

        setAccessToken(accessToken);
        setUserRole(decoded?.role);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return plainApi(originalRequest);
      } catch (refreshErr) {
        logoutFn();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;