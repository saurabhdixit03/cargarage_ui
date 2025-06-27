import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/33.png'; // Ensure the path is correct
import { logoutUser } from "../services/userService";
import { toast } from 'react-toastify';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';


const UserNavbar = ({ userName }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.info("Logged out successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
  
      setTimeout(() => {
        window.location.replace("/");
      }, 2000);
    } catch (error) {
      toast.error("Logout failed!");
    }
  };
  

  return (
    <nav className="navbar navbar-expand-lg p-0" 
      style={{ background: 'linear-gradient(to right, rgb(0, 0, 0), rgb(0, 0, 0))', height: '70px' }}> {/* Fixed navbar height */}
      
      <div className="container-fluid d-flex justify-content-between align-items-center px-3">
        {/* Logo */}
        <Link className="navbar-brand p-0 m-0" to="/">
          <img 
            src={logo} 
            alt="Logo" 
            style={{ 
              height: '50px',  /* Adjust size to fit within navbar */
              maxWidth: '100%', 
              objectFit: 'contain' 
            }} 
          />
        </Link>

        {/* Navigation Links */}
        <div className="d-none d-lg-flex align-items-center gap-4">
         {/* <Link className="text-white text-decoration-none" to="/user/dashboard">Home</Link> */}
          
          <Link className="text-white text-decoration-none" to="/user/dashboard/Browseservice">Services</Link>
          <Link className="text-white text-decoration-none" to="/user/dashboard/faceliftKits">FaceliftKits</Link>
          <Link className="text-white text-decoration-none" to="/user/dashboard/Discounts">Discounts</Link>
          <Link className="text-white text-decoration-none" to="/user/dashboard/servicebookings">My Bookings</Link>

          {/* <Link className="text-white text-decoration-none" to="/user/dashboard/Mybookings">My Bookings</Link> */}
          <Link className="text-white text-decoration-none" to="/user/dashboard/ContactUs">Contact Us</Link>
          <Link className="text-white text-decoration-none" to="/user/dashboard/usercars">My Cars</Link>
          <Link to="/user/dashboard/profile" className="text-white" style={{ fontSize: '1.4rem' }}>
    <FaUserCircle title="Profile" />
  </Link>
  <button onClick={handleLogout} className="btn btn-link text-white p-0" style={{ fontSize: '1.4rem' }}>
    <FaSignOutAlt title="Logout" />
  </button>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
