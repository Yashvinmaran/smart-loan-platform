import { Navigate, Outlet } from "react-router-dom";
import { getRoleFromToken, isAuthenticated } from "../utils/jwt";
import { useEffect, useState } from "react";
import api from "../api/api";


export default function ProtectedRoute({ requireAdmin = false }) {
    const authed = isAuthenticated();
    const [adminOk, setAdminOk] = useState(!requireAdmin);
    const [checking, setChecking] = useState(requireAdmin);


    useEffect(() => {
        let mounted = true;
        async function checkAdmin() {
            if (!requireAdmin) return;
            try {
                // If role claim exists and says ADMIN, allow directly
                const role = getRoleFromToken();
                if (role === "ADMIN") {
                    if (mounted) setAdminOk(true);
                    return;
                }
                // else: soft probe an admin endpoint; backend will 403 if not admin
                await api.get("/api/admin/pending-emis");
                if (mounted) setAdminOk(true);
            } catch (e) {
                if (mounted) setAdminOk(false);
            } finally {
                if (mounted) setChecking(false);
            }
        }
        if (requireAdmin) checkAdmin();
        return () => {
            mounted = false;
        };
    }, [requireAdmin]);


    if (!authed) return <Navigate to="/login" replace />;
    if (checking) return <div className="route-check">Checking access…</div>;
    if (requireAdmin && !adminOk) return <Navigate to="/" replace />;
    return <Outlet />;
}