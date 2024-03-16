import React, { useState, useContext, useEffect } from 'react';
import './styles/TaskModal.css';
import { UserContext } from './UserContext';
import { API_URL } from '../constants/index';
import ErrorPopUp from './ErrorPopUp';
const SprintModal = ({ sprint, onClose, isNewSprint }) => {
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('Not started');
    const [sprintId, setSprintId] = useState(0);
    const [storyPoints, setStoryPoints] = useState(5);
    const [showPopup, setShowPopup] = useState(false);
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    // If it's an existing task (edit mode), initialize the form fields with the task data
    useEffect(() => {
        console.log('sprint fetched: ', sprint);
        if (sprint) {
            setSprintId(sprint.sprint_id);
            setName(sprint.name);
            setStartDate(sprint.start_date);
            setEndDate(sprint.end_date);
            setStatus(sprint.status);

        }
    }, [sprint]);

    const handleSubmit = async (e) => {
        console.log('handle submit called');
        e.preventDefault();
        const sprintData = {
            name: name,
            start_date: startDate,
            end_date: endDate,
            status: status,

        };

        try {
            let response;
            if (isNewSprint) {
                // Create a new task using POST request
                response = await fetch(`${API_URL}/sprints/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(sprintData),
                });
                console.log('json string sent: ', JSON.stringify(sprintData));
            } else {
                console.log('sprint editing not implemented yet, lol');
            }
    
            if (!response.ok) {
                let details = await response.json();
                console.log('details: ', details);
                let error = await details.detail;
                let msg = [];
                for (let i = 0; i < error.length; i++) {
                    msg.push(error[i].msg);
                }
                console.log("ms",msg)
                setShowError(true);
                setError(msg);
                throw new Error(`Backend returned code ${response.status}, body: ${await response.text()}`);
            }
    
            const responseData = await response.json();
            if (response.ok) {
                setShowPopup(true);
            } else {
                throw new Error(`Backend returned code ${response.status}, body: ${await response.text()}`);
            }
    
            console.log(`Task ${isNewSprint ? 'created' : 'updated'}:`, responseData);
            onClose();

        } catch (err) {
            console.error(`Failed to ${isNewSprint ? 'create' : 'update'} task:`, error);
        }
    
    };

    return (
        <div className="taskmodal">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>{isNewSprint ? 'Create Sprint' : 'Edit Sprint'}</h2>
                
                <div>
                    <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                    />
                </div>
                <br />
                /* fill in rest of vars */
                <div>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <br />
                <button className='button' onClick={handleSubmit}>{isNewSprint ? 'Submit' : 'Save'}</button>
            </div>
            {showError
             && (<ErrorPopUp errors={error} onClose={() => {setShowError(false);setError("")}} />)}
        </div>
    );
}
    
export default SprintModal;