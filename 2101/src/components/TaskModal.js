import React, { useState, useContext, useEffect } from 'react';
import './styles/TaskModal.css';
import { UserContext } from './UserContext';
import { API_URL } from '../constants/index';

const TaskModal = ({ task, onClose, isNewTask }) => {
    const [name, setName] = useState('');
    const [taskType, setTaskType] = useState('Story');
    const [storyPoints, setStoryPoints] = useState(5);
    const [tags, setTags] = useState([]);
    const [assignedTo, setAssignedTo] = useState(0);
    const [description, setDescription] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [allUsers, setAllUsers] = useState([])
    const [timeSpent, setTimeSpent] = useState(0);
    const [taskId, setTaskId] = useState(0);
    const [taskStatus, setTaskStatus] = useState('Not started');

    const [selectedSprint, setSelectedSprint] = useState(0);
    const [sprints, setSprints] = useState([]);


    // If it's an existing task (edit mode), initialize the form fields with the task data
    useEffect(() => {
        console.log('task fetched: ', task);
        if (task) {
            setTaskId(task.task_id);
            setName(task.name);
            setDescription(task.description);
            setTimeSpent(task.time_spent);
            setTaskStatus(task.status);
            setAssignedTo(task.assigned_to);
            setSelectedSprint(task.sprint_id);
            console.log('selected sprint: ', task.sprint_id);
        } else {
            setName('');
            setTaskType('Story');
            setStoryPoints(5);
            setDescription('');
            setTimeSpent(0);
            setTaskStatus('Not started');
            setAssignedTo(0);
        }

        // Fetch sprints from the backend
        fetch(`${API_URL}/sprints/`)
            .then((res) => res.json())
            .then((data) => setSprints(data))
            .catch((err) => console.error('Failed to fetch sprints:', err));

        // Fetch users from the backend
        fetch(`${API_URL}/users/`)
            .then((res) => res.json())
            .then((data) => setAllUsers(data))
            .catch((err) => console.error('Failed to fetch users:', err));

    }, [task]);

    const { users } = useContext(UserContext) || {};
    const handleTagsChange = (event) => {
        const selectedUsers = Array.from(event.target.selectedOptions, option => option.value);
        setTags(selectedUsers);
    };

    const handleSubmit = async (e) => {
        console.log('handle submit called');
        e.preventDefault();
        const sprintIdAsNumber = parseInt(selectedSprint, 10);
        const taskData = {
            task_id: taskId,
            name: name,
            task_type: taskType,
            story_points: storyPoints,
            description: description,
            status: taskStatus,
            time_spent: timeSpent,
            sprint_id: sprintIdAsNumber,
            assigned_to: assignedTo, 
        };

        /* if assignedTo is null, set it to 0 */
        if (taskData.assigned_to === null) {
            taskData.assigned_to = 0;
        }

        try {
            let response;
            if (isNewTask) {
                // Create a new task using POST request
                response = await fetch(`${API_URL}/tasks/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(taskData),
                });
                console.log('Task created: ', JSON.stringify(taskData));
            } else {
                // Update an existing task using PUT request
                console.log(task.task_id)
                response = await fetch(`${API_URL}/tasks/${task.task_id}/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(taskData),
                });
                console.log('Task updated: ', JSON.stringify(taskData));
            }
    
            if (!response.ok) {
                throw new Error(`Backend returned code ${response.status}, body: ${await response.text()}`);
            }
    
            const responseData = await response.json();
            if (response.ok) {
                setShowPopup(true);
            } else {
                throw new Error(`Backend returned code ${response.status}, body: ${await response.text()}`);
            }
    
            console.log(`Task ${isNewTask ? 'created' : 'updated'}:`, responseData);
        } catch (err) {
            console.error(`Failed to ${isNewTask ? 'create' : 'update'} task:`, err);
        }
    
        onClose();
    };

    return (
        <div className="taskmodal">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>{isNewTask ? 'Create Task' : 'Edit Task'}</h2>
                
                <div>
                    <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                    />
                </div>
                <br />
                
                <div>
                    <select className='form-group-left'
                        value={taskType}
                        onChange={(e) => setTaskType(e.target.value)}>
                        <option value="Story">User Story</option>
                        <option value="Bug">Bug</option>
                    </select>
                    <input className='form-group-right'
                        type="number"
                        min="0" max="10"
                        value={storyPoints}
                        onChange={(e) => setStoryPoints(e.target.value)}
                    />
                </div>
                <br />
                
                <div>
                    <textarea
                        className='description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                    ></textarea>
                </div>
                
                {!isNewTask && (
                    <div>
                        <label>Time spent: </label>
                        <input
                            type="number"
                            min="0" max="99"
                            value={timeSpent}
                            onChange={(e) => setTimeSpent(e.target.value)}
                        />
                    </div>
                )}
                
                <div>
                    <label>Sprint: </label>
                    <select value={selectedSprint} onChange={(e) => {
                        const newValue = e.target.value;
                        console.log('Selected Sprint:', newValue); // Log the selected value
                        setSelectedSprint(newValue);
                    }}>
                        <option value={null}>Backlog</option>
                        {sprints.map(sprint => (
                            <option key={sprint.sprint_id} value={sprint.sprint_id}>{sprint.name}</option>
                        ))}
                    </select>
                </div>

                
                <div>
                    <label>Assign to: </label>
                    <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                        <option value={"0"}>Unassigned</option>
                        {allUsers.map(user => (
                            <option key={user.user_id} value={user.user_id}>{user.username}</option>
                        ))}
                    </select>
                </div>
                
                <br />
                <button className='button' onClick={handleSubmit}>{isNewTask ? 'Submit' : 'Save'}</button>
            </div>
        </div>
    );
                        }
    
export default TaskModal;