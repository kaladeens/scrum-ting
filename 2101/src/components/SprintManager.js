import React, { useState, useEffect,useContext } from 'react';
// import './styles/SprintComponent.css';
import { UserContext } from './UserContext';
import SprintBoardContext from './SprintBoardContext';
import SprintPopUp from './SprintPopUp';
import SprintCard from './SprintCard';
import SprintModal from './SprintModal';
import './styles/Backlog.css';
import { API_URL } from '../constants/index';
const SprintComponent = () => {
    const [sprints, setSprints] = useState([]);
    const [newSprintName, setNewSprintName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Add state variable for pop-up
    const [popUp, setPopUp] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedSprint, setSelectedSprint] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { user } = useContext(UserContext);

    useEffect(() => {
        // Fetch sprints from the backend
        fetch(`${API_URL}/sprints/`)
            .then((res) => res.json())
            .then((data) => setSprints(data))
            .catch((err) => console.error('Failed to fetch sprints:', err));
    }, []);
     // Function to open the sprint view page
     const openSprint = (sprint) => {
        setIsPopupOpen(true);
        setPopUp(true);
        setSelectedSprint(sprint);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    // Function to close the sprint view page
    const handleCloseModal = () => {
        setIsPopupOpen(false);
        setIsModalOpen(false);
        setSelectedSprint(null);
        fetchSprints();
    };

    const fetchSprints = () => {
        fetch(`${API_URL}/sprints/`)
            .then((res) => res.json())
            .then((data) => setSprints(data))
            .catch((err) => console.error('Failed to fetch sprints:', err));
    }

    return (
        <div className="sprint-component">
            {user && user.role === 'admin' ? (
            <div>
                 <div className="backlog-container">
                    <div className="table-header">
                        <h2 className='caption'>Sprints</h2>
                        <button className="button" onClick={handleOpenModal}>
                            Create New Sprint
                        </button>
                    </div>
                    <div className="sprint-list">
                        <div className='grid'>
                            { sprints.map((sprint) => (
                            <div key={sprint.sprint_id}>
                                {/* Render the sprint name as a clickable element */}
                                {isPopupOpen && (
                                    <SprintPopUp sprint={selectedSprint} onClose={handleCloseModal} />
                                )}
                                <SprintCard sprint={sprint} onClick={() => openSprint(sprint)}/>
                            </div>
                            ))}
                        </div>
                    </div>
                    {isModalOpen && (
                        <SprintModal
                            sprint={null}
                            onClose={handleCloseModal}
                            isNewSprint={true} 
                        />
                    )}
                </div>
                <div>
                    <SprintBoardContext sprintId={selectedSprint ? selectedSprint.sprint_id : null}  />
                </div>
            </div> 
            ) : (
                <SprintBoardContext sprintId={selectedSprint ? selectedSprint.sprint_id : null}  />
            )}
        </div>
    );
};


export default SprintComponent;
