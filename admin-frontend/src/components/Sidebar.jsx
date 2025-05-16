import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import { deleteAdmin } from "../services/adminApi";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const email = localStorage.getItem("adminEmail");
    await deleteAdmin(email);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <>
      <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✖" : "☰"}
      </button>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li>
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/users">Users</Link>
            </li>
            <li>
              <Link to="/admin/loans">Loans</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
