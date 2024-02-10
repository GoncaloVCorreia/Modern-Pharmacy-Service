import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <div className="nav-item" onClick={handleHomeClick}>
          <Link to="/" className="navbar-title">
            Home
          </Link>
        </div>
        <li className="nav-item">
          <NavLink to="/login" className="nav-link" activeClassName="active-link">
            Login
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/register" className="nav-link" activeClassName="active-link">
            Register
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/profile" className="nav-link" activeClassName="active-link">
            Profile
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/ongoing" className="nav-link" activeClassName="active-link">
            Ongoing Requests
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
