  import { userApiClient } from './api';

// ✅ Register User
export const registerUser = async (userData) => {
  try {
    const response = await userApiClient.post("/register", userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// ✅ User Login (Session-based)
export const loginUser = async (credentials) => {
  console.log("Sending login request to API:", credentials);
  
  try {
    const response = await userApiClient.post("/login", credentials);
    console.log("Login response received:", response);
    return response;
  } catch (error) {
    console.error("Login request failed:", error);
    throw error;
  }
};

// ✅ Check if User is Authenticated (Session Check)
export const checkUserSession = async () => {
  try {
    const response = await userApiClient.get("/session");
    return response.data; // { authenticated: true, email: "user@example.com" }
  } catch (error) {
    if (error.response?.status === 401) {
      return { authenticated: false };
    }
    console.error("Error checking user session:", error);
    throw error;
  }
};

// ✅ User Logout
export const logoutUser = async () => {
  try {
    await userApiClient.post("/logout");
  } catch (error) {
    console.error("Error logging out user:", error);
    throw error;
  }
};

// ✅ Fetch user profile
export const getUserProfile = async (customerId) => {
  try {
    const response = await userApiClient.get(`/${customerId}`);
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};

// ✅ Update customer profile
export const updateUserProfile = async (customerId, profileData) => {
  try {
    const response = await userApiClient.put(`/${customerId}`, profileData);
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};

// ✅ Centralized Error Handling for Authenticated APIs
const handleAuthError = (error) => {
  console.error("API request failed:", error);

  if (error.response?.status === 401) {
    alert("Session expired. Please log in again.");
    localStorage.removeItem("userToken");
    window.location.href = "/user/login";
  }

  throw error;
};

// ✅ Fetch all available services
export const getAllServices = async () => {
  try {
    const response = await userApiClient.get("/services");
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};

// ✅ Search services by name
export const searchServices = async (name) => {
  try {
    const response = await userApiClient.get("/services/search", { params: { name } });
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};

// ✅ Book an appointment (Supports multiple service IDs)
export const bookAppointment = async (customerId, appointmentData) => {
  try {
    const response = await userApiClient.post(
      `/${customerId}/appointments`, 
      {
        appointmentDate: appointmentData.appointmentDate,
        carId: appointmentData.carId,
        serviceIds: appointmentData.serviceIds,
        discountIds: appointmentData.discountIds || null // Now accepts an array of service IDs
      }
    );
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};


// 🔁 Reschedule all appointments for a specific car
export const rescheduleAppointment = async (carId, rescheduleData) => {
  try {
    const response = await userApiClient.put(`/appointments/${carId}`, rescheduleData);
    return response.data;
  } catch (error) {
    console.error("Rescheduling error:", error.response?.data || error.message);
    return handleAuthError(error);
  }
};


// ✅ Fetch all appointments by customer (Updated response mapping)
export const getUserAppointments = async () => {
  try {
    // Check if the user is authenticated and retrieve the session data
    const sessionData = await checkUserSession();

    if (!sessionData.authenticated) {
      throw new Error("User not authenticated");
    }

    const customerId = sessionData.userId; // Assuming the session data contains `userId`
    if (!customerId) {
      throw new Error("Customer ID not found in session data");
    }

    // Fetch appointments using the authenticated user ID
    const response = await userApiClient.get(`/appointments/${customerId}`);

    // Map the response to include the required fields, including groupId
    return response.data.map(appointment => ({
      appointmentId: appointment.appointmentId,
      appointmentDate: appointment.appointmentDate,
      status: appointment.status,
      carId: appointment.carId,
      carModel: appointment.carModel,
      licensePlate: appointment.licensePlate,
      serviceName: appointment.serviceName,
      groupId: appointment.groupId, // Adding the groupId to the response
      budget: appointment.budget
    }));
  } catch (error) {
    return handleAuthError(error);
  }
};

// ✅ Delete appointment group by customerId and groupId
export const deleteAppointment = async (customerId, groupId) => {
  try {
    // Check if the user is authenticated and retrieve session data
    const sessionData = await checkUserSession();

    if (!sessionData.authenticated) {
      throw new Error("User not authenticated");
    }

    const customerIdFromSession = sessionData.userId; // Assuming the session data contains `userId`
    if (!customerIdFromSession || customerIdFromSession !== customerId) {
      throw new Error("Customer ID mismatch");
    }

    // Perform the delete operation using the provided customerId and groupId
    const response = await userApiClient.delete(`/appointments/${customerId}/${groupId}`);

    if (response.status === 200) {
      // Return success message if the appointment group is deleted successfully
      return { message: "Appointment group deleted successfully" };
    } else {
      // Handle unsuccessful deletion response
      throw new Error("Failed to delete appointment group.");
    }
  } catch (error) {
    // Handle errors (either from the API or session)
    return handleAuthError(error);
  }
};




// ✅ Fetch a specific appointment by ID (Updated response mapping)
export const getAppointmentById = async (id) => {
  try {
    const response = await userApiClient.get(`/appointments/details/${id}`);
    return {
      appointmentId: response.data.appointmentId, // Changed to match response structure
      appointmentDate: response.data.appointmentDate, // Changed to match response structure
      status: response.data.status,
      carModel: response.data.carModel,
      carLicensePlate: response.data.carLicensePlate, // Added car license plate from response
      serviceName: response.data.serviceName // Assuming backend sends a single string
    };
  } catch (error) {
    return handleAuthError(error);
  }
};

// ✅ Update appointment (Supports multiple service IDs)
export const updateAppointment = async (customerId, appointmentId, updatedData) => {
  try {
    const response = await userApiClient.put(
      `/${customerId}/appointments/${appointmentId}`, 
      {
        appointmentDate: updatedData.appointmentDate,
        carId: updatedData.carId,
        serviceIds: updatedData.serviceIds  // Accepts an array of service IDs
      }
    );
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};



// ✅ Fetch all cars owned by a customer
export const getUserCars = async (customerId) => {
  try {
    const response = await userApiClient.get(`/${customerId}/cars`);
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};

// ✅ Add a new car to user's profile
export const addUserCar = async (customerId, carData) => {
  try {
    const response = await userApiClient.post(`/${customerId}/cars`, carData);
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};

// ✅ Update car details
export const updateUserCar = async (carId, carData) => {
  try {
    const response = await userApiClient.put(`/cars/${carId}`, carData);
    return response.data;
  } catch (error) {
    console.error('Error updating car:', error);
    throw error;
  }
};

// ✅ Delete a car from user's profile
export const deleteUserCar = async (carId) => {
  try {
    const response = await userApiClient.delete(`/cars/${carId}`);
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};

/* ✅ Fetch all available discounts
export const getDiscounts = async () => {
  try {
    const response = await userApiClient.get("/discounts");
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
}; */

export const getUserDiscounts = async (userId) => {
  try {
    const response = await userApiClient.get(`/discounts`);
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};

// ✅ Fetch all Facelift Kits for given customerId
export const getAllFaceliftKits = async (customerId) => {
  try {
    const response = await userApiClient.get(`/facelift/${customerId}`);
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};

// Book a Facelift Kit
export const bookFaceliftKit = async (customerId, bookingData) => {
  try {
    const response = await userApiClient.post(`/facelift/book/${customerId}`, bookingData);
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};

// Fetch All Bookings for a User
export const getUserFaceliftKitBookings = async (customerId) => {
  try {
    const response = await userApiClient.get(`/facelift/bookings/${customerId}`);
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};




// ✅ Create Razorpay order for payment (Supports multiple service IDs)
export const createPaymentOrder = async (amount, email) => {
  try {
    const response = await userApiClient.post('/createOrder', {
      amount: amount,
      email: email,
      name: "Customer Name" // optional, use userName if available
    });
    return response.data;
  } catch (error) {
    console.error("createPaymentOrder error:", error.response?.data || error.message);
    throw error;
  }
};
