// src/pages/LandingPage.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaFileAlt, FaClipboardList, FaMoneyCheckAlt, FaTimes } from "react-icons/fa"
import { getUserFromToken, logout } from "../utils/jwt";
import "../styles/landing.css";

export default function LandingPage() {
    const [loan, setLoan] = useState(100000);
    const [rate, setRate] = useState(10);
    const [tenure, setTenure] = useState(12);
    const [open, setOpen] = useState(false);
    const user = getUserFromToken();
    const toggleSlider = () => setOpen(!open);

    // EMI Calculation formula
    const calculateEMI = () => {
        const principal = loan;
        const monthlyRate = rate / 12 / 100;
        const emi =
            (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
            (Math.pow(1 + monthlyRate, tenure) - 1);
        return emi ? emi.toFixed(2) : 0;
    };

    return (
        <div className="landing-container">
            {/* Navbar */}
            <nav className="navbar">
                <div className="logo">💰 LoanEase</div>

                <ul className="nav-links">
                    <li><a href="#process">Process</a></li>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#calculator">Calculator</a></li>
                    <li><a href="#info">Info</a></li>

                    {!user ? (
                        <>
                            <li><Link to="/login" className="login-btn">Login</Link></li>
                            <li><Link to="/register" className="register-btn">Register</Link></li>
                        </>
                    ) : (
                        <li className="profile-section">
                            {/* Trigger Icon */}
                            <div className="profile-icon" onClick={toggleSlider}>
                                <FaUserCircle size={32} />
                            </div>

                            {/* Profile Slider */}
                            <div className={`profile-slider ${open ? "open" : ""}`}>
                                <div className="slider-header">
                                    <button className="close-btn" onClick={toggleSlider}>
                                        <FaTimes size={22} />
                                    </button>
                                    <FaUserCircle size={50} />
                                    <h3>{user.name || "User"}</h3>
                                </div>

                                <div className="slider-links">
                                    <Link to="/track-status" className="slider-item" onClick={toggleSlider}>
                                        <FaClipboardList /> Track Status
                                    </Link>
                                    <Link to="/profile" className="slider-item" onClick={toggleSlider}>
                                        <FaFileAlt /> Show Profile
                                    </Link>
                                    <Link to="/apply-loan" className="slider-item" onClick={toggleSlider}>
                                        <FaMoneyCheckAlt /> Apply for Loan
                                    </Link>
                                    <Link to="/pending-emis" className="slider-item" onClick={toggleSlider}>
                                        <FaMoneyCheckAlt /> Pending EMIs
                                    </Link>
                                    <button onClick={() => { logout(); toggleSlider() }} className="slider-item" style={{ color: "blue" }}>
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </div>
                            </div>

                            {/* Overlay */}
                            {open && <div className="overlay" onClick={toggleSlider}></div>}
                        </li>
                    )}
                </ul>
            </nav>

            {/* Hero Section */}
            <motion.section
                className="hero"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <h1>Smart, Fast & Secure Microloans</h1>
                <p>Apply online, track status, and repay easily with flexible EMIs.</p>
                <Link to="/apply-loan" className="cta-btn">Apply Now</Link>
            </motion.section>

            {/* Our Process */}
            <section id="process" className="process">
                <h2>How Our Loan Process Works</h2>
                <div className="process-steps">
                    <div className="step">📝 Apply Online<br />Fill out a simple application form.</div>
                    <div className="step">📊 Verification<br />We check your eligibility & CIBIL score.</div>
                    <div className="step">✅ Approval<br />Instant approval within minutes.</div>
                    <div className="step">💸 Disbursal<br />Loan credited directly to your bank.</div>
                    <div className="step">📅 Easy EMI<br />Repay with flexible monthly installments.</div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="features">
                <h2>Why Choose LoanEase?</h2>
                <div className="feature-grid">
                    <motion.div className="feature-card" whileHover={{ scale: 1.05 }}>
                        <h3>⚡ Instant Approval</h3>
                        <p>Get loans approved in minutes without heavy paperwork.</p>
                    </motion.div>
                    <motion.div className="feature-card" whileHover={{ scale: 1.05 }}>
                        <h3>📊 EMI Tracking</h3>
                        <p>Track your EMI status & repayment schedule in real time.</p>
                    </motion.div>
                    <motion.div className="feature-card" whileHover={{ scale: 1.05 }}>
                        <h3>🔒 Secure</h3>
                        <p>Your data is protected with advanced encryption.</p>
                    </motion.div>
                    <motion.div className="feature-card" whileHover={{ scale: 1.05 }}>
                        <h3>💳 Flexible Loans</h3>
                        <p>Choose tenure and interest rates that suit your needs.</p>
                    </motion.div>
                </div>
            </section>

            {/* Loan Calculator */}
            <section id="calculator" className="calculator">
                <h2>Loan EMI Calculator</h2>
                <div className="calc-box">
                    <label>Loan Amount (₹)</label>
                    <input type="number" value={loan} onChange={e => setLoan(e.target.value)} />

                    <label>Interest Rate (%)</label>
                    <input type="number" value={rate} onChange={e => setRate(e.target.value)} />

                    <label>Tenure (Months)</label>
                    <input type="number" value={tenure} onChange={e => setTenure(e.target.value)} />

                    <div className="emi-result">Your EMI: <strong>₹{calculateEMI()}</strong> / month</div>
                </div>
            </section>

            {/* Loan Info Section */}
            <section id="info" className="info">
                <h2>Loan Information</h2>
                <div className="info-grid">
                    <div>
                        <h3>Eligibility</h3>
                        <p>✔ Indian citizen<br />✔ Age 21 - 60 years<br />✔ Regular income source</p>
                    </div>
                    <div>
                        <h3>Required Documents</h3>
                        <p>✔ Aadhaar / PAN<br />✔ Salary slips / Bank statements<br />✔ Address proof</p>
                    </div>
                    <div>
                        <h3>Interest Rates</h3>
                        <p>Starting at just 10% p.a. with flexible repayment options.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div>
                        <h3>LoanEase</h3>
                        <p>Making microloans simple, fast, and secure for everyone.</p>
                    </div>
                    <div>
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="#process">Process</a></li>
                            <li><a href="#features">Features</a></li>
                            <li><a href="#calculator">Calculator</a></li>
                            <li><a href="#info">Loan Info</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3>Contact</h3>
                        <p>Email: yashvinmaran4@gmail.com</p>
                        <p>Phone: +91 7828000583</p>
                        <div className="socials">
                            <a href="#">🌐</a>
                            <a href="#">🐦</a>
                            <a href="#">📘</a>
                            <a href="#">📸</a>
                        </div>
                    </div>
                </div>
                <p className="copy">© {new Date().getFullYear()} LoanEase. All rights reserved.</p>
            </footer>
        </div>
    );
}
