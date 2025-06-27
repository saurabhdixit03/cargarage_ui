import React, { useState } from "react";
import { registerAdmin } from "../../services/adminService";
import { Link, useNavigate } from "react-router-dom";
import Navbar from '../../components/MinimalNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateName = (value) => {
    if (!value.trim()) {
      setNameError("Name is required.");
      return false;
    } else if (value.trim().length < 3 || !/^[a-zA-Z\s]+$/.test(value)) {
      setNameError("Name must be at least 3 characters and contain only letters.");
      return false;
    }
    setNameError("");
    return true;
  };

  const validateEmail = (value) => {
    if (!value.trim()) {
      setEmailError("Email is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Invalid email format.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (value) => {
    if (!value.trim()) {
      setPasswordError("Password is required.");
      return false;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(value)) {
      setPasswordError("Password must contain uppercase, lowercase, number & 6+ chars.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const isFormValid = () => {
    return name && email && password && !nameError && !emailError && !passwordError;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isNameValid || !isEmailValid || !isPasswordValid) return;

    try {
      const response = await registerAdmin({ name, email, password });

      if (response.message === "Admin registered successfully") {
        toast.success("Registration successful! 🎉 Redirecting to login...", {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });
        setTimeout(() => {
          navigate("/admin/login");
        }, 2000);
      } else {
        toast.error("Registration failed. Please try again.", {
          position: "top-right",
          theme: "dark",
        });
      }
    } catch (error) {
      const message = error.response?.data?.message || "Unexpected error. Please try again.";
      toast.error(message, {
        position: "top-right",
        theme: "dark",
      });
    }
  };

  return (
    <div style={{
        backgroundImage: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
      minHeight: '100vh',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Navbar />
      <ToastContainer />
      <div className="container d-flex flex-column align-items-center justify-content-center" style={{ flex: 1 }}>
        <div className="card p-4 shadow-lg rounded-4 bg-light mt-5" style={{ width: "100%", maxWidth: "450px" }}>
          <h2 className="text-center fw-bold mb-4">Admin Register</h2>
          <form onSubmit={handleRegister} noValidate>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  validateName(e.target.value);
                }}
              />
              {nameError && <small className="text-danger">{nameError}</small>}
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
              />
              {emailError && <small className="text-danger">{emailError}</small>}
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
              />
              {passwordError && <small className="text-danger">{passwordError}</small>}
            </div>
            <div className="d-grid">
              <button className="btn btn-primary fw-bold" type="submit" disabled={!isFormValid()}>
                Register
              </button>
            </div>
          </form>
          <div className="text-center mt-3">
            <p>
              Already have an account?{" "}
              <Link to="/admin/login" className="text-decoration-none fw-bold text-primary">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
