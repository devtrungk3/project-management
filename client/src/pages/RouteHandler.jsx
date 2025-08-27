import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './Auth/Login'
import Register from './Auth/Register'
import AdminHome from './Admin/AdminHome'
import UserHome from './User/UserHome'
import DetailProject from './User/DetailProject'
import useAuth from '../hooks/useAuth'

function RouteHandler() {
  const location = useLocation()
  const currentPath = location.pathname.replace(/\/+/g, '/');

  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated && currentPath !== '/login' && currentPath !== '/register') {
    return <Navigate to="/login" />
  }
  
  if (isAuthenticated && userRole === 'USER') {
    if (['/', '/login', '/register'].includes(currentPath) || currentPath.startsWith('/admin')) {
      return <Navigate to="/user/home" />
    }
  }

  if (isAuthenticated && userRole === 'ADMIN') {
    if (['/', '/login', '/register'].includes(currentPath) || currentPath.startsWith('/user')) {
      return <Navigate to="/admin/dashboard" />
    }
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* specific */}
      <Route path="/user/my-projects/:projectId/*" element={<DetailProject isMyProject={true} />} />
      <Route path="/user/joined-projects/:projectId/*" element={<DetailProject isMyProject={false} />} />
      {/* general */}
      <Route path="/admin/*" element={<AdminHome />} />
      <Route path="/user/*" element={<UserHome />} />
      {/* fallback */}
      <Route path="*" element={<Navigate to={isAuthenticated ? (userRole === 'ADMIN' ? '/admin/dashboard' : '/user/home') : '/login'} />} />
    </Routes>
  )
}

export default RouteHandler