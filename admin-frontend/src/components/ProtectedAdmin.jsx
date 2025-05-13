import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedAdmin({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    }
  }, [token, navigate]);

  return token ? children : null;
}

export default ProtectedAdmin;