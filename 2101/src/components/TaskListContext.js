/* handles fetching of tasks from backend and manages drap/drop context  
passing admin userId displays full backlog
*/
import { API_URL } from '../constants/index';
import React, { useState, useEffect, useContext } from 'react';
import TaskModal from './TaskModal';
import axios from 'axios';
import { UserContext } from './UserContext';
import TaskList from './TaskList';
import { DragDropContext } from 'react-beautiful-dnd';
import * as Constants from '../constants';

/* !TODO: implement userId filtering */ 

const TaskListContext = ({ userId, key }) => {
    const [tasks, setTasks] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [taskModal, setTaskModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [user, setUser] = useState(userId);

    useEffect(() => {
        fetch(Constants.API_URL_TASKS)
            .then((res) => res.json())
            .then((data) => setTasks(data))
            .catch((err) => console.error('Failed to fetch tasks:', err));
        async function fetchUsers() {
            try {
                const response = await axios.get(Constants.API_URL_USERS);
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users", error);
            }
        }
    }, []);

    // Function to open the edit task modal
    const openEditModal = (task) => {
        setIsEditing(true);
        setTaskToEdit(task);
        setTaskModal(true);
    };

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
        fetchTasks();
    };

    const handleEditClick = (task) => {
        openEditModal(task);
    };

    // Function to fetch tasks from the backend
    const fetchTasks = () => {
        fetch(Constants.API_URL_TASKS)
            .then((res) => res.json())
            .then((data) => setTasks(data))
            .catch((err) => console.error('Failed to fetch tasks:', err));
    };

    const handleOnDragEnd = (result) => {
        // Check if the drag operation was completed successfully
        if (!result.destination) {
            return; // No destination, no action needed
        }

        // Get the source and destination indices from the result
        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        // Make a copy of the tasks array to avoid mutating state directly
        const updatedTasks = [...tasks];

        // Reorder the tasks in the updatedTasks array based on the drag-and-drop result
        const [draggedTask] = updatedTasks.splice(sourceIndex, 1); // Remove the dragged task
        updatedTasks.splice(destinationIndex, 0, draggedTask); // Insert it at the new position

        // Update the state with the new order of tasks
        setTasks(updatedTasks);
        updateTaskOrder(updatedTasks);
    }

    const updateTaskOrder = async (newOrder) => {
        try {
            let response;
                console.log(newOrder)
                console.log(JSON.stringify(newOrder))
                response = await fetch(`${API_URL}/tasks/replace_data/`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newOrder),
                    });
                if (!response.ok) {
                    throw new Error(`Backend returned code ${response.status}, body: ${await response.text()}`);
                }
                if (response.ok) {
                } else {
                    throw new Error(`Backend returned code ${response.status}, body: ${await response.text()}`);
                }
        } catch (err) {
            console.error(`Failed to update task order:`, err);
        }
    }
    

    return (
        <div>
            <DragDropContext onDragEnd={handleOnDragEnd}> 
                <div>
                    <TaskList listId={userId} tasks={tasks} handleTaskClick={handleEditClick} sprint={0}/>
                </div>
            </DragDropContext>
            {taskModal && isEditing && (
                <TaskModal
                    task={taskToEdit}
                    onClose={handleCloseModal}
                    isNewTask={false} // For editing an existing task
                />
            )}
        </div>
    )
}

export default TaskListContext;