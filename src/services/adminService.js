//import axios from 'axios';
//import { ADMIN_API_BASE_URL } from '../utils/constants';
import {adminApiClient} from './api';


// ✅ Register Admin
export const registerAdmin = async (adminData) => {
  try {
    const response = await adminApiClient.post("/register", adminData);
    return response.data;
  } catch (error) {
    console.error("Error registering admin:", error);
    throw error;
  } 
};

// ✅ Admin Login (Session-based)
export const loginAdmin = async (adminData) => {
  console.log("Sending login request to API:", adminData);

  try {
      const response = await adminApiClient.post("/login", adminData);
      console.log("Login response received:", response);
      return response;
  } catch (error) {
      console.error("Login request failed:", error);
      throw error;
  }
};

// ✅ Check if Admin is Authenticated (Session Check)
export const checkAdminSession = async () => {
  try {
    const response = await adminApiClient.get("/session");
    return response.data; // { authenticated: true, email: "admin@example.com" }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return { authenticated: false }; // Ensure frontend handles this properly
    }
    console.error("Error checking admin session:", error);
    throw error;
  }
};

// Get Admin Profile
export const getAdminProfile = async (adminId) => {
  try {
    const response = await adminApiClient.get(`/${adminId}`);
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};

// Admin Profile Update 
export const updateAdminProfile = async (adminId, profileData) => {
  try {
    const response = await adminApiClient.put(`/${adminId}`, profileData);
    return response.data
  }catch(error){
    return handleAuthError(error);
  }
};


// ✅ Admin Logout
export const logoutAdmin = async () => {
  try {
    await adminApiClient.post("/logout");
  } catch (error) {
    console.error("Error logging out admin:", error);
    throw error;
  }
};

// ✅ Centralized Error Handling for Authenticated APIs
const handleAuthError = (error) => {
  console.error("API request failed:", error);

  if (error.response?.status === 401) {
    alert("Session expired. Please log in again.");
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  }

  throw error;
};


// ✅ Fetch Admin Services (with authentication)
export const getAdminServices = async () => {
  try {
    const response = await adminApiClient.get("/services"); // `withCredentials` already handled in `api.js`
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// ✅ Add a new service for the admin (with authentication)
export const addAdminService = async (serviceData) => {
  try {
    const response = await adminApiClient.post("/services", serviceData);
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// ✅ Update a specific service for the admin (with authentication)
export const updateAdminService = async (serviceId, serviceData) => {
  try {
    const response = await adminApiClient.put(`/services/${serviceId}`, serviceData);
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// ✅ Delete a specific service for the admin (with authentication)
export const deleteAdminService = async (serviceId) => {
  try {
    const response = await adminApiClient.delete(`/services/${serviceId}`);
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};


// ✅ Fetch all customers (Authenticated)
export const getAdminCustomers = async () => {
  try {
    const response = await adminApiClient.get("/customers");
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// ✅ Fetch customer details (Authenticated)
export const getAdminCustomerDetails = async (customerId) => {
  try {
    const response = await adminApiClient.get(`/customers/${customerId}`);
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// ✅ Delete a customer (Authenticated)
export const deleteAdminCustomer = async (customerId) => {
  try {
    const response = await adminApiClient.delete(`/customers/${customerId}`);
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// ✅ Fetch cars owned by a customer (Authenticated)
export const getAdminCustomerCars = async (customerId) => {
  try {
    const response = await adminApiClient.get(`/customers/${customerId}/cars`);
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// ✅ Fetch all cars with details in the system (Authenticated)
export const getAdminCars = async () => {
  try {
    const response = await adminApiClient.get("/customers-with-details");
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// ✅ Fetch all cars in the system (Authenticated)
export const getAllCars = async () => {
  try {
    const response = await adminApiClient.get("/cars");
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// ✅ Fetch all cars in the system (Authenticated)
export const getCars = async () => {
  try {
    const response = await adminApiClient.get("/cars-with-customers");
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};



// ✅ Fetch user appointments by ID for the admin (Authenticated)
export const getUserAppointments = async (userId) => {
  try {
    const response = await adminApiClient.get(`/appointments/user/${userId}`);
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// ✅ Fetch all appointments for the admin (Authenticated)
export const getAdminAppointments = async () => {
  try {
    const response = await adminApiClient.get("/appointments");
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// ✅ Update a specific appointment status (Authenticated)
export const updateAdminAppointment = async (appointmentId, appointmentData) => {
  try {
    const response = await adminApiClient.put(`/appointments/${appointmentId}/status`, appointmentData);
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// ✅ Cancel a specific appointment (Authenticated)
export const cancelAdminAppointment = async (appointmentId) => {
  try {
    const response = await adminApiClient.delete(`/appointments/${appointmentId}`);
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// Add a new discount/package
// ✅ Add a new discount/package (Authenticated)
export const addAdminDiscount = async (discountData) => {
  try {
    console.log("📤 Sending Discount Data:", JSON.stringify(discountData, null, 2));
    const response = await adminApiClient.post("/discounts", discountData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Failed to add discount:", error.response?.data || error.message);
    throw error;
  }
};


// ✅ Fetch all discounts/packages (Authenticated)
export const getAdminDiscounts = async () => {
  try {
    const response = await adminApiClient.get("/discounts");
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// ✅ Fetch discounts for a specific customer (Authenticated)
export const getDiscountsByCustomerId = async (customerId) => {
  try {
    const response = await adminApiClient.get(`/customers/${customerId}/discounts`);
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// ✅ Fetch common discounts (Authenticated)
export const getCommonDiscounts = async () => {
  try {
    const response = await adminApiClient.get("/discounts/common");
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// ✅ Update a specific discount/package (Authenticated)
export const updateAdminDiscount = async (discountId, discountData) => {
  try {
    const response = await adminApiClient.put(`/discounts/${discountId}`, discountData);
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// ✅ Remove a discount/package (Authenticated)
export const removeAdminDiscount = async (discountId) => {
  try {
    const response = await adminApiClient.delete(`/discounts/${discountId}`);
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// Update discount with a selected customer
// ✅ Assign/Update a discount for a specific customer
export const updateDiscountWithCustomer = async (discountId, customerId) => {
  try {
    const response = await adminApiClient.put(`/discounts/${discountId}/customer/${customerId}`, null, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating discount with customer:", error.response?.status, error.response?.data || error.message);
    throw error;
  }
};

//addded later 

// ✅ Fetch repeat customers (Authenticated)
export const getRepeatCustomers = async () => {
  try {
    const response = await adminApiClient.get("/customers/repeat");
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// ✅ Fetch all facelift kits (Authenticated)
export const getFaceliftKits = async () => {
  try {
    const response = await adminApiClient.get("/facelift");
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// ✅ Fetch facelift kits for a specific car model (Authenticated)
export const getFaceliftKitsByCarModel = async (carModel) => {
  try {
    const response = await adminApiClient.get(`/facelift/car/${carModel}`);
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// ✅ Fetch a specific facelift kit by ID (Authenticated)
export const getFaceliftKitById = async (kitId) => {
  try {
    const response = await adminApiClient.get(`/facelift/${kitId}`);
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};


// ✅ Add a new facelift kit (Authenticated)
export const addFaceliftKit = async (kitData, images) => {
  try {
    const formData = new FormData();
    // Append fields from kitData
    Object.entries(kitData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    // Append images (multiple)
    images.forEach((imgFile) => {
      formData.append("images", imgFile);
    });

    const response = await adminApiClient.post("/facelift/with-images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// ✅ Update an existing facelift kit (Authenticated)
export const updateFaceliftKit = async (faceliftId, kitData, images) => {
  try {
    const formData = new FormData();
    Object.entries(kitData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    images.forEach((imgFile) => {
      formData.append("images", imgFile);
    });

    const response = await adminApiClient.put(`/facelift/with-images/${faceliftId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};


// ✅ Delete a facelift kit (Authenticated)
export const deleteFaceliftKit = async (faceliftId) => {
  try {
    await adminApiClient.delete(`/facelift/${faceliftId}`);
  } catch (error) {
    handleAuthError(error);
  }
};


// FACELIFT KIT BOOKINGS 

// Get all facelift kit bookings
export const getAllFaceliftKitBookings = async () => {
  try {
    const response = await adminApiClient.get('/facelift/bookings');
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};

// Update status of a specific booking
export const updateFaceliftBookingStatus = async (bookingId, status) => {
  try {
    const response = await adminApiClient.put(`/bookings/${bookingId}/status`, {
      status: status,
    });
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};

// DTO Implementaion

// ✅ Fetch customers with details (Authenticated)
export const getAdminCustomersWithDetails = async () => {
  try {
    const response = await adminApiClient.get("/customers-with-details");
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// ✅ Fetch all customers (Authenticated)
export const getAllCustomers = async () => {
  try {
    const response = await adminApiClient.get("/customers");
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// ✅ Fetch appointments with details (Authenticated)
export const getAdminAppointmentsWithDetails = async () => {
  try {
    const response = await adminApiClient.get("/appointments-with-details");
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// ✅ Update appointment status (Authenticated)
export const updateAdminAppointmentStatus = async (id, status) => {
  try {
    const response = await adminApiClient.put(`/appointments/${id}/status`, { status });
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};


