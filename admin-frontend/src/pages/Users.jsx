import axios from 'axios';
import '../styles/Users.css';
import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9090/api/v1';

const getToken = () => localStorage.getItem('adminToken');
console.log(getToken);

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// ============ Admin Registration ============
export const registerAdmin = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/admin/register`, credentials);
    return response.data;
  } catch (error) {
    console.error('Register error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// ============ Admin Login ============
export const adminLogin = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/admin/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// ============ Get All Users ============
export const getUsers = async () => {
  if (!getToken()) throw new Error('No admin token found');
  try {
    const response = await axios.get(`${API_URL}/admin/users`, authHeader());
    return response.data;
  } catch (error) {
    console.error('Get users error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};

// ============ Get All Loans ============
export const getLoans = async () => {
  if (!getToken()) throw new Error('No admin token found');
  try {
    const response = await axios.get(`${API_URL}/admin/loans`, authHeader());
    return response.data;
  } catch (error) {
    console.error('Get loans error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch loans');
  }
};

// ============ Update Loan Status ============
export const updateLoanStatus = async (id, { status }) => {
  if (!getToken()) throw new Error('No admin token found');
  if (!id || !status) throw new Error('Loan ID and status are required');
  try {
    const response = await axios.put(
      `${API_URL}/admin/loan/status/${id}?status=${encodeURIComponent(status)}`,
      null,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Update loan status error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update loan status');
  }
};

// ============ Update CIBIL Score ============
export const updateCibil = async (id, { cibilScore }) => {
  if (!getToken()) throw new Error('No admin token found');
  if (!id || typeof cibilScore !== 'number') throw new Error('Valid user ID and CIBIL score required');
  try {
    const response = await axios.put(
      `${API_URL}/admin/user/cibil/${id}?cibilScore=${encodeURIComponent(cibilScore)}`,
      null,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Update CIBIL error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update CIBIL score');
  }
};

// ============ Delete User ============
export const deleteUser = async (email) => {
  if (!getToken()) throw new Error('No admin token found');
  if (!email || typeof email !== 'string' || email.trim() === '' || email === 'null') {
    throw new Error('Invalid email for deletion');
  }
  try {
    const response = await axios.delete(`${API_URL}/admin/user/delete/${encodeURIComponent(email)}`, authHeader());
    return response.data;
  } catch (error) {
    console.error('Delete user error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to delete user');
  }
};

// ============ Update User ============
export const updateUser = async (email, userData) => {
  if (!getToken()) throw new Error('No admin token found');
  if (!email || typeof email !== 'string' || !userData) {
    throw new Error('Email and user data required for update');
  }
  try {
    const response = await axios.put(
      `${API_URL}/admin/user/update/${encodeURIComponent(email)}`,
      userData,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Update user error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update user');
  }
};

const Users = () => {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [cibilInputs, setCibilInputs] = React.useState({});

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (email) => {
    if (!window.confirm(`Are you sure you want to delete user ${email}?`)) return;
    try {
      await deleteUser(email);
      setUsers(users.filter((user) => user.email !== email));
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const handleCibilChange = (email, value) => {
    setCibilInputs((prev) => ({ ...prev, [email]: value }));
  };

  const handleCibilUpdate = async (id) => {
    console.log(id);
    const cibilScore = Number(cibilInputs[id]);
    if (isNaN(cibilScore)) {
      alert('Please enter a valid number for CIBIL score');
      return;
    }
    try {
      await updateCibil(email,  {cibilScore} );
      alert('CIBIL score updated successfully');
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === email ? { ...user, cibilScore } : user
        )
      );
    } catch (err) {
      alert(err.message || 'Failed to update CIBIL score');
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{marginLeft:"300px"}}>
      <h1 style={{marginLeft:"40%", color:"orange"}}>Users Page</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table border="1" cellPadding="1" cellSpacing="0" >
          <thead>
            <tr>
              <th style={{background:"yellow"}}>Name</th>
              <th style={{background:"yellow"}}>Email</th>
              <th style={{background:"yellow"}}>PAN</th>
              <th style={{background:"yellow"}}>Aadhar</th>
              <th style={{background:"yellow"}}>CIBIL Score</th>
              <th style={{background:"yellow"}}>Update CIBIL</th>
              <th style={{background:"yellow"}}>Delete User</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id || user.email}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.pan}</td>
                <td>{user.aadhar}</td>
                <td>{user.cibilScore}</td>
                <td>
                  <input
                    type="number"
                    value={cibilInputs[user.email] || ''}
                    onChange={(e) => handleCibilChange(user.email, e.target.value)}
                    placeholder="New CIBIL"
                  />
                  <button onClick={() => handleCibilUpdate(user.id)}>Update</button>
                </td>
                <td>
                  <button onClick={() => handleDelete(user.email)}>Delete</button>
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
