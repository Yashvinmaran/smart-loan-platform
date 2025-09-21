import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTransactionsPanel from './AdminTransactionsPanel';
import '../../styles/admin.css';

export default function AdminTransactionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  return (
    <div className="admin-wrap">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="admin-header">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰ Menu</button>
          <h2>Transactions Management</h2>
        </header>
        <section className="dashboard-grid">
          <section className="panel transactions-panel">
            <AdminTransactionsPanel />
          </section>
        </section>
      </main>
    </div>
  );
}
