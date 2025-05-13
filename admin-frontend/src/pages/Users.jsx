import { useState, useEffect } from 'react';
import { getUsers, updateCibil, deleteUser } from '../services/adminApi';
import '../styles/Users.css';

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
      setError(null);
      setSuccess(null);
    } catch (err) {
      console.error('Failed to fetch users:', err, { token: localStorage.getItem('adminToken') });
      setError('Failed to load users. Please try logging in again.');
    }
  };

  const handleCibilUpdate = async (id, cibilScore) => {
    try {
      const updatedUser = await updateCibil(id, { cibilScore });
      setUsers(users.map(user => user.id === id ? updatedUser : user));
      setError(null);
      setSuccess('CIBIL score updated successfully.');
    } catch (err) {
      console.error('Failed to update CIBIL:', err);
      setError('Failed to update CIBIL score.');
    }
  };

  const handleDelete = async (id, fullName) => {
    if (!window.confirm(`Are you sure you want to delete user ${fullName}?`)) {
      return;
    }
    try {
      await deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
      setError(null);
      setSuccess(`User ${fullName} deleted successfully.`);
    } catch (err) {
      console.error('Failed to delete user:', err, { token: localStorage.getItem('adminToken') });
      setError(err.message || 'Failed to delete user.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="users">
      <h2>Users</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>CIBIL Score</th>
            <th>PAN</th>
            <th>Aadhar</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.fullName || '-'}</td>
              <td>{user.email || '-'}</td>
              <td>
                <input
                  type="number"
                  defaultValue={user.cibilScore ?? '-'}
                  onBlur={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value)) handleCibilUpdate(user.id, value);
                  }}
                />
              </td>
              <td>{user.pan || '-'}</td>
              <td>{user.aadhar || '-'}</td>
              <td>
                <button onClick={() => handleDelete(user.id, user.fullName)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;