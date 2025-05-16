import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../services/adminApi";
import "../styles/AdminLogin.css";

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await adminLogin(formData);
      localStorage.setItem("adminToken", response.jwtToken);
      localStorage.setItem("adminEmail", response.userName);
      navigate("/admin/dashboard");
    } catch (err) {
      const errorMessage =
        err && typeof err === "object" && err.message ? err.message : err;
      setError(errorMessage || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        <div className="form-group">
          <label>Email:</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;
