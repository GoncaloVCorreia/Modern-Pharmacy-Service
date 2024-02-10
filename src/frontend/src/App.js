import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import { AuthProvider } from './components/AuthContext';
import Prescription from './components/Prescription';
import NavBar from './components/NavBar';
import Payment from './components/Payment';
import Success from './components/Success';
import Failed from './components/Failed';
import './App.css';
import OnGoing from './components/OnGoing.js'

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavBar />
   
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/prescription" element={<Prescription />} />
            <Route path="/prescription/payment" element={<Payment />} />
            <Route path="/success" element={<Success />} />
            <Route path="/failed" element={<Failed />} />
            <Route path="/ongoing" element={<OnGoing />} />
          
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
