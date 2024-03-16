import React, { useState, useEffect, useContext } from 'react';
import './styles/Backlog.css';
import TaskModal from './TaskModal';
import axios from 'axios';
import { UserContext } from './UserContext';
import TaskList from './TaskList';
import TaskListContext from './TaskListContext'
import { API_URL } from '../constants/index';
const ProductBacklog = () => {
    const [tasks, setTasks] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [taskModal, setTaskModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const { user } = useContext(UserContext);

    const [key, setKey] = useState(0); /* used for rerender */

    useEffect(() => {
        fetch(`${API_URL}/tasks/`)
            .then((res) => res.json())
            .then((data) => setTasks(data))
            .catch((err) => console.error('Failed to fetch tasks:', err));
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

    // Function to open the create task modal
    const openCreateModal = () => {
        setIsEditing(false);
        setTaskToEdit(null);
        setTaskModal(true);
    };

    // Function to handle canceling the modal
    const handleCloseModal = () => {
        setIsEditing(false);
        setTaskToEdit(null);
        setTaskModal(false);
        setKey((k) => k + 1);
    };

    // Function to fetch tasks from the backend
    const fetchTasks = () => {
        fetch(`${API_URL}/tasks/`)
            .then((res) => res.json())
            .then((data) => setTasks(data))
            .catch((err) => console.error('Failed to fetch tasks:', err));
    };

    return (
        <div className="backlog-container">
            <div className="table-header">
                <h2 className='caption'>Backlog</h2>
                <button className="create-task-button" onClick={openCreateModal}>
                    Add Task
                </button>
            </div>
            <div className="task-list">
                {(!user || user.role !== 'admin') ? (
                    <div>You do not have permission to access this page.</div>
                ) : ( 
                    <TaskListContext userId={"1"} key={key} /> 
                )} 
            </div>
            {taskModal && (
                <TaskModal
                    task={null}
                    onClose={handleCloseModal}
                    isNewTask={true} // For editing an existing task
                />
            )}
        </div>
    );
    
};

export default ProductBacklog;
