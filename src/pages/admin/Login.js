import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginAdmin } from "../../services/adminService";
import Navbar from '../../components/MinimalNavbar';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.", { theme: "colored" });
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Password must be at least 6 characters.", { theme: "colored" });
      return;
    }

    try {
      const response = await loginAdmin({ email, password });

      if (response.status === 200) {
        localStorage.setItem("adminEmail", email);
        toast.success("Login successful! Redirecting...", {
          theme: "colored",
          autoClose: 1000,
        });
        setTimeout(() => navigate("/admin/dashboard"), 1200);
      } else {
        toast.error("Login failed. Please try again.", { theme: "colored" });
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message, { theme: "colored" });
      } else {
        toast.error("Invalid email or password.", { theme: "colored" });
      }
    }
  };

  return (
    <div style={{
      backgroundImage: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container d-flex justify-content-center align-items-center flex-grow-1">
        <div className="card shadow-lg border-0 rounded-4 bg-light p-5" style={{ maxWidth: '400px', width: '100%' }}>
          <h3 className="text-center mb-4 fw-bold text-dark">Admin Login</h3>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control rounded-3"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control rounded-3"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 rounded-3">Login</button>
          </form>
          <p className="text-center mt-3">
            Don't have an account? <Link to="/register" className="text-decoration-none fw-semibold">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
