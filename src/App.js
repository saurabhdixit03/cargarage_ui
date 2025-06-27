import React from "react";
import { Routes, Route } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
//import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import Admin and User Routes
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";

// Imported Pages
import UserLogin from './pages/user/Login';  // ✅ User Login
import AdminLogin from './pages/admin/Login';
import Register from './pages/admin/Register';
import UserRegister from "./pages/user/Register";

function App() {
  return (
    <>
      <Routes>
        {/* Default Route -> User Login */}
        <Route path="/" element={<UserLogin />} />  
        <Route path="/user/register" element={<UserRegister/>}></Route>


        {/* Admin Login & Registration */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />

        
        {/* Nested Routes for Admin & User */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/user/*" element={<UserRoutes />} />

        {/* Catch-all 404 Route */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;
