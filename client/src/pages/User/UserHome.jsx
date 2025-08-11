import { useEffect } from 'react';
import api, { setAuthHandlers } from '../../utils/axios';
import HomePage from './HomePage';
import MyProjects from './MyProjects';
import useAuth from '../../hooks/useAuth';
import style from './UserHome.module.css';
import { Link, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import JoinRequests from './JoinRequests';

function UserHome() {

  const location = useLocation();
  const isActive = (path) => {
    if (path === 'home' && (location.pathname === "/user" || location.pathname === "/user/")) return true;
    return location.pathname.endsWith(path);
  }

  const { logout, setAccessToken, setUserRole } = useAuth();
  useEffect(() => {
    setAuthHandlers({
      logout,
      updateAccessToken: setAccessToken,
      updateUserRole: setUserRole
    });

    (async () => {
      try {
        await api.get('user/ok');
      } catch (error) {
        console.error('Fetch error:', error);
      }
    })();
  }, []);
  return (
    <>
      <title>User home</title>
      <div className={`sidebar ${style.sidebar}`}>
        <nav className="nav flex-column">
          <Link
            to="/user/home"
            className={`nav-link ${style["nav-link"]} ${isActive('home') ? style.active : ''}`}
          >
            Home
          </Link>
          <Link
            to="/user/my-projects"
            className={`nav-link ${style["nav-link"]} ${isActive('my-projects') ? style.active : ''}`}
          >
            My projects
          </Link>
          <Link
            to="/user/join-requests"
            className={`nav-link ${style["nav-link"]} ${isActive('join-requests') ? style.active : ''}`}
          >
            Join requests
          </Link>
        </nav>
      </div>
      <nav className={`navbar ${style.navbar} navbar-light bg-light`}>
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Project management
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
                John Doe
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
          <Route path="/" element={<HomePage api={api} />} />
          <Route path="/home" element={<HomePage api={api} />} />
          <Route path="/my-projects" element={<MyProjects api={api} />}/>
          <Route path="/join-requests" element={<JoinRequests api={api} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default UserHome;