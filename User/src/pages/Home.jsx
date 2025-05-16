import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [loanAmount, setLoanAmount] = useState(50000);
  const [loanTenure, setLoanTenure] = useState(12);
  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [interestRate, setInterestRate] = useState(2.0);

  useEffect(() => {
    updateInterestRate(loanTenure);
  }, [loanTenure]);

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, loanTenure, interestRate]);

  const updateInterestRate = (tenure) => {
    if (tenure <= 6) {
      setInterestRate(1.5);
    } else if (tenure > 6 && tenure <= 12) {
      setInterestRate(2.0);
    } else if (tenure > 12 && tenure <= 18) {
      setInterestRate(2.25);
    } else {
      setInterestRate(2.5);
    }
  };

  const calculateEMI = () => {
    const P = loanAmount;
    const r = interestRate / 100;
    const n = loanTenure;

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    const interest = total - P;

    setMonthlyEMI(Math.round(emi));
    setTotalInterest(Math.round(interest));
    setTotalPayment(Math.round(total));
  };

  return (
    <div className={styles.homeContainer}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Quick Microloans for Your Needs</h1>
          <p>Get funds from ₹5,000 to ₹2,00,000 with competitive rates and flexible repayment</p>
          <div className={styles.ctaButtons}>
            <Link to="/apply-loan" className={styles.primaryButton}>Apply Now</Link>
            <a href="https://www.cibil.com" className={styles.secondaryButton}>Check Eligibility</a>
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
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
              />
              <div className={styles.amountDisplay}>₹{loanAmount.toLocaleString()}</div>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="loanTenure">Tenure (Months)</label>
              <input
                type="range"
                id="loanTenure"
                min="6"
                max="24"
                step="1"
                value={loanTenure}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
              />
              <div className={styles.tenureDisplay}>{loanTenure} Months</div>
            </div>
          </div>
          <div className={styles.calculatorResult}>
            <div className={styles.resultItem}>
              <span>Monthly EMI:</span>
              <strong>₹{monthlyEMI.toLocaleString()}</strong>
            </div>
            <div className={styles.resultItem}>
              <span>Total Interest:</span>
              <strong>₹{totalInterest.toLocaleString()}</strong>
            </div>
            <div className={styles.resultItem}>
              <span>Total Payment:</span>
              <strong>₹{totalPayment.toLocaleString()}</strong>
            </div>
            <div className={styles.interestNote}>
              *Calculated at {interestRate}% monthly interest rate based on selected tenure
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
  );
}
