import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export default function useAuth() {
  const {
    setAccessToken,
    setUserRole,
    accessToken,
    userRole,
    isAuthenticated
  } = useContext(AuthContext);

  const navigate = useNavigate();
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
  });

  const login = async (formData) => {
    try {
      const response = await api.post('auth/login', formData);
      const { accessToken } = response.data;

      if (accessToken) {
        const decodedToken = jwtDecode(accessToken);
        const role = decodedToken?.role;

        setAccessToken(accessToken);
        setUserRole(role);

        if (role === 'ADMIN') {
          navigate('/dashboard');
        } else if (role === 'USER') {
          navigate('/user');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    setAccessToken(null);
    setUserRole(null);

    try {
        await api.post('auth/revoke-refresh-token');
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }

    navigate('/login');
  };

  return {
    setAccessToken,
    setUserRole,
    accessToken,
    userRole,
    login,
    logout,
    isAuthenticated,
  };
}