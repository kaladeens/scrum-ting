import React, { useState, useEffect, useContext } from 'react';
import './styles/Backlog.css';
import TaskModal from './TaskModal';
import axios from 'axios';
import { UserContext } from './UserContext';
import TaskCard from './TaskCard';
import ButtonBase from '@mui/material/ButtonBase'; // Import ButtonBase
import * as Constants from '../constants';
import { Draggable, Droppable } from 'react-beautiful-dnd';

const TaskList = ( { listId, tasks, handleTaskClick, sprint } ) => {
    return (
        <div className='task-list-bg'>
            <Droppable droppableId={ listId } type="group">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {tasks
                        .filter((task) => {
                            const filtered = task.sprint_id === parseInt(sprint);
                            return filtered;
                        })
                        .map((task, index) => (
                            <div key={task.task_id} className='task-list'>
                            <ButtonBase onClick={() => handleTaskClick(task)}> 
                                <Draggable 
                                draggableId={task.task_id.toString()} 
                                key={task.task_id.toString()} 
                                index={index}
                                >
                                {(provided) => (
                                    <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                                    <div>    
                                        <TaskCard task={task} index={index}/>
                                    </div>
                                    </div>
                                )}
                                </Draggable>
                            </ButtonBase>
                            </div>
                        ))
                        }
                    {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default TaskList;
