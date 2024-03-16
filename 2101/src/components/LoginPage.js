import axios from 'axios';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import './styles/LoginPage.css';
import { API_URL } from '../constants/index';
function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setUser  } = useContext(UserContext); // Access the setUser function from context
    const navigate = useNavigate(); // Hook for programmatic navigation

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/login`, {
                username,
                password
            });
            if (response.data.message === "Login successful!") {
                const userRole = response.data.role; // Assuming the backend returns the role
                const userId = response.data.user_id;
                setUser({ username, role: userRole ,user_id: userId}); // Set both username and role in context
                navigate('/'); // Redirect to dashboard
            } else {
                window.alert("Login unsuccessful. Please try again.");
            }
        } catch (error) {
            console.error("Error during login", error);
            window.alert("An error occurred during login. Please try again.");
        }
    };
    

    return (
        <div className='login-page'>
            <form onSubmit={handleSubmit} className='form'>
                <h2>Welcome!</h2>
                <input
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default LoginPage;
