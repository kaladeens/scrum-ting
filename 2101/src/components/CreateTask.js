import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from './UserContext';
import './styles/CreateTask.css';
import '../constants/index'
import { API_URL } from '../constants/index';

const CreateTask = () => {
    const [name, setName] = useState('');
    const [taskType, setTaskType] = useState('Story');
    const [storyPoints, setStoryPoints] = useState(5);
    const [tags, setTags] = useState([]);
    const [assignedTo, setAssignedTo] = useState(0);
    const [description, setDescription] = useState('');
    const [currentState, setCurrentState] = useState('Planning');
    const [showPopup, setShowPopup] = useState(false);

    const [allUsers, setAllUsers] = useState([])
    useEffect(() => {
            fetch(`${API_URL}/users/`) // Adjust this URL to your actual endpoint if different
            .then((res) => res.json())
            .then((data) => setAllUsers(data))
            .catch((err) => console.error('Failed to fetch users:', err));
    }, []);
    const { users } = useContext(UserContext) || {};
    const handleTagsChange = (event) => {
        const selectedUsers = Array.from(event.target.selectedOptions, option => option.value);
        setTags(selectedUsers);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const taskData = {
            name: name,
            task_type: taskType,
            story_points: storyPoints,
            description: description,
            status: "Not started",  // Set this to the appropriate value if "Not started" isn't the default
            tags: tags,
            assigned_to: assignedTo
        };

        try {
            const response = await fetch(`${API_URL}/tasks/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });

            if (!response.ok) {
                throw new Error(`Backend returned code ${response.status}, body: ${await response.text()}`);
            }

            const responseData = await response.json();
            if (response.ok) {
                setShowPopup(true);
            } else {
                throw new Error(`Backend returned code ${response.status}, body: ${await response.text()}`);
            }

            console.log('Task created:', responseData);
        } catch (err) {
            console.error('Failed to create task:', err);
        }
        console.log('Task created: ', taskData);
    };



    const Popup = ({ onClose }) => (
        <div className="popup">
            <div className="popup-content">
                Task created successfully!
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
    return (
        <div className="create-task-form">
            {showPopup && <Popup onClose={() => setShowPopup(false)} />}

            <form onSubmit={handleSubmit}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Task Name" />
                <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
                    <option value="Story">Story</option>
                    <option value="Bug">Bug</option>
                </select>
                <input type="number" min="0" max="10" value={storyPoints} onChange={(e) => setStoryPoints(e.target.value)} />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"></textarea>
                <button type="submit">Create Task</button>
            </form>
        </div>
    );
};

export default CreateTask;