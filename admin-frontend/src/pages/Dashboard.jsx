import { useState, useEffect } from 'react';
import { getLoans } from '../services/adminApi';
import '../styles/Dashboard.css';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const loans = await getLoans();
      const total = loans.length;
      const approved = loans.filter(loan => loan.status === 'APPROVED').length;
      const pending = loans.filter(loan => loan.status === 'PENDING').length;
      const rejected = loans.filter(loan => loan.status === 'REJECTED').length;
      setStats({ total, approved, pending, rejected });
      setError(null);
    } catch (err) {
      console.error('Failed to fetch loans:', err, { token: localStorage.getItem('adminToken') });
      setError('Failed to load loan statistics. Please try logging in again.');
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    } else {
      fetchStats();
    }
  }, [navigate]);
  

  return (
    <div className="dashboard">
      <h2>Loan Statistics</h2>
      {error && <p className="error">{error}</p>}
      <div className="stats">
        <div className="stat-card">
          <h3>Total Loans</h3>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Approved</h3>
          <p>{stats.approved}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p>{stats.pending}</p>
        </div>
        <div className="stat-card">
          <h3>Rejected</h3>
          <p>{stats.rejected}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;