import { useState } from "react";
import { AuthAPI } from "../../api/api";
import "../../styles/auth.css";
import { Link, useNavigate } from "react-router-dom";
import { getRoleFromToken } from "../../utils/jwt";

export default function Login() {
    const nav = useNavigate();
    const [mode, setMode] = useState("email");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const payload = { password };
            if (mode === "email") payload.email = email.trim();
            else payload.mobile = mobile.trim();

            const { data } = await AuthAPI.login(payload);
            const token = typeof data === "string" ? data : data?.data || data?.token || data;
            if (!token) throw new Error("Invalid server response");
            localStorage.setItem("token", token);
            const role = getRoleFromToken();
            if (role === 'ADMIN') {
                nav("/admin");
            } else {
                nav("/dashboard");
            }
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrap">
            <div className="glass-card">
                <div className="panel-visual">
                    <div className="brand"><div className="logo" /><span>Microloan</span></div>
                    <div className="visual-hero">
                        <h1>Welcome back</h1>
                        <p>Access your loans, track EMIs, and manage documents securely.</p>
                    </div>
                </div>
                <div className="panel-form">
                    <h2 className="form-title">Sign in</h2>
                    <p className="form-sub">Use {mode === "email" ? "your email" : "your mobile number"} and password</p>

                    <div className="switcher">
                        <button className={mode === "email" ? "active" : ""} onClick={() => setMode("email")}>Email</button>
                        <button className={mode === "mobile" ? "active" : ""} onClick={() => setMode("mobile")}>Mobile</button>
                    </div>

                    <form onSubmit={submit}>
                        {mode === "email" ? (
                            <div className="input" style={{ marginBottom: 12 }}>
                                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                        ) : (
                            <div className="input" style={{ marginBottom: 12 }}>
                                    <input type="tel" placeholder="Mobile (10 digits)" value={mobile} onChange={(e) => setMobile(e.target.value)} required/>
                            </div>
                        )}
                        <div className="input">
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        {error && <div className="error">{error}</div>}
                        <button className="btn" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
                    </form>

                    <div className="link-row">
                        <Link to="/register">Don't have an account?</Link>
                        <Link to="/forgot-password">Forgot password?</Link>
                    </div>
                    <p className="note">You can browse public pages without login, but actions like applying for a loan require sign-in.</p>
                </div>
            </div>
        </div>
    );
}
