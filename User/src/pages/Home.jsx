import { Link } from 'react-router-dom'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Quick Microloans for Your Needs</h1>
          <p>Get funds from ₹5,000 to ₹2,00,000 with competitive rates and flexible repayment</p>
          <div className={styles.ctaButtons}>
            <Link to="/apply-loan" className={styles.primaryButton}>Apply Now</Link>
            <Link to="/login" className={styles.secondaryButton}>Check Eligibility</Link>
          </div>
        </div>
        <div className={styles.heroImage}></div>
      </section>

      <section className={styles.loanDetails}>
        <h2>Loan Details</h2>
        <div className={styles.detailsGrid}>
          <div className={styles.detailCard}>
            <h3>Loan Amount</h3>
            <div className={styles.detailValue}>₹5,000 - ₹2,00,000</div>
            <p>Flexible amounts tailored to your needs</p>
          </div>
          <div className={styles.detailCard}>
            <h3>Interest Rates</h3>
            <div className={styles.detailValue}>1.5% - 2.5% per month</div>
            <p>(18% - 30% per annum)</p>
          </div>
          <div className={styles.detailCard}>
            <h3>CIBIL Requirement</h3>
            <div className={styles.detailValue}>650+ Score</div>
            <p>Minimum credit score needed</p>
          </div>
          <div className={styles.detailCard}>
            <h3>Repayment Period</h3>
            <div className={styles.detailValue}>6 - 24 Months</div>
            <p>Flexible tenure options</p>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <h2>Why Choose Our Microloans?</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>Quick Approval</h3>
            <p>Get approval within 24 hours with minimal documentation</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💳</div>
            <h3>No Collateral</h3>
            <p>Unsecured loans without any property mortgage</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔄</div>
            <h3>Flexible Repayment</h3>
            <p>Choose EMI dates that match your salary cycle</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📈</div>
            <h3>Improve CIBIL</h3>
            <p>Timely repayments help build your credit score</p>
          </div>
        </div>
      </section>

      <section className={styles.interestCalculator}>
        <h2>EMI Calculator</h2>
        <div className={styles.calculatorContainer}>
          <div className={styles.calculatorInputs}>
            <div className={styles.inputGroup}>
              <label htmlFor="loanAmount">Loan Amount (₹)</label>
              <input 
                type="range" 
                id="loanAmount" 
                min="5000" 
                max="200000" 
                step="5000" 
                defaultValue="50000"
              />
              <div className={styles.amountDisplay}>₹50,000</div>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="loanTenure">Tenure (Months)</label>
              <input 
                type="range" 
                id="loanTenure" 
                min="6" 
                max="24" 
                step="1" 
                defaultValue="12"
              />
              <div className={styles.tenureDisplay}>12 Months</div>
            </div>
          </div>
          <div className={styles.calculatorResult}>
            <div className={styles.resultItem}>
              <span>Monthly EMI:</span>
              <strong>₹4,545</strong>
            </div>
            <div className={styles.resultItem}>
              <span>Total Interest:</span>
              <strong>₹4,540</strong>
            </div>
            <div className={styles.resultItem}>
              <span>Total Payment:</span>
              <strong>₹54,540</strong>
            </div>
            <div className={styles.interestNote}>
              *Calculated at 1.5% monthly interest rate
            </div>
          </div>
        </div>
      </section>

      <section className={styles.howItWorks}>
        <h2>Simple 4-Step Process</h2>
        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Register</h3>
            <p>Complete your profile in minutes</p>
          </div>
          <div className={styles.stepArrow}>→</div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Verify</h3>
            <p>Upload documents for quick verification</p>
          </div>
          <div className={styles.stepArrow}>→</div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Get Approved</h3>
            <p>Instant approval decision</p>
          </div>
          <div className={styles.stepArrow}>→</div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <h3>Receive Funds</h3>
            <p>Amount transferred to your account</p>
          </div>
        </div>
      </section>

      <section className={styles.faq}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqGrid}>
          <div className={styles.faqItem}>
            <h3>What is the minimum CIBIL score required?</h3>
            <p>We require a minimum CIBIL score of 650. However, we consider applications with lower scores on case-by-case basis with additional documentation.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>How long does approval take?</h3>
            <p>Most applications are approved within 24 hours of document submission. Complete disbursal happens within 48 hours of approval.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>What documents are required?</h3>
            <p>You need Aadhar, PAN, and income proof (salary slips or bank statements). Self-employed individuals need additional business proof.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>Can I prepay my loan?</h3>
            <p>Yes, you can prepay after 3 EMIs with just 2% foreclosure charges on remaining principal.</p>
          </div>
        </div>
      </section>
    </div>
  )
}