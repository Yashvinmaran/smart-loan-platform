import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/user/register', userData)
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/user/login', credentials)
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/user/profile/${userId}`)
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const applyForLoan = async (loanData) => {
  try {
    const response = await api.post('/loan/apply', loanData)
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const getLoanStatus = async (loanId) => {
  try {
    const response = await api.get(`/loan/status/${loanId}`)
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const getCibilScore = async (userId) => {
  try {
    const response = await api.get(`/user/cibil/${userId}`)
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export default api