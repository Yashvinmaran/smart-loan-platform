import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import styles from '../styles/Navbar.module.css'

export default function Navbar() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.logo}>
          MicroLoan<span>Pro</span>
        </Link>
        
        <div 
          className={`${styles.navLinks} ${mobileMenuOpen ? styles.showMenu : ''}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <Link 
            to="/" 
            className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/apply-loan" 
            className={`${styles.navLink} ${location.pathname === '/apply-loan' ? styles.active : ''}`}
          >
            Apply Loan
          </Link>
          <Link 
            to="/track-status" 
            className={`${styles.navLink} ${location.pathname === '/track-status' ? styles.active : ''}`}
          >
            Track Status
          </Link>
          <Link 
            to="/login" 
            className={`${styles.navLink} ${location.pathname === '/login' ? styles.active : ''}`}
          >
            Login
          </Link>
        </div>
        
        <button 
          className={styles.mobileMenuButton}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  )
}