import React, { useState } from "react";
import { loginUser } from "../../services/userService";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "../../components/MinimalNavbar";

const UserLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      const response = await loginUser({ email, password });

      if (response.status === 200) {
        toast.success("Login successful! Redirecting...");
        localStorage.setItem("userEmail", email);
        setTimeout(() => navigate("/user/dashboard"), 2000);
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Invalid email or password.";
      toast.error(message);
    }
  };

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <ToastContainer position="top-right" autoClose={1500} />
      <div className="container-fluid d-flex flex-column align-items-center justify-content-center" style={{ flex: 1 }}>
        <div
          className="card shadow-lg border-0 rounded-4 bg-light p-5 mt-4"
          style={{ width: "100%", maxWidth: "450px" }}
        >
          <h3 className="text-center fw-bold mb-3 text-dark">User Login</h3>
          <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
            <input
              type="email"
              className="form-control"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary w-100 fw-semibold">
              Login
            </button>
          </form>
          <p className="text-center mt-3">
            Don't have an account?{" "}
            <Link to="/user/register" className="text-decoration-none fw-bold text-primary">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
