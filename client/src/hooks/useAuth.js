import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../services/AuthService';

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
      const accessToken  = await loginApi(formData);

      if (accessToken) {
        const decodedToken = jwtDecode(accessToken);
        const decodedUserRole = decodedToken?.role;

        setAccessToken(accessToken);
        setUserRole(decodedUserRole);

        if (decodedUserRole === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (decodedUserRole === 'USER') {
          navigate('/user/home');
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
        console.error('Logout error:', error);
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