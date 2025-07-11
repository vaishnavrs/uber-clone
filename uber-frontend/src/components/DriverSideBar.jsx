import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/sidebar.css'

function DriverSidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/driver/dashboard">Dashboard</Link></li>
        <li><Link to="/driver/rides">My Rides</Link></li>
        <li><Link to="/driver/profile">Profile</Link></li>
        <li><Link to="/driver/logout">Logout</Link></li>
      </ul>
    </div>
  );
}

export default DriverSidebar;
