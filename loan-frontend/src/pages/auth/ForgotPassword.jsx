import { useState } from "react";
import { PublicAPI } from "../../api/api";
import "../../styles/auth.css";


export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [msg, setMsg] = useState("");


    const submit = async (e) => {
        e.preventDefault();
        setMsg("");
        try {
            const { data } = await PublicAPI.forgotPassword(email);
            setSent(true);
            setMsg(data?.message || "Reset link sent to your email");
        } catch (e1) {
            setMsg(e1?.response?.data?.message || e1.message || "Failed to send reset link");
        }
    };


    return (
        <div className="auth-wrap">
            <div className="glass-card" style={{ gridTemplateColumns: "1fr" }}>
                <div className="panel-form">
                    <h2 className="form-title">Forgot password</h2>
                    <p className="form-sub">Enter your registered email to receive the reset link</p>
                    <form onSubmit={submit}>
                        <div className="input">
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <button className="btn">Send reset link</button>
                        <p>Remembered your password? <a href="/login" style={{ fontWeight: 600, textDecoration: "none" }}>LoginAgain</a></p>
                    </form>
                    {msg && <div className={sent ? "success" : "error"} style={{ marginTop: 12 }}>{msg}</div>}
                </div>
            </div>
        </div>
    );
}