import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h2>CarGarage</h2>
      </div>
      <nav>
        <ul className="nav-list">
          <li className="nav-item"><Link to="/">Home</Link></li>
          <li className="nav-item"><Link to="/login">Login</Link></li>
          <li className="nav-item"><Link to="/register">Register</Link></li>
          <li className="nav-item"><Link to="/profile">Profile</Link></li>
          <li className="nav-item"><Link to="/services">Services</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;

