import { useState } from "react";
import { AuthAPI } from "../../api/api";
import "../../styles/auth.css";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const nav = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        pan: "",
        aadhar: "",
        cibilScore: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));


    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { data } = await AuthAPI.register(form);
            const token = typeof data === "string" ? data : data?.data || data?.token || data;
            if (!token) throw new Error("Invalid server response");
            localStorage.setItem("token", token);
            nav("/login");
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Registration failed");
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
                        <h1>Create your account</h1>
                        <p>Apply for loans, upload KYC documents and track EMIs in one place.</p>
                    </div>
                </div>
                <div className="panel-form">
                    <h2 className="form-title">Register</h2>
                    <p className="form-sub">It only takes a minute</p>


                    <form onSubmit={submit}>
                        <div className="input" style={{ marginBottom: 12 }}>
                            <input name="name" placeholder="Full name" value={form.name} onChange={onChange} required />
                        </div>
                        <div className="row">
                            <div className="input">
                                <input type="email" name="email" placeholder="Email" value={form.email} onChange={onChange} required />
                            </div>
                            <div className="input">
                                <input type="tel" name="mobile" placeholder="Mobile (10 digits)" value={form.mobile} onChange={onChange} required />
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: 12 }}>
                            <div className="input">
                                <input type="password" name="password" placeholder="Password (min 6 chars)" value={form.password} onChange={onChange} required />
                            </div>
                            <div className="input">
                                <input name="pan" placeholder="PAN" value={form.pan} onChange={onChange} required />
                            </div>
                        </div>
                        <div className="input" style={{ marginTop: 12 }}>
                            <input name="aadhar" placeholder="Aadhar" value={form.aadhar} onChange={onChange} required />
                        </div>
                        <div className="input" style={{ marginTop: 12 }}>
                            <input name="cibilScore" placeholder="CIBIL Score" value={form.cibilScore} onChange={onChange} required />
                        </div>


                        {error && <div className="error">{error}</div>}
                        <button className="btn" disabled={loading}>{loading ? "Creating account…" : "Create account"}</button>
                    </form>


                    <div className="link-row">
                        <Link to="/login">Already have an account?</Link>
                        <span />
                    </div>
                    <p className="note">By creating an account, you agree to our Terms & Privacy Policy.</p>
                </div>
            </div>
        </div>
    );
}