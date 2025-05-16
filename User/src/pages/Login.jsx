import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser, getCurrentUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Login.module.css';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/profile';

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const credentials = {
        email: formData.email.trim(),
        password: formData.password
      };
      const token = await loginUser(credentials);
      const user = await getCurrentUser(credentials.email, token.jwtToken || token);

      // Save to localStorage (if not handled by AuthContext)
      localStorage.setItem('token', token.jwtToken || token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update context and redirect
      login(user, token);
      navigate(from, { replace: true });
    } catch (error) {
      const status = error.response?.status;
      const data = error.response?.data;
      let errorMessage = error.message || 'Login failed';

      if (status === 423) {
        errorMessage = `Account locked: ${data?.error || error.message}`;
      } else if (status === 401) {
        errorMessage = 'Invalid credentials.';
      } else if (status === 500) {
        errorMessage = `Server error: ${data?.error || error.message}`;
      }

      setErrors({ api: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2>Login to Your Account</h2>

        {errors.api && <div className={styles.apiError}>{errors.api}</div>}

        <form onSubmit={handleSubmit}>
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

          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className={styles.loginFooter}>
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
}
