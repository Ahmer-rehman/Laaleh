import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from './Admin/AdminDashboard';
import AdminLogin from './Admin/AdminLogin';
import OrderManagement from "./Admin/Ordermanagement"
import app from './Admin/Firebase/Firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Navbar from './Admin/navbar/Navbar';
import SignUp from './Admin/Signup';

const auth = getAuth(app);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {user ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}
    </Router>
  );
}

const AuthenticatedRoutes = () => {
  const [activeSection, setActiveSection] = useState('');

  return (
    <>
      <Navbar setActiveSection={setActiveSection} />
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/Order" element={<OrderManagement />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

const UnauthenticatedRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin/>} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
