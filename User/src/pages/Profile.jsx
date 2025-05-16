import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserProfile, getCibilScore } from '../services/api'
import styles from '../styles/Profile.module.css'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [cibilScore, setCibilScore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'))
        if (!storedUser?.id) {
          navigate('/login')
          return
        }
        
        const [profileData, cibilData] = await Promise.all([
          getUserProfile(storedUser.id),
          getCibilScore(storedUser.id)
        ])
        
        setUser(profileData)
        setCibilScore(cibilData)
      } catch (err) {
        setError(err.message || 'Failed to load profile data')
        if (err.response?.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) return <div className={styles.loading}>Loading profile...</div>
  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.profileContainer}>
      <h1>My Profile</h1>
      
      <div className={styles.profileGrid}>
        <div className={styles.profileCard}>
          <h2>Personal Information</h2>
          
          <div className={styles.profileField}>
            <span className={styles.fieldLabel}>Full Name:</span>
            <span className={styles.fieldValue}>{user.fullName}</span>
          </div>
          
          <div className={styles.profileField}>
            <span className={styles.fieldLabel}>Email:</span>
            <span className={styles.fieldValue}>{user.email}</span>
          </div>
          
          <div className={styles.profileField}>
            <span className={styles.fieldLabel}>Mobile:</span>
            <span className={styles.fieldValue}>{user.mobile}</span>
          </div>
          
          <div className={styles.profileField}>
            <span className={styles.fieldLabel}>Address:</span>
            <span className={styles.fieldValue}>
              {user.address || 'Not provided'}
            </span>
          </div>
          
          <button 
            className={styles.editButton}
            onClick={() => navigate('/profile/edit')}>
            Edit Profile
          </button>
        </div>
        
        <div className={styles.cibilCard}>
          <h2>CIBIL Score</h2>
          
          <div className={styles.scoreContainer}>
            <div className={styles.scoreCircle}>
              <span className={styles.scoreValue}>{cibilScore.score}</span>
              <span className={styles.scoreLabel}>Score</span>
            </div>
            
            <div className={styles.scoreDetails}>
              <div className={styles.scoreDetail}>
                <span className={styles.detailLabel}>Last Updated:</span>
                <span className={styles.detailValue}>
                  {new Date(cibilScore.lastUpdated).toLocaleDateString()}
                </span>
              </div>
              
              <div className={styles.scoreDetail}>
                <span className={styles.detailLabel}>Status:</span>
                <span className={`${styles.detailValue} ${styles[cibilScore.status]}`}>
                  {cibilScore.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className={styles.scoreInfo}>
            <h3>What affects your score?</h3>
            <ul>
              <li>Payment history (35%)</li>
              <li>Credit utilization (30%)</li>
              <li>Credit history length (15%)</li>
              <li>Credit mix (10%)</li>
              <li>New credit (10%)</li>
            </ul>
          </div>
        </div>
      </div>
      
      <button 
        className={styles.logoutButton}
        onClick={handleLogout}>        Logout      </button></div>)}