import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const headers = { ...config.headers };
  if (config.url.includes('/user/login') || config.url.includes('/user/register')) {
    console.debug('Request to:', config.url, 'Payload:', config.data, 'Headers:', headers);
    return { ...config, headers };
  }
  const { token } = config;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  console.debug('Request to:', config.url, 'Headers:', headers);
  return { ...config, headers };
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    console.debug('Response from:', response.config.url, 'Status:', response.status, 'Data:', response.data);
    return response;
  },
  (error) => {
    console.error('Response error from:', error.config?.url, 'Status:', error.response?.status, 'Data:', error.response?.data, 'Message:', error.message);
    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  try {
    console.debug('Register user payload:', userData);
    const response = await api.post('/user/register', userData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Registration failed';
    console.error('Register error:', errorMessage, {
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(errorMessage);
  }
};

export const loginUser = async (credentials) => {
  try {
    if (!credentials?.email || !credentials?.password) {
      throw new Error('Email and password are required');
    }
    console.debug('Login user payload:', credentials);
    const response = await api.post('/user/login', credentials);
    console.debug('Login response:', response);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Login failed';
    console.error('Login error:', errorMessage, {
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(errorMessage);
  }
};

export const getCurrentUser = async (email, token) => {
  try {
    if (!token) {
      throw new Error('No token provided');
    }
    if (!email) {
      throw new Error('No email provided');
    }
    console.debug('Fetching current user with email:', email, 'and token:', token);
    const response = await api.get(`/user/me?email=${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to fetch user';
    console.error('Get current user error:', errorMessage, {
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(errorMessage);
  }
};

export const getUserProfile = async (identifier, token) => {
  try {
    console.debug('Get profile for identifier:', identifier);
    const response = await api.get(`/user/profile/${identifier}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to fetch profile';
    console.error('Get profile error:', errorMessage, {
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(errorMessage);
  }
};

export const applyForLoan = async (loanData, token) => {
  try {
    console.debug('Apply for loan payload:', loanData);
    const response = await api.post('/loan/apply', loanData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Loan application failed';
    console.error('Apply for loan error:', errorMessage, {
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(errorMessage);
  }
};

export const getLoanStatus = async (loanId, token) => {
  try {
    console.debug('Get loan status for loanId:', loanId);
    const response = await api.get(`/loan/status/${loanId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to fetch loan status';
    console.error('Get loan status error:', errorMessage, {
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(errorMessage);
  }
};

export const getCibilScore = async (userId, token) => {
  try {
    console.debug('Get CIBIL score for userId:', userId);
    const response = await api.get(`/user/cibil/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to fetch CIBIL score';
    console.error('Get CIBIL score error:', errorMessage, {
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(errorMessage);
  }
};

export default api;