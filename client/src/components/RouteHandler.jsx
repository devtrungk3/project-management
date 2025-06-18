import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './Login'
import Dashboard from './Dashboard'
import UserHome from './UserHome'
import useAuth from '../hooks/useAuth'

function RouteHandler() {
  const location = useLocation()
  const path = location.pathname

  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated && path !== '/login') {
    return <Navigate to="/login" />
  }
  
  if (isAuthenticated && userRole === 'USER') {
    if (['/', '/login', '/register'].includes(path) || path.startsWith('/dashboard')) {
      return <Navigate to="/user" />
    }
  }

  if (isAuthenticated && userRole === 'ADMIN') {
    if (['/', '/login', '/register'].includes(path) || path.startsWith('/user')) {
      return <Navigate to="/dashboard" />
    }
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/user" element={<UserHome />} />
      {/* fallback */}
      <Route path="*" element={<Navigate to={isAuthenticated ? (userRole === 'admin' ? '/dashboard' : '/user') : '/login'} />} />
    </Routes>
  )
}

export default RouteHandler