import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Login from './Login';
import Register from './Register';

function Home() {
  return (
  
      <div>
        <h1>Welcome to Home!</h1>
        <nav>
          <ul>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        </nav>
    
      </div>
 
  );
}

export default Home;
