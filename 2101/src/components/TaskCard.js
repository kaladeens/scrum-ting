import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import './styles/Backlog.css';
import * as Constants from '../constants';
import './styles/TaskCard.css'
import { API_URL } from '../constants/index';
const TaskCard = ({ task, ref }) => {
    const cardStyle = {
        width: '400px',
        display: 'flex',
        flexDirection: 'column',
        border: '2px solid #ccc', // Border style
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
        margin: '10px',
    };
    return (
        <div>
            <Card sx={cardStyle} ref={ref}>
                <CardContent>
                    <div className='task-content'>
                        <div style={{ flex: 1 }}>
                            <Typography variant="h6" component="div">
                                {task.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Task Type:</strong> {task.task_type}<br />
                                <strong>Story Points:</strong> {task.story_points}<br />
                                <strong>Status:</strong> {task.status}<br />
                                {task.assigned_to !== 0 && <strong>Assigned To:</strong>} {task.assigned_to !== 0 && task.assigned_to}<br />
                            </Typography>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div className='description-style'>
                                <Typography variant="body2" color="text.secondary" className='description-style'>
                                    <strong>Description:</strong> {task.description}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default TaskCard;
