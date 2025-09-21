import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminLoansPanel from './AdminLoansPanel';
import { AdminAPI } from '../../api/api';
import '../../styles/admin.css';

export default function AdminApprovedLoansPage() {
  const [loansPage, setLoansPage] = useState({ content: [], totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    fetchLoans();
  }, []);

  async function fetchLoans() {
    setLoading(true);
    try {
      const res = await AdminAPI.getLoans({ page: 0, size: 50, status: 'APPROVED' });
      const loans = res.data?.data?.content || res.data?.content || res.data || [];
      const realLoans = Array.isArray(loans) ? loans : (loans.content || []);
      setLoansPage({ content: realLoans, totalElements: realLoans.length });
    } catch (e) {
      console.error('Failed to fetch approved loans', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-wrap">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="admin-header">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰ Menu</button>
          <h2>Approved Loan Applications</h2>
        </header>
        <section className="dashboard-grid">
          <section className="panel loans-panel">
            <AdminLoansPanel loans={loansPage.content} refresh={fetchLoans} loading={loading} />
            <button
              onClick={async () => {
                // Example disbursement call for the first loan
                if (loansPage.content.length > 0) {
                  const loan = loansPage.content[0];
                  try {
                    const response = await fetch(`/api/payments/loan/disburse/${loan.id}/user/${loan.user.id}?amount=${loan.amount}`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                    });
                    if (!response.ok) throw new Error("Loan disbursement failed");
                    alert("Loan disbursed successfully");
                  } catch (err) {
                    alert("Error disbursing loan: " + err.message);
                  }
                }
              }}
            >
              Disburse First Loan (Example)
            </button>
          </section>
        </section>
      </main>
    </div>
  );
}
