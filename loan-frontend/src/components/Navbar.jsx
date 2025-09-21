import { Link, useLocation } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaFileAlt, FaClipboardList, FaMoneyCheckAlt, FaTimes, FaHome } from "react-icons/fa";
import { getUserFromToken, logout } from "../utils/jwt";
import { useState } from "react";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const user = getUserFromToken();
    const location = useLocation();
    const toggleSlider = () => setOpen(!open);

    // Don't show navbar on landing page or auth pages
    if (location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register" ||
        location.pathname === "/forgot-password" || location.pathname === "/reset-password" ||
        location.pathname.startsWith("/admin")) {
        return null;
    }

    return (
        <nav className="user-navbar">
            <div className="navbar-content">
                <div className="navbar-brand">
                    <Link to="/" className="brand-link">
                        <FaHome /> Home
                    </Link>
                </div>

                <div className="navbar-links">
                    <Link to="/track-status" className={`nav-link ${location.pathname === "/track-status" ? "active" : ""}`}>
                        <FaClipboardList /> Track Status
                    </Link>
                    <Link to="/profile" className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}>
                        <FaFileAlt /> Profile
                    </Link>
                    <Link to="/apply-loan" className={`nav-link ${location.pathname === "/apply-loan" ? "active" : ""}`}>
                        <FaMoneyCheckAlt /> Apply Loan
                    </Link>
                    <Link to="/pending-emis" className={`nav-link ${location.pathname === "/pending-emis" ? "active" : ""}`}>
                        <FaMoneyCheckAlt /> Pending EMIs
                    </Link>
                </div>

                {user && (
                    <div className="profile-section">
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
                                <button onClick={() => { logout(); toggleSlider() }} className="slider-item logout-btn">
                                    <FaSignOutAlt /> Logout
                                </button>
                            </div>
                        </div>

                        {/* Overlay */}
                        {open && <div className="overlay" onClick={toggleSlider}></div>}
                    </div>
                )}
            </div>
        </nav>
    );
}
