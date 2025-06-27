import React from "react";
import { Routes, Route } from "react-router-dom";
import UserDashboard from "../pages/user/UserDashboard";
import BrowseService from "../pages/user/BrowseService";
import Profile from "../pages/user/Profile";
import ServiceBooking from "../pages/user/ServiceBooking";
import AppointmentBooking from "../pages/user/AppointmentBooking";
import ContactUs from "../pages/user/ContactUs";
import ProtectedUserRoute from "./ProtectedUserRoutes";
import Register from "../pages/user/Register"; // ✅ Corrected import path
import UserCars from "../pages/user/UserCars";
import FaceliftKits from "../pages/user/FaceliftKits";
import UserDiscounts from "../pages/user/UserDiscount";
import DiscountBooking from "../pages/user/DiscountBooking";
import AppointmentRescheduling from "../pages/user/AppointmentRescheduling";
import Payment from "../pages/user/payment"; 
import FaceliftKitBooking from "../pages/user/FaceliftKitBooking";
import KitBookings from "../pages/user/KitBookings";
import MyBookings from "../pages/user/MyBookings";

function UserRoutes() {
  return (
    <Routes> {/* ✅ No need for <Router> here */}
      <Route path="user/register" element={<Register />} /> {/* ✅ Moved outside ProtectedUserRoute */}
      
      <Route element={<ProtectedUserRoute />}>
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="dashboard/faceliftKits" element={<FaceliftKits />} />
        <Route path="dashboard/Browseservice" element={<BrowseService />} />
        <Route path="dashboard/discounts" element={<UserDiscounts/>}/>
        <Route path="dashboard/profile" element={<Profile />} />
        <Route path="dashboard/UserCars" element={<UserCars />} />
        <Route path="dashboard/servicebookings" element={<ServiceBooking />} />
        <Route path="dashboard/AppointmentBooking" element={<AppointmentBooking />} />
        <Route path="dashboard/contactus" element={<ContactUs />} />
        <Route path="dashboard/discountbooking" element={<DiscountBooking/>} />
        <Route path="dashboard/AppointmentRescheduling" element={<AppointmentRescheduling/>}/>
        <Route path="dashboard/payment" element={<Payment />} />
        <Route path="dashboard/faceliftkitbooking" element={<FaceliftKitBooking/>}/>
        <Route path="dashboard/kitbooking" element={<KitBookings/>}/>
        <Route path="dashboard/myBookings" element={<MyBookings/>}/>

      </Route>
    </Routes>
  );
}

export default UserRoutes;
