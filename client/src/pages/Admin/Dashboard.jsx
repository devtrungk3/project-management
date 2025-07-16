import { useEffect, useState } from 'react';
import api, { setAuthHandlers } from '../../utils/axios';
import useAuth from '../../hooks/useAuth';

const Dashboard = () => {
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
        const response = await api.get('admin/ok');
        setData(response.data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{data?.message || 'Loading...'}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;