import { Component } from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/ErrorBoundary.module.css'

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorBoundary}>
          <h1>Something went wrong</h1>
          <p className={styles.errorMessage}>
            {this.state.error.message || 'An unexpected error occurred'}
          </p>
          <p>Please try refreshing the page or contact support if the problem persists.</p>
          <Link to="/" className={styles.homeLink}>
            Return to Home
          </Link>
        </div>
      )
    }
    
    return this.props.children
  }
}