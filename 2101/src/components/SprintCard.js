import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import './styles/Backlog.css';
import * as Constants from '../constants';
import './styles/TaskCard.css'
import { API_URL } from '../constants/index';
const SprintCard = ({ sprint }) => {
    const cardStyle = {
        width: '200px',
        display: 'flex',
        flexDirection: 'column',
        border: '2px solid #ccc', // Border style
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
        margin: '10px',
    };
    return (
        <div>
            <Card sx={cardStyle}>
                <CardContent>
                    <div className='task-content'>
                        <div style={{ flex: 1 }}>
                            <Typography variant="h6" component="div">
                                {sprint.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Sprint ID: </strong> {sprint.sprint_id}<br />
                                <strong>Start date: </strong> {sprint.start_date}<br />
                                <strong>End date: </strong> {sprint.end_date}<br />
                                <strong>Status:</strong> {sprint.status}<br />
                            </Typography>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default SprintCard;
