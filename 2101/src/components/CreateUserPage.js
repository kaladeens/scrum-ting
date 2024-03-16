import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import { API_URL } from '../constants/index';
function CreateUserPage() {
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [role, setRole] = useState('');

    const { user } = useContext(UserContext);

    if (!user || user.role !== 'admin') {
        return <div>You do not have permission to access this page.</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/users/`, {
                username: newUsername,
                password: newPassword,
                role: role
            });
            if (response.status === 200) {
                window.alert("Created user successfully");
            } else {
                // Handle any other responses
            }
        } catch (error) {
            console.error("Error creating user", error);
            window.alert("Something went wrong, check console for debug");
        }
    };

    return (
        <div>
            <h2>Create User</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={newUsername} 
                    onChange={(e) => setNewUsername(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
                <button type="submit">Create</button>
            </form>
        </div>
    );
}

export default CreateUserPage;
