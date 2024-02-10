import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Prescription from './Prescription';
import './Profile.css'; // Import CSS file for styling

function Profile() {
  const { authorized, username, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authorized) {
    return <Link to="/login">Please log in</Link>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <nav>
        <h2 className="welcome-text">Welcome, {username}!</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </nav>

      <div className="profile-content">
        <Link className="prescription-link" to="/profile/prescription">Prescription</Link>
      </div>
    </div>
  );
}

export default Profile;
