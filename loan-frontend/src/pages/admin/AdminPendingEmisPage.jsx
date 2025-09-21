import React from 'react';
import AdminSidebar from './AdminSidebar';
import PendingEmis from '../PendingEmis';
import '../../styles/admin.css';

export default function AdminPendingEmisPage() {
  return (
    <div className="admin-wrap">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-header">
          <h2>Pending EMIs</h2>
        </header>
        <section className="dashboard-grid">
          <section className="panel pending-emis-panel">
            <PendingEmis />
          </section>
        </section>
      </main>
    </div>
  );
}
