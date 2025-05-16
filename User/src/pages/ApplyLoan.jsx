import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { applyForLoan } from '../services/api'
import styles from '../styles/ApplyLoan.module.css'

export default function ApplyLoan() {
  const [formData, setFormData] = useState({
    loanType: 'personal',
    amount: '',
    duration: 6,
    purpose: ''
  })
  const [documents, setDocuments] = useState({
    aadhar: null,
    pan: null,
    incomeProof: null
  })
  const [previews, setPreviews] = useState({
    aadhar: null,
    pan: null,
    incomeProof: null
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (files && files[0]) {
      setDocuments(prev => ({ ...prev, [name]: files[0] }))
      
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreviews(prev => ({ ...prev, [name]: event.target.result }))
      }
      reader.readAsDataURL(files[0])
    }
  }

  const validate = () => {
    const newErrors = {}
    
    if (!formData.amount || isNaN(formData.amount)) {
      newErrors.amount = 'Please enter a valid amount'
    } else if (parseFloat(formData.amount) < 5000) {
      newErrors.amount = 'Minimum loan amount is ₹5,000'
    } else if (parseFloat(formData.amount) > 100000) {
      newErrors.amount = 'Maximum loan amount is ₹1,00,000'
    }
    
    if (!documents.aadhar) newErrors.aadhar = 'Aadhar card is required'
    if (!documents.pan) newErrors.pan = 'PAN card is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    
    setIsSubmitting(true)
    try {
      const formPayload = new FormData()
      formPayload.append('loanType', formData.loanType)
      formPayload.append('amount', formData.amount)
      formPayload.append('duration', formData.duration)
      formPayload.append('purpose', formData.purpose)
      formPayload.append('aadhar', documents.aadhar)
      formPayload.append('pan', documents.pan)
      if (documents.incomeProof) formPayload.append('incomeProof', documents.incomeProof)
      
      const { loanId } = await applyForLoan(formPayload)
      navigate(`/track-status/${loanId}`)
    } catch (error) {
      setErrors({ api: error.message || 'Application failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.applyLoanContainer}>
      <h1>Apply for a Microloan</h1>
      
      <div className={styles.loanFormContainer}>
        {errors.api && <div className={styles.apiError}>{errors.api}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <h2>Loan Details</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="loanType">Loan Type</label>
              <select
                id="loanType"
                name="loanType"
                value={formData.loanType}
                onChange={handleChange}
              >
                <option value="personal">Personal Loan</option>
                <option value="business">Business Loan</option>
                <option value="education">Education Loan</option>
                <option value="medical">Medical Loan</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="amount">Loan Amount (₹)</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount between 5,000 - 1,00,000"
                className={errors.amount ? styles.errorInput : ''}
                min="5000"
                max="100000"
              />
              {errors.amount && <span className={styles.errorText}>{errors.amount}</span>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="duration">Repayment Duration (months)</label>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
              >
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                <option value="18">18 Months</option>
                <option value="24">24 Months</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="purpose">Purpose of Loan</label>
              <textarea
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="Briefly describe why you need this loan"
                rows="3"
              ></textarea>
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h2>Document Upload</h2>
            <p className={styles.sectionNote}>Please upload clear scans of your documents</p>
            
            <div className={styles.documentGrid}>
              <div className={styles.documentItem}>
                <label htmlFor="aadhar">Aadhar Card*</label>
                <input
                  type="file"
                  id="aadhar"
                  name="aadhar"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className={errors.aadhar ? styles.errorInput : ''}
                />
                {errors.aadhar && <span className={styles.errorText}>{errors.aadhar}</span>}
                {previews.aadhar && (
                  <div className={styles.previewContainer}>
                    <p>Preview:</p>
                    {previews.aadhar.includes('application/pdf') ? (
                      <embed src={previews.aadhar} width="100%" height="200" type="application/pdf" />
                    ) : (
                      <img src={previews.aadhar} alt="Aadhar preview" className={styles.previewImage} />
                    )}
                  </div>
                )}
              </div>
              
              <div className={styles.documentItem}>
                <label htmlFor="pan">PAN Card*</label>
                <input
                  type="file"
                  id="pan"
                  name="pan"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className={errors.pan ? styles.errorInput : ''}
                />
                {errors.pan && <span className={styles.errorText}>{errors.pan}</span>}
                {previews.pan && (
                  <div className={styles.previewContainer}>
                    <p>Preview:</p>
                    {previews.pan.includes('application/pdf') ? (
                      <embed src={previews.pan} width="100%" height="200" type="application/pdf" />
                    ) : (
                      <img src={previews.pan} alt="PAN preview" className={styles.previewImage} />
                    )}
                  </div>
                )}
              </div>
              
              <div className={styles.documentItem}>
                <label htmlFor="incomeProof">Income Proof (Optional)</label>
                <input
                  type="file"
                  id="incomeProof"
                  name="incomeProof"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                />
                {previews.incomeProof && (
                  <div className={styles.previewContainer}>
                    <p>Preview:</p>
                    {previews.incomeProof.includes('application/pdf') ? (
                      <embed src={previews.incomeProof} width="100%" height="200" type="application/pdf" />
                    ) : (
                      <img src={previews.incomeProof} alt="Income proof preview" className={styles.previewImage} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Apply for Loan'}
          </button>
        </form>
      </div>
    </div>
  )
}