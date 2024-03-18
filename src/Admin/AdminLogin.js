import React, { useState } from 'react';
import './Style/Login.css'; 
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link } from 'react-router-dom'; // Import Link component for navigation
import app from './Firebase/Firebase';
import laaleh from "./assets/laaleh.svg"

const auth = getAuth(app);

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const handleAdminLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      let newErrors = [];
      if (error.code === "auth/weak-password") {
        newErrors.push("Weak password. Your password should be at least 6 characters long.");
      } else if (error.code === "auth/email-already-in-use") {
        newErrors.push("Email already in use. Please use a different email address.");
      } else {
        newErrors.push("An unexpected error occurred. Please try again later.");
      }
      setErrors(newErrors);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAdminLogin();
  };

  return (
    <div className="container">
      <div className="login-card">
        <div className="logo-container">
          <img src={laaleh} alt="Laleh Women's Dresses Logo" className="logo" />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'black', textAlign: 'center', textTransform: 'uppercase', fontFamily: 'Arial, sans-serif', letterSpacing: '2px', margin: '20px 0' }}>
          Content Management System
        </h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button style={{ color: "white", backgroundColor: "black" }} type="submit">Login</button>
        </form>
        {errors.length > 0 && (
          <div className="error-message">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/Signup" style={{ textDecoration: 'none', color: '#b33771', fontWeight: 'bold' }}>Sign up for a new admin account</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
