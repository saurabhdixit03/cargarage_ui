import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul className="sidebar-list">
        <li className="sidebar-item"><Link to="/admin-dashboard">Admin Dashboard</Link></li>
        <li className="sidebar-item"><Link to="/user-dashboard">User Dashboard</Link></li>
        <li className="sidebar-item"><Link to="/service-management">Manage Services</Link></li>
        <li className="sidebar-item"><Link to="/appointment-management">Manage Appointments</Link></li>
        <li className="sidebar-item"><Link to="/customer-management">Manage Customers</Link></li>
      </ul>
    </aside>
  );
}

export default Sidebar;
