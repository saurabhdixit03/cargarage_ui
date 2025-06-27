import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/33.png';

const MinimalNavbar = () => {
    return (
        <nav className="navbar-custom" style={{ background: 'linear-gradient(to right, rgb(0, 0, 0), rgb(0, 0, 0))', height: '70px' }}>
            <div className="container-fluid d-flex justify-content-center align-items-center px-4">
                <Link className="navbar-brand p-0 m-0" to="/">
                    <img src={logo} alt="Logo" style={{ height: '50px', maxWidth: '100%', objectFit: 'contain' }} />
                </Link>
            </div>
        </nav>
    );
};

export default MinimalNavbar;
