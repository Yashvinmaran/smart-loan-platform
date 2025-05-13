import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9090';
const getToken = () => localStorage.getItem('adminToken');

export const registerAdmin = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/admin/register`, credentials);
    return response.data;
  } catch (error) {
    console.error('Register error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const adminLogin = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/admin/login`, credentials);
    return response.data; // JWT token
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const getUsers = async () => {
  const token = getToken();
  if (!token) {
    console.error('No admin token found in localStorage');
    throw new Error('No admin token found');
  }
  try {
    const response = await axios.get(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Get users error:', error.response?.data || error.message, { token, status: error.response?.status });
    throw error.response?.data || error.message;
  }
};

export const getLoans = async () => {
  const token = getToken();
  if (!token) {
    console.error('No admin token found in localStorage');
    throw new Error('No admin token found');
  }
  try {
    const response = await axios.get(`${API_URL}/admin/loans`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Get loans error:', error.response?.data || error.message, { token, status: error.response?.status });
    throw error.response?.data || error.message;
  }
};

export const updateLoanStatus = async (id, { status }) => {
  const token = getToken();
  if (!token) {
    console.error('No admin token found in localStorage');
    throw new Error('No admin token found');
  }
  try {
    const response = await axios.put(`${API_URL}/admin/loan/status/${id}`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Update loan status error:', error.response?.data || error.message, { token, status: error.response?.status });
    throw error.response?.data || error.message;
  }
};

export const updateCibil = async (id, { cibilScore }) => {
  const token = getToken();
  if (!token) {
    console.error('No admin token found in localStorage');
    throw new Error('No admin token found');
  }
  try {
    const response = await axios.put(`${API_URL}/admin/cibil/${id}`, { cibilScore }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Update CIBIL error:', error.response?.data || error.message, { token, status: error.response?.status });
    throw error.response?.data || error.message;
  }
};

export const deleteUser = async (id) => {
  const token = getToken();
  if (!token) {
    console.error('No admin token found in localStorage');
    throw new Error('No admin token found');
  }
  try {
    const response = await axios.delete(`${API_URL}/admin/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Delete user error:', error.response?.data || error.message, { token, status: error.response?.status });
    throw error.response?.data || error.message;
  }
};