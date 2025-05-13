import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getLoanStatus } from '../services/api'
import styles from '../styles/TrackStatus.module.css'

export default function TrackStatus() {
  const { id } = useParams()
  const [loan, setLoan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLoanStatus = async () => {
      try {
        const loanData = await getLoanStatus(id)
        setLoan(loanData)
      } catch (err) {
        setError(err.message || 'Failed to fetch loan status')
      } finally {
        setLoading(false)
      }
    }
    
    fetchLoanStatus()
  }, [id])

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return styles.statusApproved
      case 'rejected': return styles.statusRejected
      case 'pending': return styles.statusPending
      default: return styles.statusDefault
    }
  }

  if (loading) return <div className={styles.loading}>Loading...</div>
  if (error) return <div className={styles.error}>{error}</div>
  if (!loan) return <div className={styles.notFound}>Loan not found</div>

  return (
    <div className={styles.trackStatusContainer}>
      <h1>Loan Application Status</h1>
      
      <div className={styles.statusCard}>
        <div className={styles.statusHeader}>
          <h2>Application #{loan.id}</h2>
          <span className={`${styles.statusBadge} ${getStatusClass(loan.status)}`}>
            {loan.status}
          </span>
        </div>
        
        <div className={styles.statusDetails}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Loan Type:</span>
            <span className={styles.detailValue}>{loan.loanType}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Amount:</span>
            <span className={styles.detailValue}>₹{loan.amount.toLocaleString()}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Duration:</span>
            <span className={styles.detailValue}>{loan.duration} months</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Applied On:</span>
            <span className={styles.detailValue}>
              {new Date(loan.appliedDate).toLocaleDateString()}
            </span>
          </div>
          {loan.processedDate && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Processed On:</span>
              <span className={styles.detailValue}>
                {new Date(loan.processedDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
        
        {loan.comments && (
          <div className={styles.commentsSection}>
            <h3>Comments</h3>
            <p>{loan.comments}</p>
          </div>
        )}
        
        {loan.status === 'Approved' && (
          <div className={styles.nextSteps}>
            <h3>Next Steps</h3>
            <ol>
              <li>Sign the loan agreement document</li>
              <li>Complete KYC verification if pending</li>
              <li>Funds will be disbursed within 24 hours</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}