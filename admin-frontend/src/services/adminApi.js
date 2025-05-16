import axios from "axios";

const API_URL = "http://localhost:9090/api/v1/admin";

const getToken = () => localStorage.getItem("adminToken");

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const registerAdmin = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/create`, credentials);
    return response.data;
  } catch (error) {
    console.error("Register error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const adminLogin = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    const token = response.data.token;
    if (token) {
      localStorage.setItem("adminToken", token);
    }
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

// ============ Get All Users ============
export const getUsers = async () => {
  if (!getToken()) throw new Error("No admin token found");
  try {
    const response = await axios.get(`${API_URL}/users`, authHeader());
    return response.data;
  } catch (error) {
    console.error("Get users error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

// ============ Get All Loans ============
export const getLoans = async () => {
  if (!getToken()) throw new Error("No admin token found");
  try {
    const response = await axios.get(`${API_URL}/loans`, authHeader());
    return response.data;
  } catch (error) {
    console.error("Get loans error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch loans");
  }
};

// ============ Update Loan Status ============

export const updateLoanStatus = async (id, { status }) => {
  const token = getToken();
  if (!token) throw new Error("No admin token found");
  if (!id || !status) throw new Error("Loan ID and status are required");

  try {
    const response = await axios.put(
      `${API_URL}/loan/status/${id}?status=${encodeURIComponent(status)}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Update loan status error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update loan status"
    );
  }
};

// ============ Update CIBIL Score ============
export const updateCibil = async (id, { cibilScore }) => {
  if (!id || typeof cibilScore !== "number")
    throw new Error("Valid user ID and CIBIL score required");
  try {
    const response = await axios.put(
      `${API_URL}/user/cibil/${id}?cibilScore=${encodeURIComponent(cibilScore)}`
    );
    return response.data;
  } catch (error) {
    console.error("Update CIBIL error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to update CIBIL score"
    );
  }
};

// ============ Delete User ============
export const deleteAdmin = async (email) => {
  if (!getToken()) throw new Error("No admin token found");
  if (
    !email ||
    typeof email !== "string" ||
    email.trim() === "" ||
    email === "null"
  ) {
    throw new Error("Invalid email for deletion");
  }
  try {
    const response = await axios.delete(`${API_URL}/delete/${email}`);
    return response.data;
  } catch (error) {
    console.error("Delete user error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};

export const deleteUser = async (email)=>{
  if (
    !email ||
    typeof email !== "string" ||
    email.trim() === "" ||
    email === "null"
  ) {
    throw new Error("Invalid email for deletion");
  }
  try {
    const response = await axios.delete(`http://localhost:9090/api/v1/user/delete/${email}`);
    return response.data;
  } catch (error) {
    console.error("Delete user error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
}

// ============ Update User ============
export const updateUser = async (email, userData) => {
  if (!getToken()) throw new Error("No admin token found");
  if (!email || typeof email !== "string" || !userData) {
    throw new Error("Email and user data required for update");
  }
  try {
    const response = await axios.put(`${API_URL}/update/${email}`, userData);
    return response.data;
  } catch (error) {
    console.error("Update user error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update user");
  }
};

// ============ Delete Loan ============
export const deleteLoan = async (id) => {
  const token = getToken();
  if (!token) throw new Error("No admin token found");
  if (!id) throw new Error("Loan ID is required for deletion");

  try {
    const response = await axios.delete(`${API_URL}/loan/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Delete loan error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete loan");
  }
};
