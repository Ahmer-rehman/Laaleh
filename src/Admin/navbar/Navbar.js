import React, { useState, useEffect } from 'react';
import './Navbar.css';
import laaleh from "../assets/laaleh.svg";
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

const Navbar = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState('');
    const auth = getAuth();

    // Function to handle user logout
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/'); // Redirect to the login page after logout
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setUserEmail(user.email);
            } else {
                setUserEmail('');
            }
        });
        return () => unsubscribe();
    }, [auth]);

    const handleDashboardClick = () => {
        navigate('/');
    };

    const handleOrderManagementClick = () => {
        navigate('/Order');
    };

    return (
        <div className="navbar">
            <div className="top-bar">
                <div className="logo-container">
                    <img src={laaleh} alt="Company Logo" className="logo" />
                    <h1 className="cms-heading">Content Management System</h1>
                    <div className="nav-item" onClick={handleDashboardClick}>Dashboard</div>
                    <div className="nav-item" onClick={handleOrderManagementClick}>Order Management</div>
                    <div style={{textAlign:"right"}} className="user-email">{userEmail}</div> 
                    {userEmail && <button className="logout-btn" onClick={handleLogout}>Logout</button>}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
