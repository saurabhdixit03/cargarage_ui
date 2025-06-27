import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/33.png';
import { logoutAdmin } from "../services/adminService";
import { toast } from 'react-toastify';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa'; // profile + logout icons

const Navbar = () => {
    const handleLogout = async () => {
        await logoutAdmin();
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
            window.location.replace("/admin/login");
        }, 2000);
    };

    return (
        <nav className="navbar-custom" style={{ background: 'linear-gradient(to right, rgb(0, 0, 0), rgb(0, 0, 0))', height: '70px' }}>
            <div className="container-fluid d-flex justify-content-between align-items-center px-4">
                <Link className="navbar-brand p-0 m-0" to="/">
                    <img src={logo} alt="Logo" style={{ height: '50px', maxWidth: '100%', objectFit: 'contain' }} />
                </Link>
                <div className="d-flex align-items-center">
                   
                    <button onClick={handleLogout} className="btn btn-link text-white p-0" style={{ fontSize: '1.4rem' }}>
                        <FaSignOutAlt title="Logout" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

