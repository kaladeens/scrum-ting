import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Constants from '../constants';
import './styles/FirstTimeLogin.css';
import Backlog from './media/backlog.png';
import Homepage from './media/homepage.png';
import Sprintboard from './media/sprintboard.png';
import Taskmodal from './media/taskmodal.png';
import Userlist from './media/userlist.png';
import Thumbsup from './media/thumbsup.jpg';


const FirstTimeLogin = ({ onClose }) => {
    const [currentScreen, setCurrentScreen] = useState(0);

    const screens = [
        {
            title: 'Homepage',
            screenshot: Homepage,
            tips: 'The homepage will show your assigned tasks. You can navigate to the backlog and assigned sprint board from here.If you are an admin, you can also navigate to the user list from here'
        },
        {
            title: 'Product backlog',
            screenshot: Backlog,
            tips: 'The shows all tasks that have not yet been assigned to a sprint. It can give you an idea of what tasks are coming up in the future, and how much work is left to do. You can edit tasks by clicking on them.'
        },
        {
            title: 'Sprint board',
            screenshot: Sprintboard,
            tips: 'The sprint board shows all tasks that have been assigned to a sprint. You can drag and drop tasks between columns to change their status. You can also edit tasks by clicking on them.'
        },
        {
            title: 'Task modal',
            screenshot: Taskmodal,
            tips: 'The task modal shows all the information about a task. You can edit the task here. It is accessed by clicking on a task in the backlog or sprint board.'
        },
        {
            title: 'Congratulations!',
            screenshot: Thumbsup,
            tips: 'You are now ready to have fun on Tetra Logic PM.'
        }
        // Add more screens as needed
    ];

    const nextScreen = () => {
        if (currentScreen < screens.length - 1) {
            setCurrentScreen(currentScreen + 1);
        }
    };

    const prevScreen = () => {
        if (currentScreen > 0) {
            setCurrentScreen(currentScreen - 1);
        }
    };

    return (
        <div className="taskmodal">
            <div className="modal-content">
                <h1>Welcome</h1>
                <img src={screens[currentScreen].screenshot} alt="screenshot" style={{ width: '100%', height: '100%' }} />
                <h2>{screens[currentScreen].title}</h2>
                <button className="close-button" onClick={onClose}>
                    X
                </button>
                <p>{screens[currentScreen].tips}</p>
                <div className="button-container">
                    {currentScreen > 0 && (
                        <button className="page-button" onClick={prevScreen}>
                            Previous
                        </button>
                    )}
                    {currentScreen < screens.length - 1 && (
                        <button className="page-button" onClick={nextScreen}>
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FirstTimeLogin;
