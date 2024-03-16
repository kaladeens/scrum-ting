import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import * as Constants from '../constants';
import { API_URL } from '../constants/index';
import './styles/Backlog.css';
function UserList() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const { user } = useContext(UserContext);

    
    
    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await axios.get(`${API_URL}/users/`);
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users", error);
            }
        }
        fetchUsers();
    }, []);

    const handleDelete = async (userId, username) => {
        const confirmation = window.confirm(`Are you sure you want to delete user: ${username}?`);
        if (!confirmation) {
            return; // Exit the function if the user clicks "Cancel"
        }
    
        try {
            await axios.delete(`${API_URL}/users/${userId}/`);
            setUsers(users.filter(user => user.user_id !== userId));
        } catch (error) {
            console.error("Error deleting user", error);
        }
    };
    

    const handleUpdate = async (user) => {
        try {
            const response = await axios.put(`${API_URL}/users/${user.user_id}/`, user);
            // Updates the local state with the updated user
            const updatedUsers = users.map(u => u.user_id === user.user_id ? response.data : u);
            setUsers(updatedUsers);
        } catch (error) {
            console.error("Error updating user", error);
        }
        };


        return (
            <div style={{width: '90%', margin: '0 auto'}}>
                {(!user || user.role !== 'admin') ? (
                    <div>You do not have permission to access this page.</div>
                ) : (
                    <>
                        <h2>User List</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Role</th>
                                    <th>Assigned sprint ID</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.user_id}>
                                        <td>{user.username}</td>
                                        <td>{user.role}</td>
                                        <td>{user.sprint_id}</td>
                                        <td>
                                            <button className='button' onClick={() => setSelectedUser(user)}>Edit</button>
                                            <button className='button' onClick={() => handleDelete(user.user_id, user.username)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {selectedUser && (
                            <div>
                                <h3>Edit User</h3>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleUpdate(selectedUser);
                                }}>
                                    <div>
                                        <label>Username: </label>
                                        <input 
                                            type="text" 
                                            value={selectedUser.username} 
                                            onChange={(e) => setSelectedUser({...selectedUser, username: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label>Password: </label>
                                        <input 
                                            type="password" 
                                            placeholder="Change password (leave blank to keep current password)"
                                            onChange={(e) => setSelectedUser({...selectedUser, password: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label>Role: </label>
                                        <select 
                                            value={selectedUser.role} 
                                            onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="user">User</option>
                                        </select>
                                    </div>
                                    <button type="submit">Update</button>

                                </form>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
                            }        
export default UserList;
