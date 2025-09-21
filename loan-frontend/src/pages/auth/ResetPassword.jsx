import { useEffect, useState } from "react";
import { PublicAPI } from "../../api/api";
import "../../styles/auth.css";


export default function ResetPassword() {
    const [token, setToken] = useState("");
    const [valid, setValid] = useState(false);
    const [pass, setPass] = useState("");
    const [msg, setMsg] = useState("");


    useEffect(() => {
        const url = new URL(window.location.href);
        const t = url.searchParams.get("token");
        setToken(t || "");
        if (t) {
            PublicAPI.validateToken(t)
                .then((r) => setValid(!!r?.data?.success))
                .catch(() => setValid(false));
        }
    }, []);


    const submit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await PublicAPI.resetPassword({ token, newPassword: pass });
            setMsg(data?.message || "Password reset successfully");
        } catch (e1) {
            setMsg(e1?.response?.data?.message || e1.message || "Reset failed");
        }
    };


    if (!token) {
        return (
            <div className="auth-wrap"><div className="glass-card" style={{ gridTemplateColumns: "1fr" }}><div className="panel-form"><h2 className="form-title">Reset password</h2><div className="error">Invalid reset link.</div></div></div></div>
        );
    }


    if (!valid) {
        return (
            <div className="auth-wrap"><div className="glass-card" style={{ gridTemplateColumns: "1fr" }}><div className="panel-form"><h2 className="form-title">Reset password</h2><div className="error">Reset link expired or invalid.</div></div></div></div>
        );
    }


    return (
        <div className="auth-wrap">
            <div className="glass-card" style={{ gridTemplateColumns: "1fr" }}>
                <div className="panel-form">
                    <h2 className="form-title">Set a new password</h2>
                    <form onSubmit={submit}>
                        <div className="input">
                            <input type="password" placeholder="New password" value={pass} onChange={(e) => setPass(e.target.value)} required />
                        </div>
                        <button className="btn">Update password</button>
                    </form>
                    {msg && <div className="success" style={{ marginTop: 12 }}>{msg}</div>}
                </div>
            </div>
        </div>
    );
}

