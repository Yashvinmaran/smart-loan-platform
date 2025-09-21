import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ProtectedRoute from "./routes/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLoansPage from "./pages/admin/AdminLoansPage";
import AdminPendingLoansPage from "./pages/admin/AdminPendingLoansPage";
import AdminVerifiedLoansPage from "./pages/admin/AdminVerifiedLoansPage";
import AdminNewVerifiedLoansPage from "./pages/admin/AdminNewVerifiedLoansPage";
import AdminApprovedLoansPage from "./pages/admin/AdminApprovedLoansPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminDocumentsPage from "./pages/admin/AdminDocumentsPage";
import AdminTransactionsPage from "./pages/admin/AdminTransactionsPage";
import AdminPendingEmisPage from "./pages/admin/AdminPendingEmisPage";
import TrackLoanStatus from "./pages/TrackLoanStatus";
import Profile from "./pages/Profile";
import ApplyLoan from "./pages/ApplyLoan";
import PendingEmis from "./pages/PendingEmis";
import { getUserFromToken, isAuthenticated } from "./utils/jwt";



function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const userData = getUserFromToken();
        setUser(userData);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/pending-emis" element={<PendingEmis />} />

      {/* Protected user routes */}
      <Route element={<ProtectedRoute />}>
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/track-status" element={<TrackLoanStatus />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/apply-loan" element={<ApplyLoan />} />
      </Route>

      {/* Admin-only routes */}
      <Route element={<ProtectedRoute requireAdmin />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/loans" element={<AdminLoansPage />} />
        <Route path="/admin/loans/pending" element={<AdminPendingLoansPage />} />
        <Route path="/admin/loans/verified" element={<AdminVerifiedLoansPage />} />
        <Route path="/admin/loans/new-verified" element={<AdminNewVerifiedLoansPage />} />
        <Route path="/admin/loans/approved" element={<AdminApprovedLoansPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/documents" element={<AdminDocumentsPage />} />
        <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
        <Route path="/admin/pending-emis" element={<AdminPendingEmisPage />} />
        {/* Backward compatibility redirect */}
        <Route path="/admin-dashboard" element={<Navigate to="/admin" replace />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
