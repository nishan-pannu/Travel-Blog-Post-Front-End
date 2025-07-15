import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import './Navbar.css';


const Navbar = ({ user, isLoggedIn, onLogout, onShowLogin, onShowSignup }) => {
    return (
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>Travel App</h2>
        </div>
        
        <div className="navbar-menu">
          {isLoggedIn ? (
            <div className="navbar-user">
              <span>Welcome, {user.name}!</span>
              <button className="btn-profile">Profile</button>
              <button className="btn-logout" onClick={onLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="navbar-auth">
            <button className="btn-login" onClick={onShowLogin}>
              Login
            </button>
            <button className="btn-signup" onClick={onShowSignup}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;