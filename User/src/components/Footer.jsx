import '../styles/Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3 className="footer-logo">Micro<span className="footer-logo-highlight">Loan</span></h3>
            <p className="footer-tagline">Financial support made easy</p>
            <div className="footer-social">
              <a href="#" className="social-icon">
                <i className="fa fa-facebook" aria-hidden="true"></i>
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="social-icon">
                <i className="fa fa-twitter" aria-hidden="true"></i>
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="social-icon">
                <i className="fa fa-instagram" aria-hidden="true"></i>
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="social-icon">
                <i className="fa fa-linkedin" aria-hidden="true"></i>
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-nav">
              <li><a href="/">Home</a></li>
              <li><a href="../pages/ApplyLoan.jsx">Apply for Loan</a></li>
              <li><a href="../pages/TrackStatus.jsx">Track Status</a></li>
              <li><a href="../pages/Login.jsx">Login</a></li>
              <li><a href="../pages/Register.jsx">Register</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-nav">
              <li><a href="#">How It Works</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4 className="footer-heading">Contact Us</h4>
            <address className="footer-address">
              <p>623 Street Ratibad</p>
              <p>Bhopal, Mp 462044</p>
              <p>Email: <a href="mailto:info@microloan.com">yashvinmaran@gmail.com</a></p>
              <p>Phone: <a href="tel:+919876543210">+91 7828000583</a></p>
            </address>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {currentYear} MicroLoan. All rights reserved.</p>
          </div>
          <div className="footer-legal">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;