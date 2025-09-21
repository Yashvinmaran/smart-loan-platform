import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { AdminAPI } from '../../api/api';
import '../../styles/admin.css';
import '../../styles/loan-status.css';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loansPage, setLoansPage] = useState({ content: [], totalElements: 0 });
  const [stats, setStats] = useState({ totalLoans: 0, approved: 0, pending: 0, rejected: 0, totalUsers: 0, pendingEmis: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    fetchDashboardStats();
    fetchLoans();
    fetchPendingEmis();
  }, []);

  async function fetchDashboardStats() {
    try {
      const res = await AdminAPI.getDashboardStats();
      const data = res.data?.data || res.data || {};

      // Map backend stats to frontend
      setStats(prev => ({
        ...prev,
        totalUsers: data.totalUsers || 0,
        totalLoans: data.totalLoans || 0,
        approved: data.approvedLoans || 0,
        pending: data.pendingApplications || 0,
        rejected: data.rejectedLoans || 0,
        totalAmount: data.totalLoanAmount || 0,
        totalDisbursed: data.totalDisbursed || 0,
        totalReceived: data.totalReceived || 0,
        totalEmis: data.totalEmis || 0,
        pendingEmis: data.pendingEmis || 0,
        paidEmis: data.paidEmis || 0,
        loansByMonth: data.loansByMonth || {},
        loanAmountsByStatus: data.loanAmountsByStatus || {},
        usersByRole: data.usersByRole || {}
      }));
    } catch (e) {
      console.error('Failed to fetch dashboard stats', e);
      // Fallback to old method
      fetchUsersCount();
    }
  }

  async function fetchLoans() {
    setLoading(true);
    try {
      const res = await AdminAPI.getLoans({ page: 0, size: 50 });
      const loans = res.data?.data?.content || res.data?.content || res.data || [];

      // compute stats from loans for chart
      let approved = 0, pending = 0, rejected = 0, verified = 0, newVerified = 0;
      const realLoans = Array.isArray(loans) ? loans : (loans.content || []);
      realLoans.forEach(l => {
        if (l.status === 'APPROVED') approved++;
        else if (l.status === 'PENDING') pending++;
        else if (l.status === 'REJECTED') rejected++;
        else if (l.status === 'VERIFIED') verified++;
        else if (l.status === 'NEW_VERIFIED') newVerified++;
      });

      setLoansPage({ content: realLoans, totalElements: realLoans.length });
      setStats(s => ({ ...s, approved, pending, rejected, verified, newVerified }));
    } catch (e) {
      console.error('Failed to fetch loans', e);
    } finally { setLoading(false) }
  }

  async function fetchPendingEmis() {
    try {
      const res = await AdminAPI.getPendingEmis();
      const emis = res.data?.data || res.data || [];
      setStats(s => ({ ...s, pendingEmis: emis.length }));
    } catch (e) { console.error(e); }
  }

  async function fetchUsersCount() {
    try {
      const res = await AdminAPI.getUsers({ page: 0, size: 1 });
      const totalUsers = res.data?.data?.totalElements || res.data?.totalElements || 0;
      setStats(s => ({ ...s, totalUsers }));
    } catch (e) {
      console.error('Failed to fetch users count', e);
      setStats(s => ({ ...s, totalUsers: 0 }));
    }
  }

  const pieData = [
    { name: 'Approved', value: stats.approved || 0 },
    { name: 'Pending', value: stats.pending || 0 },
    { name: 'Rejected', value: stats.rejected || 0 },
    { name: 'Verified', value: stats.verified || 0 },
    { name: 'New Verified', value: stats.newVerified || 0 },
  ].filter(item => item.value > 0); // Only show statuses with values

  const emiPieData = [
    { name: 'Paid', value: stats.paidEmis || 0 },
    { name: 'Pending', value: stats.pendingEmis || 0 },
  ].filter(item => item.value > 0);

  const loansByMonthData = Object.entries(stats.loansByMonth || {}).map(([month, count]) => ({
    month,
    count: count || 0
  }));

  const loanAmountsData = Object.entries(stats.loanAmountsByStatus || {}).map(([status, amount]) => ({
    status,
    amount: amount || 0
  }));

  const usersByRoleData = Object.entries(stats.usersByRole || {}).map(([role, count]) => ({
    name: role,
    value: count || 0
  })).filter(item => item.value > 0);

  const COLORS = ['#34D399', '#7C9CFF', '#EF4444', '#8B5CF6', '#06B6D4'];
  const EMI_COLORS = ['#10B981', '#F59E0B'];
  const ROLE_COLORS = ['#8B5CF6', '#06B6D4'];

  return (
    <div className="admin-wrap">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="admin-header">
          <div className="header-content">
            <div className="header-top">
              <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <span className="hamburger-icon">☰</span>
                <span className="hamburger-text">Menu</span>
              </button>
              <h2 className="page-title">Admin Dashboard</h2>
            </div>
            <div className="header-bottom">
              <button
                className="btn btn-logout-header"
                onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
                title="Logout"
              >
                <span className="logout-icon">🚪</span>
                <span className="logout-text">Logout</span>
              </button>
            </div>
          </div>
          <div className="summary-cards">
            <div className="card">
              <div className="card-title">Total Users</div>
              <div className="card-value">{stats.totalUsers || '—'}</div>
            </div>
            <div className="card">
              <div className="card-title">Total Loans</div>
              <div className="card-value">{stats.totalLoans}</div>
            </div>
            <div className="card">
              <div className="card-title">Pending EMIs</div>
              <div className="card-value">{stats.pendingEmis}</div>
            </div>
            <div className="card">
              <div className="card-title">Total Loan Amount (₹)</div>
              <div className="card-value">{stats.totalAmount.toLocaleString()}</div>
            </div>
            <div className="card">
              <div className="card-title">Total Disbursed (₹)</div>
              <div className="card-value">{(stats.totalDisbursed || 0).toLocaleString()}</div>
            </div>
            <div className="card">
              <div className="card-title">Total Received (₹)</div>
              <div className="card-value">{(stats.totalReceived || 0).toLocaleString()}</div>
            </div>
            <div className="card">
              <div className="card-title">Total EMIs</div>
              <div className="card-value">{stats.totalEmis}</div>
            </div>
            <div className="card">
              <div className="card-title">Paid EMIs</div>
              <div className="card-value">{stats.paidEmis}</div>
            </div>
          </div>
        </header>

        <section className="dashboard-grid">
          <aside className="panel stats-panel">
            <h4>Loan Status Overview</h4>
            <div className="pie-wrap">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="loan-status-stats">
              <div><span style={{ width: "14px", height: "14px", backgroundColor: COLORS[0], display: "inline-block", marginRight: "8px", borderRadius: "2px" }}></span>Approved: {stats.approved}</div>
              <div><span style={{ width: "14px", height: "14px", backgroundColor: COLORS[1], display: "inline-block", marginRight: "8px", borderRadius: "2px" }}></span>Pending: {stats.pending}</div>
              <div><span style={{ width: "14px", height: "14px", backgroundColor: COLORS[2], display: "inline-block", marginRight: "8px", borderRadius: "2px" }}></span>Rejected: {stats.rejected}</div>
              <div><span style={{ width: "14px", height: "14px", backgroundColor: COLORS[3], display: "inline-block", marginRight: "8px", borderRadius: "2px" }}></span>Verified: {stats.verified}</div>
              <div className="single-item"><span style={{ width: "14px", height: "14px", backgroundColor: COLORS[4], display: "inline-block", marginRight: "8px", borderRadius: "2px" }}></span>New Verified: {stats.newVerified}</div>
            </div>
          </aside>

          <aside className="panel stats-panel">
            <h4>EMI Status Overview</h4>
            <div className="pie-wrap">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={emiPieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>
                    {emiPieData.map((entry, index) => (
                      <Cell key={`emi-cell-${index}`} fill={EMI_COLORS[index % EMI_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="small-stats">
              <div><span style={{ width: "14px", height: "14px", backgroundColor: EMI_COLORS[0], display: "inline-block", marginRight: "8px", borderRadius: "2px" }}></span>Paid: {stats.paidEmis}</div>
              <div><span style={{ width: "14px", height: "14px", backgroundColor: EMI_COLORS[1], display: "inline-block", marginRight: "8px", borderRadius: "2px" }}></span>Pending: {stats.pendingEmis}</div>
            </div>
          </aside>

          <aside className="panel stats-panel">
            <h4>Users by Role</h4>
            <div className="pie-wrap">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={usersByRoleData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>
                    {usersByRoleData.map((entry, index) => (
                      <Cell key={`role-cell-${index}`} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="small-stats">
              {usersByRoleData.map((item, index) => (
                <div key={index}><span style={{ width: "14px", height: "14px", backgroundColor: ROLE_COLORS[index % ROLE_COLORS.length], display: "inline-block", marginRight: "8px", borderRadius: "2px" }}></span>{item.name}: {item.value}</div>
              ))}
            </div>
          </aside>

          <aside className="panel stats-panel">
            <h4>Loans by Month</h4>
            <div className="bar-wrap">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={loansByMonthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </aside>

          <aside className="panel stats-panel">
            <h4>Loan Amounts by Status</h4>
            <div className="bar-wrap">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={loanAmountsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                  <Legend />
                  <Bar dataKey="amount" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </aside>
        </section>

      </main>
    </div>
  );
}
