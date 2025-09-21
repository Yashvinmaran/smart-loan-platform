import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminDocumentsPanel from './AdminDocumentsPanel';
import '../../styles/admin.css';

export default function AdminDocumentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  return (
    <div className="admin-wrap">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="admin-header">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰ Menu</button>
          <h2>Documents Management</h2>
        </header>
        <section className="dashboard-grid">
          <section className="panel docs-panel">
            <AdminDocumentsPanel />
          </section>
        </section>
      </main>
    </div>
  );
}
