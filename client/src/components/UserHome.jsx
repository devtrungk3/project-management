import { useEffect, useState } from 'react';
import api, { setAuthHandlers } from '../utils/axios';
import useAuth from '../hooks/useAuth';

const UserHome = () => {
  const [data, setData] = useState(null);
  const { logout, setAccessToken, setUserRole } = useAuth();

  useEffect(() => {
    setAuthHandlers({
      logout,
      updateAccessToken: setAccessToken,
      updateUserRole: setUserRole
    });

    const fetchData = async () => {
      try {
        const response = await api.get('user/ok');
        setData(response.data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>UserHome</h1>
      <p>{data?.message || 'Loading...'}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default UserHome;