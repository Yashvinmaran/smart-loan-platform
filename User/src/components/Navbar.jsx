import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/Navbar.module.css'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleProfileClick = (e) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const localUser = JSON.parse(localStorage.getItem('user'))
    if (user || localUser) {
      navigate('/profile')
    } else {
      navigate('/login')
    }
  }

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
          <Link to="/track-status" className={`${styles.navLink} ${location.pathname === '/track-status' ? styles.active : ''}`}>
            Track Status
          </Link>
          <a href="/profile"
            onClick={handleProfileClick}
            className={`${styles.navLink} ${location.pathname === '/profile' ? styles.active : ''}`}
          >
            Profile
          </a>
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
