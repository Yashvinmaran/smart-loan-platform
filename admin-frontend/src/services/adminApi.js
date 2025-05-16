import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9090/api/v1';

const getToken = () => localStorage.getItem('adminToken');

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const registerAdmin = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/admin/register`, credentials);
    return response.data;
  } catch (error) {
    console.error('Register error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

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
