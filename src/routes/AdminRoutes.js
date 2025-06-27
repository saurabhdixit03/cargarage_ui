import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ServiceManagement from "../pages/admin/ServiceManagement";
import CustomerManagement from "../pages/admin/CustomerManagement";
import FaceliftKitManagement from "../pages/admin/FaceliftKitManagement";
import DiscountManagement from "../pages/admin/DiscountManagement";
import AppointmentManagement from "../pages/admin/AppointmentManagement";
import CarManagement from "../pages/admin/CarManagement";
import ProtectedRoutes from "./ProtectedRoutes"; // Ensure this file exists
import AdminProfile from "../pages/admin/Profile";
import Login from "../pages/admin/Login";
import Register from "../pages/admin/Register";
import FaceliftBookingManagement from "../pages/admin/FaceliftBookingManagement"

function AdminRoutes() {
  return (
    <Routes> 
      {/* Protected Routes for Admin */}
      <Route element={<ProtectedRoutes />}>
        <Route path="admin/login" element={<Login/>}/>
        <Route path="dashboard/profile" element={<AdminProfile/>}/>
        <Route path="register/admin/register" element={<Register/>}/>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="dashboard/services" element={<ServiceManagement />} />
        <Route path="dashboard/customers" element={<CustomerManagement />} />
        <Route path="dashboard/faceliftkits" element={<FaceliftKitManagement />} />
        <Route path="dashboard/discounts" element={<DiscountManagement />} />
        <Route path="dashboard/appointments" element={<AppointmentManagement />} />
        <Route path="dashboard/cars" element={<CarManagement />} />
        <Route path="dashboard/faceliftbookings" element={<FaceliftBookingManagement />}/>
        
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
