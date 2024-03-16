
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import TaskCard from './TaskCard';
import { API_URL } from '../constants/index';
import FirstTimeLogin from './FirstTimeLogin';

function HomePage() {
    const [userTasks, setUserTasks] = useState([]);
    const { user } = useContext(UserContext);  // Assuming you have a UserContext that provides the current user.
    const [firstTimeLogin, setFirstTimeLogin] = useState(true); // TODO change to false

    useEffect(() => {

        if (user) {
            fetch(`${API_URL}/tasks/user/${user.user_id}`)
                .then((res) => res.json())
                .then((data) => {
                    setUserTasks(data);
                })
                .catch((err) => console.error('Failed to fetch tasks:', err));
            if (user.first_time_login) {
                setFirstTimeLogin(true);
                /* TODO: Set first-time-login to false in the backend */
            }
            setFirstTimeLogin(true); //remove
        }
    }, [user]);

    const closeFirstTimeLogin = () => {
        console.log('closed')
        setFirstTimeLogin(false);
    }

    return (
        <div className="homepage">
            <h1>Welcome to Our Task Management System</h1>
            <p>This platform allows you to manage tasks, sprints, and users effectively.</p>
    
            {user ? (
                <div className="user-info">
                    <h2>Hello, {user.username}!</h2>
                    <p>Your role: {user.role}</p>
    
                    {/* Display tasks assigned to the user */}
                    <div className="user-tasks-card">
                        <h3>Your Tasks</h3>
                        {userTasks.length > 0 ? (
                            userTasks.map(task => (
                                <TaskCard key={task.task_id} task={task} />
                            ))
                        ) : (
                            <p>No tasks assigned to you yet.</p>
                        )}
                    </div>
                </div>
            ) : (
                <p>Please log in to access more features.</p>
            )}
            {firstTimeLogin && user && (
                <FirstTimeLogin onClose={closeFirstTimeLogin}/>
            )}
        </div>
    );
    
            }

export default HomePage;
