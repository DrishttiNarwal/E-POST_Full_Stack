import React, { useState } from "react";
import { Link } from "react-router-dom";


export const Navbar = () => {
    const toggleDropdown = (): void => setShowDropdown((prev) => !prev);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    return (
    <nav className="navbar">
    <div className="logo">E-POST</div>
    <div className="nav-right">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li className="dropdown-container" id="dropdowncontainer" onClick={toggleDropdown}>
          <a href="#">Login/SignUp</a>
          {showDropdown && (
            <ul className="dropdown-menu">
              <li><Link to="/login" id="login">Login</Link></li>
              <li><Link to="/signup" id="signup">Sign Up</Link></li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  </nav>
  );
}