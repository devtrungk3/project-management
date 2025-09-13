import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { getCsrfToken } from '../services/AuthService';

let getAccessToken = () => localStorage.getItem('accessToken');
let setAccessToken = (token) => localStorage.setItem('accessToken', token);
let setUserRole = (role) => localStorage.setItem('userRole', role);

let logoutFn = () => {};

export const setAuthHandlers = ({ logout, updateAccessToken, updateUserRole }) => {
  logoutFn = logout;
  setAccessToken = updateAccessToken;
  setUserRole = updateUserRole;
};

const customApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const plainApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

customApi.interceptors.request.use(async (config) => {
  const csrf = await getCsrfToken();
  config.headers["X-XSRF-TOKEN"] = csrf?.token || "";
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

customApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error.response?.status === 401;
    if (isUnauthorized) {
      switch (error.response?.data?.error_code) {
        case "EXPIRED_TOKEN":
          if (isUnauthorized && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
              let csrf = await getCsrfToken();
              const refreshTokenResponse = await plainApi.post(
                'auth/refresh-token',
                {},
                {
                  headers: {
                  "X-XSRF-TOKEN": csrf?.token || ""
                  }
                }
              );
              const newAccessToken = refreshTokenResponse.data;
              const decoded = jwtDecode(newAccessToken);

              setAccessToken(newAccessToken);
              setUserRole(decoded?.role);

              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              csrf = await getCsrfToken();
              originalRequest.headers['X-XSRF-TOKEN'] = csrf?.token || "";
              return plainApi(originalRequest);
            } catch (refreshErr) {
              await logoutFn();
              toast.error("Session expired, please log in again.");
              return Promise.reject(refreshErr);
            }
          }
          break;
        case "INACTIVE":
            await logoutFn();
            toast.error("Your account has been locked");
        default:
          break;
      }
      return Promise.reject(error);
    } else {
      toast.error(error.response?.data?.error || "Something went wrong");
    }
    return Promise.reject(error);
  }
);

export default customApi;