import axios from 'axios';
import { ADMIN_API_BASE_URL, USER_API_BASE_URL } from '../utils/constants';

// Function to get token from localStorage
export const getAuthToken = () => localStorage.getItem("adminToken");

// Create an Axios instance for authenticated requests
const apiClient = axios.create({
  baseURL: ADMIN_API_BASE_URL,
});

// Attach token to every request automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);



// Admin Login
export const adminLogin = async (credentials) => {
    try {
        const response = await axios.post(`${ADMIN_API_BASE_URL}/auth/login`, credentials, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true, // ✅ Ensures session cookie is sent/received
        });

        console.log("Login Response:", response.data); // Debugging

        return response.data; 
    } catch (error) {
        console.error("Error logging in (Admin):", error.response?.data || error.message);
        throw error;
    }
};


// User Login
export const userLogin = async (credentials) => {
  try {
    const response = await axios.post(`${USER_API_BASE_URL}/auth/login`, credentials, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in (User):', error.response?.data || error.message);
    throw error;
  }
};

// Admin Logout
export const adminLogout = async () => {
  try {
    await axios.post(`${ADMIN_API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
  } catch (error) {
    console.error('Error logging out (Admin):', error.response?.data || error.message);
    throw error;
  }
};

// User Logout
export const userLogout = async () => {
  try {
    await axios.post(`${USER_API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
  } catch (error) {
    console.error('Error logging out (User):', error.response?.data || error.message);
    throw error;
  }
};

// Check if Admin is authenticated
export const isAdminAuthenticated = async () => {
    try {
        const response = await axios.get(`${ADMIN_API_BASE_URL}/auth/status`, { withCredentials: true });
        return response.data.authenticated; // ✅ Ensure backend sends { "authenticated": true }
    } catch (error) {
        console.error('Error checking authentication status (Admin):', error.response?.data || error.message);
        return false;
    }
};


// Check if User is authenticated
export const isUserAuthenticated = async () => {
  try {
    const response = await axios.get(`${USER_API_BASE_URL}/auth/status`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error checking authentication status (User):', error.response?.data || error.message);
    return false;
  }
};
