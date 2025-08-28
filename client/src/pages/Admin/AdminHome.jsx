import { useEffect } from 'react';
import api, { setAuthHandlers } from '../../utils/axios';
import useAuth from '../../hooks/useAuth';
import style from './AdminHome.module.css';
import { Link, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';

const AdminHome = () => {

  const location = useLocation();
  const isActive = (path) => location.pathname.endsWith(path);

  const { logout, setAccessToken, setUserRole } = useAuth();
  useEffect(() => {
    setAuthHandlers({
      logout,
      updateAccessToken: setAccessToken,
      updateUserRole: setUserRole
    });
  }, []);
  return (
    <>
      <title>Admin home</title>
      <div className={`sidebar ${style.sidebar}`}>
        <nav className="nav flex-column">
          <Link
            to="/admin/dashboard"
            className={`nav-link ${style["nav-link"]} ${isActive('dashboard') ? style.active : ''}`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/users"
            className={`nav-link ${style["nav-link"]} ${isActive('users') ? style.active : ''}`}
          >
            User management
          </Link>
        </nav>
      </div>
      <nav className={`navbar ${style.navbar} navbar-light bg-light`}>
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Administrator
          </a>
          <div className="d-flex">
            <div className="dropdown ms-3">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                ADMIN
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="userDropdown"
              >
                <li>
                  <a className="dropdown-item" href=''>
                    Profile
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href='' onClick={logout}>
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <div className={`${style.content}`}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard api={api} />} />
          <Route path="/users" element={<UserManagement api={api} />}/>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default AdminHome;