import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.url.includes('/api/auth/')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handler
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      // token expired/invalid → kick to login
      localStorage.removeItem("token");
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

// ------------- AUTH -----------------
export const AuthAPI = {
  register: (payload) => api.post("/api/auth/register", payload), 
  login: (payload) => api.post("/api/auth/login", payload), 
};

// ------------- PUBLIC (no auth) -----
export const PublicAPI = {
  forgotPassword: (email) =>
    api.post(`/api/public/forgot-password?email=${encodeURIComponent(email)}`),
  resetPassword: ({ token, newPassword }) =>
    api.post(`/api/public/reset-password?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}`),
  validateToken: (token) =>
    api.get(`/api/public/validate-token?token=${encodeURIComponent(token)}`),
};

// ------------- USER -----------------
export const UserAPI = {
  // WARNING: backend currently only exposes POST /api/user/apply-loan
  applyLoan: (userId, { amount, tenure, interestRate }) =>
    api.post(`/api/user/apply-loan`, { amount, tenure, interestRate }, { params: { userId } }),

  // Documents
  getDocuments: () => api.get("/api/user/documents"),
  deleteDocument: (documentId) => api.delete(`/api/user/documents/${documentId}`),
  uploadDocument: (file, type) => {
    const form = new FormData();
    form.append("file", file);
    form.append("type", type);
    return api.post("/api/user/documents/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Track status (requires matching backend controller – recommended: GET /api/user/loans)
  getMyLoans: () => api.get("/api/user/loans"), // if not present yet, implement on backend from LoanService.getUserLoans

  // User Dashboard & Profile
  getUserDashboard: () => api.get("/api/user/dashboard"),
  getUserProfile: () => api.get("/api/user/profile"),
  updateUserProfile: (data) => api.put("/api/user/profile", data),

  // EMI Management
  getUserEmis: () => api.get("/api/user/emis"),
  getUserEmiHistory: () => api.get("/api/user/emis/history"),
  getUserEmiStats: () => api.get("/api/user/emis/stats"),
  payEmi: (emiId, amount) => api.post(`/api/user/emis/${emiId}/pay`, { amount }),
};

// ------------- PAYMENT --------------
export const PaymentAPI = {
  createOrder: ({ amount, currency = "INR", username }) =>
    api.post("/api/payment/create-order", { amount, currency, username }),
  verify: ({ razorpayOrderId, razorpayPaymentId, razorpaySignature, username, emiId }) =>
    api.post("/api/payment/verify", { razorpayOrderId, razorpayPaymentId, razorpaySignature, username, emiId }),
  // EMI specific
  createEmiOrder: ({ amount, currency = "INR", emiId }) =>
    api.post("/api/payments/emi/pay", { amount, currency, emiId }),
  verifyEmiPayment: ({ razorpayOrderId, razorpayPaymentId, razorpaySignature, emiId }) =>
    api.post("/api/payments/emi/verify", { razorpayOrderId, razorpayPaymentId, razorpaySignature, emiId }),
  // Loan specific
  createLoanOrder: ({ amount, currency = "INR", loanId, userId }) =>
    api.post("/api/payments/loan/pay", { amount, currency, loanId, userId }),
  verifyLoanPayment: ({ razorpayOrderId, razorpayPaymentId, razorpaySignature, loanId, userId, amount }) =>
    api.post("/api/payments/loan/verify", { razorpayOrderId, razorpayPaymentId, razorpaySignature, loanId, userId, amount }),
};

// ------------- ADMIN ----------------
export const AdminAPI = {
  getDashboardStats: () => api.get("/api/admin/dashboard/stats"),
  getLoans: ({ page = 0, size = 10, status } = {}) =>
    api.get("/api/admin/loans", { params: { page, size, status } }),

  getUsers: ({ page = 0, size = 10 } = {}) =>
    api.get("/api/admin/users", { params: { page, size } }),
  updateLoanStatus: (loanId, { status, adminComments }) =>
    api.patch(`/api/admin/loans/${loanId}/status`, { status, adminComments }),
  getUserDocuments: (userId) => api.get(`/api/admin/users/${userId}/documents`),
  updateUserCibil: (userId, newCibilScore) =>
    api.patch(`/api/admin/users/${userId}/cibil`, null, { params: { newCibilScore } }),
  deleteUser: (userId) => api.delete(`/api/admin/users/${userId}`),
  getPendingEmis: () => api.get("/api/admin/pending-emis"),
  getUserDetails: (userId) => api.get(`/api/admin/users/${userId}/details`),
  payEmi: (loanId, amount) => api.post(`/api/admin/loans/${loanId}/pay-emi`, { amount }),
};

// Loan APIs
export const applyLoan = (formData) => api.post("/api/user/apply-loan", formData, {
    headers: { "Content-Type": "multipart/form-data" }
}).then(res => res.data);

// User APIs
export const getUserProfile = () => api.get("/api/user/profile").then(res => res.data);
export const updateUserProfile = (data) => api.put("/api/user/profile", data).then(res => res.data);

// Document APIs
export const getUserDocuments = () => api.get("/api/user/documents").then(res => res.data);
export const uploadDocument = (formData) =>
  api.post("/api/user/documents/upload", formData, { headers: { "Content-Type": "multipart/form-data" } }).then(res => res.data);
export const deleteDocument = (id) => api.delete(`/api/user/documents/${id}`).then(res => res.data);

// Loan + EMI APIs
export const getMyLoans = () => api.get("/api/user/loans").then((res) => res.data);
export const getMyEmis = () => api.get("/api/user/emis").then((res) => res.data);
export const payEmi = (emiId, amount) => api.post(`/api/user/emis/${emiId}/pay`, { amount }).then((res) => res.data);


export default api;
