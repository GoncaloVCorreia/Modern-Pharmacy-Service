import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import axios from 'axios';

function OnGoing() {
  const { authorized, username, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ongoingRequests, setOngoingRequests] = useState([]);

  useEffect(() => {
    if (authorized) {
      fetchOngoingRequests();
    }
  }, [authorized]);

  const fetchOngoingRequests = async () => {
    try {
      const response = await axios.get('http://django-env.eba-qjp8nisp.us-east-1.elasticbeanstalk.com/ongoing/'); 
      setOngoingRequests(response.data.running_instances);
    } catch (error) {
      console.error('Failed to fetch ongoing requests:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!authorized) {
    return <Link to="/login">Please log in</Link>;
  }

  return (
    <div className="ongoing-requests-container">
      <nav>
        <h2 className="welcome-text">Welcome, {username}!</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </nav>

      <div className="ongoing-requests-content">
        <h2>Ongoing Requests</h2>
        {ongoingRequests.length > 0 ? (
          <ul>
            {ongoingRequests.map((request) => (
              <li key={request.executionArn}>
                <div>
                  <strong>Order Id:</strong> {request.executionArn}
                </div>
                <div>
                  <strong>Current State:</strong> {request.currentState}
                </div>
                <div>
                  <strong>Fetching this drugs:</strong> {request.currentInput}
                </div>
                <div>
                  <strong>Operation:</strong> {request.operation} 
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No ongoing requests found.</p>
        )}
      </div>
    </div>
  );
}

export default OnGoing;
