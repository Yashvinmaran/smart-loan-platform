import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'
import styles from '../styles/Login.module.css'

export default function Login() {
  const [loginMethod, setLoginMethod] = useState('mobile')
  const [formData, setFormData] = useState({
    mobile: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    const newErrors = {}
    
    if (loginMethod === 'mobile' && !formData.mobile) {
      newErrors.mobile = 'Mobile number is required'
    } else if (loginMethod === 'email' && !formData.email) {
      newErrors.email = 'Email is required'
    } else if (loginMethod === 'email' && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    
    setIsSubmitting(true)
    try {
      const credentials = loginMethod === 'mobile' 
        ? { mobile: formData.mobile, password: formData.password }
        : { email: formData.email, password: formData.password }
      
      const { token, user } = await loginUser(credentials)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/profile')
    } catch (error) {
      setErrors({ api: error.message || 'Login failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2>Login to Your Account</h2>
        
        <div className={styles.toggleContainer}>
          <button
            className={`${styles.toggleButton} ${loginMethod === 'mobile' ? styles.active : ''}`}
            onClick={() => setLoginMethod('mobile')}
          >
            Mobile Login
          </button>
          <button
            className={`${styles.toggleButton} ${loginMethod === 'email' ? styles.active : ''}`}
            onClick={() => setLoginMethod('email')}
          >
            Email Login
          </button>
        </div>
        
        {errors.api && <div className={styles.apiError}>{errors.api}</div>}
        
        <form onSubmit={handleSubmit}>
          {loginMethod === 'mobile' ? (
            <div className={styles.formGroup}>
              <label htmlFor="mobile">Mobile Number</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter 10-digit mobile number"
                className={errors.mobile ? styles.errorInput : ''}
              />
              {errors.mobile && <span className={styles.errorText}>{errors.mobile}</span>}
            </div>
          ) : (
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? styles.errorInput : ''}
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>
          )}
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={errors.password ? styles.errorInput : ''}
            />
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className={styles.loginFooter}>
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </div>
    </div>
  )
}