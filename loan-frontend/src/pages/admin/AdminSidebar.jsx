import React, { useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

export default function AdminSidebar({ isOpen = true, onToggle = () => {} }) {
    const nav = useNavigate();
    const location = useLocation();

    // Close sidebar on mobile when clicking outside or navigating
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 767) {
                onToggle(false);
            }
        };

        const handleClickOutside = (event) => {
            if (window.innerWidth <= 767 && isOpen) {
                const sidebar = document.querySelector('.admin-sidebar');
                const hamburger = document.querySelector('.hamburger');

                if (sidebar && !sidebar.contains(event.target) &&
                    hamburger && !hamburger.contains(event.target)) {
                    onToggle(false);
                }
            }
        };

        window.addEventListener('resize', handleResize);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onToggle]);

    const handleNavClick = () => {
        // Close sidebar on mobile when navigating
        if (window.innerWidth <= 767) {
            onToggle(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        nav('/login');
    };

    const menuItems = [
        { path: '/admin', label: 'Dashboard', icon: '📊' },
        { path: '/admin/loans', label: 'All Loans', icon: '💰' },
        { path: '/admin/loans/pending', label: 'Pending Loans', icon: '⏳' },
        { path: '/admin/loans/verified', label: 'Verified Loans', icon: '✅' },
        { path: '/admin/loans/new-verified', label: 'New Verified Loans', icon: '🆕' },
        { path: '/admin/loans/approved', label: 'Approved Loans', icon: '✓' },
        { path: '/admin/users', label: 'Users', icon: '👥' },
        { path: '/admin/documents', label: 'Documents', icon: '📄' },
        { path: '/admin/transactions', label: 'Transactions', icon: '💳' },
    ];

    return (
        <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="brand">
                <div className="brand-text">
                    <span className="brand-icon">🏦</span>
                    <span className="brand-name">MicroLoan Admin</span>
                </div>
                <button
                    onClick={onToggle}
                    className="close-btn"
                    aria-label="Close sidebar"
                    title="Close sidebar"
                >
                    ✕
                </button>
            </div>

            <nav>
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                end={item.path === '/admin'}
                                onClick={handleNavClick}
                                title={item.label}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-text">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <button
                    onClick={handleLogout}
                    className="btn-logout"
                    title="Logout"
                >
                    <span className="logout-icon">🚪</span>
                    <span className="logout-text">Logout</span>
                </button>
            </div>
        </aside>
    );
}
