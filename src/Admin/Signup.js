import React, { useState } from 'react';
import "./Style/Signup.css"
import { getAuth, createUserWithEmailAndPassword, } from "firebase/auth";
import  app  from "./Firebase/Firebase"
import { getFirestore } from "firebase/firestore";
import laaleh from "./assets/laaleh.svg"
const auth = getAuth(app);
const db = getFirestore(app);
const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const handleSignUp = async () => {
    const newErrors = [];
    try {
      if (password !== confirmPassword) {
        newErrors.push("Passwords do not match");
      }
      if (newErrors.length === 0) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Create user document in Firestore with role set to "admin"
        await db.collection('users').doc(user.uid).set({
          firstName: firstName,
          lastName: lastName,
          email: email,
          role: "admin" // Set role to "admin" for all signed-up users
        });
        
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setErrors([]);
      } else {
        setErrors(newErrors);
      }
    } catch (error) {
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
    handleSignUp();
  };

  return (
    <div className="container">
      <div className="signup-card">
      <div className="logo-container">
         <img src={laaleh} alt="Laleh Women's Dresses Logo" className="logo" />
         {/* <img src={icon1} alt="Icon 1" className="logo" /> */}
     </div>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        {errors.length > 0 && (
          <div className="error-message">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
