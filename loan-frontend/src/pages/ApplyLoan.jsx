// src/pages/ApplyLoan.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { applyLoan, getUserProfile } from "@/api/api.js";
import { useToast } from "@/components/ui/use-toast.jsx";
import Navbar from "../components/Navbar";
import "../styles/applyloan.css";
import "../styles/navbar.css";

export default function ApplyLoan() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [form, setForm] = useState({
        amount: "",
        tenure: "",
        purpose: "",
        aadhar: "",
        pancard: "",
        document1: null,
        document2: null
    });
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profile = await getUserProfile();
                setUserData(profile.data);
                // Prefill aadhar and pancard from user data
                setForm(prev => ({
                    ...prev,
                    aadhar: profile.data.aadhar || "",
                    pancard: profile.data.pan || ""
                }));
            } catch (err) {
                toast({ title: "Error", description: "Failed to load user profile", variant: "destructive" });
            }
        };
        fetchUserProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setForm({ ...form, [name]: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("amount", form.amount);
            formData.append("tenure", form.tenure);
            formData.append("purpose", form.purpose);
            if (form.document1) formData.append("document1", form.document1);
            if (form.document2) formData.append("document2", form.document2);

            await applyLoan(formData);
            toast({ title: "Loan Applied ✅", description: "Your loan request is under review." });
            setForm({
                amount: "",
                tenure: "",
                purpose: "",
                aadhar: "",
                pancard: "",
                document1: null,
                document2: null
            });
        } catch (err) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        } finally {
            setLoading(false);
            navigate("/");
        }
    };

    return (
        <div className="apply-loan-container">
            <Navbar />
            <div className="apply-loan-card">
                <div className="apply-loan-header">
                    <h2>Apply for Loan</h2>
                    <form onSubmit={handleSubmit} className="apply-loan-form">
                        <div>
                            <label className="apply-loan-label">Loan Amount (₹)</label>
                            <input
                                type="number"
                                name="amount"
                                value={form.amount}
                                onChange={handleChange}
                                placeholder="Enter loan amount"
                                required
                                className="apply-loan-input"
                            />
                        </div>
                        <div>
                            <label className="apply-loan-label">Tenure (in months)</label>
                            <select name="tenure" id="tenure" value={form.tenure} onChange={handleChange} className="apply-loan-input" required>
                                <option value="">Select tenure</option>
                                <option value="6">6 months</option>
                                <option value="12">12 months</option>
                                <option value="18">18 months</option>
                                <option value="24">24 months</option>
                                <option value="30">30 months</option>
                                <option value="36">36 months</option>
                            </select>
                        </div>
                        <div className="full-width">
                            <label className="apply-loan-label">Purpose of Loan</label>
                            <input
                                type="text"
                                name="purpose"
                                value={form.purpose}
                                onChange={handleChange}
                                placeholder="e.g., Home renovation, Education, Business"
                                required
                                className="apply-loan-input"
                            />
                        </div>
                        <div>
                            <label className="apply-loan-label">Aadhar Number</label>
                            <input
                                type="text"
                                name="aadhar"
                                value={form.aadhar}
                                onChange={handleChange}
                                placeholder="Enter 12-digit Aadhar number"
                                required
                                className="apply-loan-input"
                            />
                        </div>
                        <div>
                            <label className="apply-loan-label">PAN Card Number</label>
                            <input
                                type="text"
                                name="pancard"
                                value={form.pancard}
                                onChange={handleChange}
                                placeholder="Enter PAN card number"
                                required
                                className="apply-loan-input"
                            />
                        </div>
                        <div className="full-width">
                            <h3 className="apply-loan-label" style={{ marginBottom: '1rem' }}>Document Uploads</h3>
                            <div className="apply-loan-form">
                                <div>
                                    <label className="apply-loan-label">Aadhar Document</label>
                                    <input
                                        type="file"
                                        name="document1"
                                        onChange={handleChange}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        required
                                        className="apply-loan-file"
                                    />
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>Upload PDF or image (max 5MB)</p>
                                </div>
                                <div>
                                    <label className="apply-loan-label">PAN Card Document</label>
                                    <input
                                        type="file"
                                        name="document2"
                                        onChange={handleChange}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        required
                                        className="apply-loan-file"
                                    />
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>Upload PDF or image (max 5MB)</p>
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="apply-loan-submit"
                            disabled={loading}
                        >
                            {loading ? "Submitting Application..." : "Apply for Loan"}
                        </button>
                    </form>
                    <button
                        onClick={() => navigate("/")}
                        style={{ marginTop: '1rem', padding: '0.8rem 2rem', borderRadius: '12px', background: '#00ff40ff', color: '#000', fontWeight: 600, textDecoration: 'none', transition: '0.3s' }}
                    >Go Home</button>
                </div>
            </div>
        </div>
    );
}
