import React from 'react';
import { API_URL } from '../constants/index';
const SprintPopUp = ({ sprint, onClose }) => {
    const popupStyle = {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.2)', // Semi-transparent background
        zIndex: '9999', // Ensure the pop-up is on top of other content
    };

    const sprintStyle = {
        width: '80%', // Adjust the width of the pop-up content as needed
        background: '#fff', // Background color of the pop-up
        padding: '20px',
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
    };

    // Check if there is a selected sprint
    if (!sprint) {
        return null; // If no sprint is selected, don't render anything
    }

    return (
        <div className="sprint-popup" style={popupStyle}>
            <div className='sprint-content' style={sprintStyle}>
                <h3>{sprint.name}</h3>
                <p>Start Date: {sprint.start_date}</p>
                <p>End Date: {sprint.end_date}</p>
                <p>Status: {sprint.status}</p>
        <p>Tasks To Do:</p>
        <p>{sprint.tasksToDo.length}</p>

        {/* <ul>
            {Array.isArray(sprint.tasksToDo) && sprint.tasksToDo.map((task, index) => (
                <li key={index}>{task}</li>
            ))}
        </ul> */}

        <p>Tasks In Progress:</p>
        <p>{sprint.tasksInProgress.length}</p>
        {/* <ul>
            {Array.isArray(sprint.tasksInProgress) && sprint.tasksInProgress.map((task, index) => (
                <li key={index}>{task}</li>
            ))}
        </ul> */}

        <p>Tasks Done:</p>
            <p>{sprint.tasksDone.length}</p>
        {/* <ul>
            {Array.isArray(sprint.tasksDone) && sprint.tasksDone.map((task, index) => (
                <li key={index}>{task}</li>
            ))}
        </ul>
                        {/* Add more details or actions related to the sprint here */}
                        <button onClick={onClose}>Close</button>
                    </div>
                </div> 
            );
        }

export default SprintPopUp;
