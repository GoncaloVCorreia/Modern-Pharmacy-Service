import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

import './Login.css'; // Import CSS file for styling

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  let navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleClick = async (event) => {
    event.preventDefault();

    // Check if any of the fields are empty
    if (!email || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    // Submit the form
    try {
      const requestData = new FormData();
      requestData.append('email', email);
      requestData.append('password', password);
      console.log(requestData);

      const response = await axios.post('http://django-env.eba-qjp8nisp.us-east-1.elasticbeanstalk.com/login/', requestData);
      if (response.data.success) {
        const username = response.data.user.username;
        login(username);
        navigate('/profile');
      } else {
        // Login failed
        setErrorMessage(response.data.message);
        console.error('Login failed:', response.data.message);
      }
    } catch (error) {
      setErrorMessage('Failed to login. Please try again.');
      console.error('Failed to login:', error);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleClick}>
          <div>
            <label>
              <span className="input-label">Email:</span>
              <input type="email" value={email} onChange={handleEmailChange} />
            </label>
          </div>
          <div>
            <label>
              <span className="input-label">Password:</span>
              <input type="password" value={password} onChange={handlePasswordChange} />
            </label>
          </div>
          <button type="submit">Submit</button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default Login;
