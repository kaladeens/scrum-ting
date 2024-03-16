import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useHistory
import { UserContext } from './UserContext';
import './styles/Navbar.css';

function Navbar() {
    const { user, setUser } = useContext(UserContext);
    const history = useNavigate(); 
    
    const handleLogout = () => {
        setUser(null);
        history('/login');
    };


    return (
        <div className='navbar-container'>
            <nav className='navbar'>
                <Link to="/">Home</Link>
                {user !== null && <Link to="/backlog">Backlog</Link>}
                {user !== null && <Link to="/sprint">Sprint Board</Link>}
                {user && user.role === 'admin' && <Link to="/userlist">User List</Link>}
                {user && user.role === 'admin' && <Link to="/create-user">Create User</Link>}
                {user !== null ? (
                    <button onClick={handleLogout}>Logout</button>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </nav>
        </div>
    );
}

export default Navbar;
