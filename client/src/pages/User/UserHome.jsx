import { useEffect, useState } from 'react';
import api, { setAuthHandlers } from '../../utils/axios';
import HomePage from './HomePage';
import Projects from './Projects';
import useAuth from '../../hooks/useAuth';
import style from './UserHome.module.css';
import { Link, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import JoinRequests from './JoinRequests';
import { jwtDecode } from 'jwt-decode';
import Profile from './Profile';

function UserHome() {

  const location = useLocation();
  const isActive = (path) => location.pathname.endsWith(path);
  const [username, setUsername] = useState('');

  const { logout, setAccessToken, setUserRole, accessToken } = useAuth();
  useEffect(() => {
    setAuthHandlers({
      logout,
      updateAccessToken: setAccessToken,
      updateUserRole: setUserRole
    });
    setUsername(jwtDecode(accessToken)?.username || '')
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
            className={`nav-link ${style["nav-link"]} ${isActive('my-projects') || isActive('joined-projects') ? style.active : ''}`}
          >
            Projects
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
                {username}
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="userDropdown"
              >
                <li>
                  <a className="dropdown-item" href='/user/profile'>
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
          <Route path="/home" element={<HomePage api={api} />} />
          <Route path="/my-projects" element={<Projects api={api} isMyProject={true} />}/>
          <Route path="/joined-projects" element={<Projects api={api} isMyProject={false} />}/>
          <Route path="/join-requests" element={<JoinRequests api={api} />} />
          <Route path="/profile" element={<Profile api={api} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default UserHome;