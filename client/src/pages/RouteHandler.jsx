import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './Auth/Login'
import Register from './Auth/Register'
import Dashboard from './Admin/Dashboard'
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
    if (['/', '/login', '/register'].includes(currentPath) || currentPath.startsWith('/dashboard')) {
      return <Navigate to="/user" />
    }
  }

  if (isAuthenticated && userRole === 'ADMIN') {
    console.log(currentPath)
    if (['/', '/login', '/register'].includes(currentPath) || currentPath.startsWith('/user')) {
      return <Navigate to="/dashboard" />
    }
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* specific */}
      <Route path="/user/my-projects/:projectId" element={<DetailProject isMyProject={true} />} />
      <Route path="/user/joined-projects/:projectId" element={<DetailProject isMyProject={false} />} />
      {/* general */}
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/user/*" element={<UserHome />} />
      {/* fallback */}
      <Route path="*" element={<Navigate to={isAuthenticated ? (userRole === 'ADMIN' ? '/dashboard' : '/user') : '/login'} />} />
    </Routes>
  )
}

export default RouteHandler