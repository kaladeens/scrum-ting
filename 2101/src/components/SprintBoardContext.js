import React, { useState, useEffect, useContext } from 'react';
import TaskModal from './TaskModal';
import axios from 'axios';
import { UserContext } from './UserContext';
import TaskList from './TaskList';
import { DragDropContext } from 'react-beautiful-dnd';
import * as Constants from '../constants';
import './styles/Backlog.css';
import { API_URL } from '../constants/index';
/* !TODO: implement userId filtering */

const SprintBoardContext = ({sprintId}) => {
    const [sprints, setSprints] = useState([]);
    const [selectedSprintId, setSelectedSprintId] = useState(null);
    const [sprintName, setSprintName] = useState(null);

    const [tasks, setTasks] = useState([]);
    const [tasksToDo, setTasksToDo] = useState([]);
    const [tasksInProgress, setTasksInProgress] = useState([]);
    const [tasksDone, setTasksDone] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [taskModal, setTaskModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const { user } = useContext(UserContext);

    const [key, setKey] = useState(0); // Used to force a re-render of the component


    useEffect(() => {
        if (user && user.role !== 'admin') {
            getUserSprint(); // Trigger getUserSprint when user is available
        }
        fetch(Constants.API_URL_SPRINTS)
            .then((res) => res.json())
            .then((data) => setSprints(data))
            .catch((err) => console.error('Failed to fetch tasks:', err));
            /* for testing */
            
        async function fetchUsers() {
            try {
                const response = await axios.get(Constants.API_URL_USERS);
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users", error);
            }
        }
        fetchUsers();
        if (selectedSprintId) {
            fetchTasks();
        }
    }, [selectedSprintId]);

    const fetchSprints = async () => {
        fetch(Constants.API_URL_SPRINTS)
            .then((res) => res.json())
            .then((data) => setSprints(data))
            .catch((err) => console.error('Failed to fetch tasks:', err));
    };


    const fetchTask= async (task_id) =>{
        console.log(task_id)
        try {
            let response = await fetch(`${API_URL}/tasks/${task_id}/`);
            if (!response.ok) {
              throw new Error('Failed to fetch task data');
            }
        
            let data = await response.json();
            return data; // Return the fetched data directly
          } catch (error) {
            console.error('Error fetching task data:', error);
            return null; // Return null or handle the error appropriately
          }
    }
    // const chooseSprint = (event) => {
    //     setSprintId(event.target.value);
    //     setSprintTasks();
    // }

    const setSprintTasks = () => {
        console.log(sprints[sprintId])
        setTasks(sprints[sprintId].tasks);
        setTasksByStatus();
    }

    const setTasksByStatus = (tasksData) => {
        let tasksToDo = [];
        let tasksInProgress = [];
        let tasksDone = [];
        
        for(let i=0; i<tasksData.length; i++) {
            let task = tasksData[i];
            if (task.status === 'Not started') {
                tasksToDo.push(task);
            } else if (task.status === 'In progress') {
                tasksInProgress.push(task);
            } else if (task.status === 'Completed') {
                tasksDone.push(task);
            }
        };
    
        // Deduplicate tasksToDo
        tasksToDo = [...new Set(tasksToDo.map(task => task.task_id))]
            .map(taskId => tasksToDo.find(task => task.task_id === taskId));
    
        // Deduplicate tasksInProgress
        tasksInProgress = [...new Set(tasksInProgress.map(task => task.task_id))]
            .map(taskId => tasksInProgress.find(task => task.task_id === taskId));
    
        // Deduplicate tasksDone
        tasksDone = [...new Set(tasksDone.map(task => task.task_id))]
            .map(taskId => tasksDone.find(task => task.task_id === taskId));
    
        setTasksToDo(tasksToDo);
        setTasksInProgress(tasksInProgress);
        setTasksDone(tasksDone);
    }
    
    

    // Function to open the edit task modal
    const openEditModal = (task) => {
        setIsEditing(true);
        setTaskToEdit(task);
        setTaskModal(true);
    };

    const handleSprintChange = (event) => {
        setSelectedSprintId(event.target.value);

        // Clear the old content for the selected sprint
        setTasks([]);
        setTasksToDo([]);
        setTasksInProgress([]);
        setTasksDone([]);
        

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
        fetchSprints();
        setKey((prevKey) => prevKey + 1);
        fetchTasks();
    };

    const handleEditClick = (task) => {
        openEditModal(task);
    };

    // Function to fetch tasks from the backend
    // Function to fetch tasks from the backend


    const fetchTasks = async () => {
        if (selectedSprintId === null || isNaN(selectedSprintId) ) {
            setTasksToDo([]);
            setTasksInProgress([]);
            setTasksDone([]);
            return;
        }
        await fetch(`${API_URL}/sprints/${selectedSprintId}`)
          .then((res) => res.json())
          .then((data) => {
            // if (!Array.isArray(data)) {
            //   console.error('Expected fetched data to be an array, but got:', data);
            //   return;
            // }

            setTasksToDo([]);
            setTasksInProgress([]);
            setTasksDone([]);
            async function getTasks (){
                
                let this_tasks = await [];
                console.log("Fetched sprint:", data);
                for (let i = 0; i < data.tasksToDo.length; i++) {
                    
                    await fetchTask(data.tasksToDo[i])
                    .then((task) => {
                        this_tasks.push(task);
                    });
                    
                }
                for( let i = 0; i < data.tasksInProgress.length; i++) {
                    await fetchTask(data.tasksInProgress[i]).then((task) => {
                        this_tasks.push(task);
                    })
                }
                for (let i = 0; i < data.tasksDone.length; i++) {
                    await fetchTask(data.tasksDone[i]).then((task) => {
                        this_tasks.push(task);
                    })            }
                // Now set the new data
                console.log(this_tasks)
                await setTasks(this_tasks); 
                await setTasksByStatus(this_tasks);  // Pass the data directly
            }
            getTasks();
          })
          .catch((err) => console.error('Failed to fetch tasks:', err));
      };
    

    const handleOnDragEnd = (result) => {
        const { source, destination } = result;
    
        // Backup the current state in case we need to revert
        const originalTasksToDo = [...tasksToDo];
        const originalTasksInProgress = [...tasksInProgress];
        const originalTasksDone = [...tasksDone];
        // Ensure uniqueness
        const uniqueTasksToDo = Array.from(new Set(tasksToDo.map(task => task.task_id)));
        const uniqueTasksInProgress = Array.from(new Set(tasksInProgress.map(task => task.task_id)));
        const uniqueTasksDone = Array.from(new Set(tasksDone.map(task => task.task_id)));
        // If there's no destination or the source and destination are the same, return early
        if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
            return;
        }
    
        const sourceTasksCopy = Array.from(getListByDroppableId(source.droppableId));
        const [draggedTask] = sourceTasksCopy.splice(source.index, 1);
    
        if (source.droppableId === destination.droppableId) {
            // Reordering within the same list
            sourceTasksCopy.splice(destination.index, 0, draggedTask);
            updateListByDroppableId(source.droppableId, sourceTasksCopy);
        } else {
            // Moving between lists
            const destinationTasksCopy = Array.from(getListByDroppableId(destination.droppableId));
            destinationTasksCopy.splice(destination.index, 0, draggedTask);
            updateListByDroppableId(source.droppableId, sourceTasksCopy);
            updateListByDroppableId(destination.droppableId, destinationTasksCopy);
        }
    
        const updatedOrder = {
            tasksToDo: uniqueTasksToDo,
            tasksInProgress: uniqueTasksInProgress,
            tasksDone: uniqueTasksDone
        };
         // Update the task's status based on the destination list
        if (destination.droppableId === '1') {
            draggedTask.status = 'Not started';
        } else if (destination.droppableId === '2') {
            draggedTask.status = 'In progress';
        } else if (destination.droppableId === '3') {
            draggedTask.status = 'Completed';
        }
    
        fetch(`${API_URL}/sprints/${selectedSprintId}`)
        .then(response => response.json())
        .then(data => {
            const updatedData = {
                ...data,
                tasksToDo: updatedOrder.tasksToDo,
                tasksInProgress: updatedOrder.tasksInProgress,
                tasksDone: updatedOrder.tasksDone
            };
    
            return fetch(`${API_URL}/sprints/${selectedSprintId}/update_task_order/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData)
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to update task order.");
            }
            return response.json();
        })
        .then(updatedSprint => {
            console.log("Updated successfully:", updatedSprint);
        })
        .catch(error => {
            console.error("Error updating task order:", error);
    
            // Revert to the original state if there's an error
            setTasksToDo(originalTasksToDo);
            setTasksInProgress(originalTasksInProgress);
            setTasksDone(originalTasksDone);
        });
         // After updating the frontend state, send the updated task status to the backend
    fetch(`${API_URL}/tasks/${draggedTask.task_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(draggedTask)  // Send the updated task object
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to update task status.");
        }
        return response.json();
    })
    .then(updatedTask => {
        console.log("Task status updated successfully:", updatedTask);
    })
    .catch(error => {
        console.error("Error updating task status:", error);
    });
};
    

    
    const getUserSprint = async () => {
        try {
            const response = await fetch(`${API_URL}/sprints/user/${user.user_id}`);
            if (!response.ok) {
                console.error('Failed to fetch user sprint');
                setSprintName('Sprint not found'); // Handle the case when the user's sprint is not found
            } else {
                const data = await response.json();
                setSelectedSprintId(data.sprint_id);
                setSprintName(data.name);
            }
        } catch (error) {
            console.error('Error fetching user sprint:', error);
            setSprintName('Sprint not found'); // Handle the case when an error occurs
        }
    };
    
    

    const getListByDroppableId = (droppableId) => {
        switch(droppableId) {
            case '1':
                return tasksToDo;
            case '2':
                return tasksInProgress;
            case '3':
                return tasksDone;
            default:
                return []; // Default empty list for unrecognized droppableId
        }
    };

    const updateListByDroppableId = (droppableId, newList) => {
        switch(droppableId) {
            case '1':
                setTasksToDo(newList);
                break;
            case '2':
                setTasksInProgress(newList);
                break;
            case '3':
                setTasksDone(newList);
                break;
            default:
                break; // No action for unrecognized droppableId
        }
    };

    /*TODO: Need to make it so that we can still view sprint even as a dev just your own though */

    return (
        <div>
                
            {user && user.role === 'admin' ? (
                <div className="sprint-select-container">
                    <label htmlFor="sprintDropdown" className="label">
                        Select a Sprint:
                    </label>
                    <select
                        id="sprintDropdown"
                        value={selectedSprintId}
                        onChange={handleSprintChange}
                        className="select"
                        style={{ width: '200px' }} // Set the width to 50px using inline style
                    >
                        <option value={null}>Select a Sprint</option>
                        {sprints.map((sprint) => (
                            <option key={sprint.sprint_id} value={sprint.sprint_id}>
                                {sprint.name}
                            </option>
                        ))}
                    </select>

                </div>
            ) : (
                // Render sprint name for non-admin users
                
                <div>
                    
                    <h1>{user && getUserSprint() && sprintName}</h1>
                    
                </div>
            )}
            {selectedSprintId && (  // This ensures that the board is only displayed if a sprint is selected.
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <div style={{ width: '400px', flex: '1', padding: '16px', justifyContent: 'left' }}>
                            <h2>Tasks To Do</h2>
                            <TaskList listId={'1'} tasks={tasksToDo} handleTaskClick={handleEditClick} sprint={selectedSprintId} />
                        </div>
                        <div style={{ width: '400px', flex: '1', padding: '16px', justifyContent: 'left' }}>
                            <h2>Tasks In Progress</h2>
                            <TaskList listId={'2'} tasks={tasksInProgress} handleTaskClick={handleEditClick} sprint={selectedSprintId}/>
                        </div>
                        <div style={{ width: '400px', flex: '1', padding: '16px', justifyContent: 'left' }}>
                            <h2>Tasks Done</h2>
                            <TaskList listId={'3'} tasks={tasksDone} handleTaskClick={handleEditClick} sprint={selectedSprintId} />
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
            )}
        </div>
    )
                }    
export default SprintBoardContext;
