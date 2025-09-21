import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminUsersPanel from './AdminUsersPanel';
import '../../styles/admin.css';

export default function AdminUsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  return (
    <div className="admin-wrap">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="admin-header">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰ Menu</button>
          <h2>Users Management</h2>
        </header>
        <section className="dashboard-grid">
          <section className="panel users-panel">
            <AdminUsersPanel />
          </section>
        </section>
      </main>
    </div>
  );
}
