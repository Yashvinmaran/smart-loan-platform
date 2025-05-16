import "../styles/Users.css";
import { useEffect, useState } from "react";
import { deleteUser, getUsers, updateCibil } from "../services/adminApi";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cibilInputs, setCibilInputs] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (email) => {
    if (!window.confirm(`Are you sure you want to delete user ${email}?`))
      return;
    try {
      await deleteUser(email);
      setUsers(users.filter((user) => user.email !== email));
    } catch (err) {
      alert(err.message || "Failed to delete user");
    }
  };

  const handleCibilChange = (email, value) => {
    setCibilInputs((prev) => ({ ...prev, [email]: value }));
  };

  const handleCibilUpdate = async (email,userId) => {
    const cibilScore = Number(cibilInputs[email]);
    if (isNaN(cibilScore)) {
      alert("Please enter a valid number for CIBIL score");
      return;
    }
    try {
      await updateCibil(userId, { cibilScore });
      alert("CIBIL score updated successfully");
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === email ? { ...user, cibilScore } : user
        )
      );
    } catch (err) {
      alert(err.message || "Failed to update CIBIL score");
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ marginLeft: "300px" }}>
      <h1 style={{ marginLeft: "40%", color: "orange" }}>Users Page</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table border="1" cellPadding="1" cellSpacing="0">
          <thead>
            <tr>
              <th style={{ background: "yellow" }}>Name</th>
              <th style={{ background: "yellow" }}>Email</th>
              <th style={{ background: "yellow" }}>PAN</th>
              <th style={{ background: "yellow" }}>Aadhar</th>
              <th style={{ background: "yellow" }}>CIBIL Score</th>
              <th style={{ background: "yellow" }}>Update CIBIL</th>
              <th style={{ background: "yellow" }}>Delete User</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId || user.email}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.pan}</td>
                <td>{user.aadhar}</td>
                <td>{user.cibilScore}</td>
                <td>
                  <input
                    type="number"
                    value={cibilInputs[user.email] || ""}
                    onChange={(e) =>
                      handleCibilChange(user.email, e.target.value)
                    }
                    placeholder="New CIBIL"
                  />
                  <button
                    onClick={() => handleCibilUpdate(user.email, user.userId)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDelete(user.email)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
