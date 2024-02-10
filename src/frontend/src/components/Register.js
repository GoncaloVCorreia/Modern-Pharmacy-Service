import React, { useState } from 'react';
import axios from 'axios';

import './Register.css'; // Import CSS file for styling

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if any of the fields are empty
    if (!name || !email || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    // Submit the form
    try {
      const requestData = new FormData();
      requestData.append('email', email);
      requestData.append('username', name);
      requestData.append('password', password);

      const response = await axios.post('http://django-env.eba-qjp8nisp.us-east-1.elasticbeanstalk.com/register/', requestData);
      console.log('Registration successful:', response.data);

      // Reset form fields and error message
      setName('');
      setEmail('');
      setPassword('');
      setErrorMessage('');
    } catch (error) {
      console.error('Registration failed:', error);
      setErrorMessage('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <span className="input-label">Name:</span>
            <input type="text" value={name} onChange={handleNameChange} />
          </label>
        </div>
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
  );
}

export default Register;
