import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { registerUser } from "../../services/userService";
import 'react-toastify/dist/ReactToastify.css';
import MinimalNavbar from '../../components/MinimalNavbar';

const UserRegister = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

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

  const validateMobile = (value) => {
    if (!value.trim()) {
      setMobileError("Mobile number is required.");
      return false;
    } else if (!/^\d{10}$/.test(value)) {
      setMobileError("Mobile number must be 10 digits.");
      return false;
    }
    setMobileError("");
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

  const validateAddress = (value) => {
    if (!value.trim()) {
      setAddressError("Address is required.");
      return false;
    }
    setAddressError("");
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
    return (
      name && mobile && email && address && password &&
      !nameError && !mobileError && !emailError && !addressError && !passwordError
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const isNameValid = validateName(name);
    const isMobileValid = validateMobile(mobile);
    const isEmailValid = validateEmail(email);
    const isAddressValid = validateAddress(address);
    const isPasswordValid = validatePassword(password);

    if (!isNameValid || !isMobileValid || !isEmailValid || !isAddressValid || !isPasswordValid) return;

    try {
      const response = await registerUser({ name, mobile, email, address, password });

      if (response?.message?.toLowerCase().includes("registered successfully")) {
        toast.success("🎉 Registration successful! Redirecting to login...", {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error(response?.message || "Registration failed. Try again.", {
          position: "top-right",
          theme: "colored",
        });
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMsg, {
        position: "top-right",
        theme: "colored",
      });
    }
  };

  return (
    <div style={{
      backgroundImage: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <MinimalNavbar />
      <ToastContainer />
      <div className="container d-flex flex-column align-items-center justify-content-center" style={{ flex: 1, paddingTop: '4rem' }}>
        <div className="card shadow-lg border-0 rounded-4 p-4" style={{ width: '100%', maxWidth: '500px', backgroundColor: '#f8f9fa' }}>
          <h3 className="text-center fw-bold mb-3">Create Your Account</h3>
          <form onSubmit={handleRegister} noValidate className="d-flex flex-column gap-3">
            <div>
              <input
                type="text"
                className="form-control"
                placeholder="Full Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  validateName(e.target.value);
                }}
              />
              {nameError && <small className="text-danger">{nameError}</small>}
            </div>
            <div>
              <input
                type="text"
                className="form-control"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                  validateMobile(e.target.value);
                }}
              />
              {mobileError && <small className="text-danger">{mobileError}</small>}
            </div>
            <div>
              <input
                type="email"
                className="form-control"
                placeholder="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
              />
              {emailError && <small className="text-danger">{emailError}</small>}
            </div>
            <div>
              <input
                type="text"
                className="form-control"
                placeholder="Address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  validateAddress(e.target.value);
                }}
              />
              {addressError && <small className="text-danger">{addressError}</small>}
            </div>
            <div>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
              />
              {passwordError && <small className="text-danger">{passwordError}</small>}
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold"
              disabled={!isFormValid()}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
