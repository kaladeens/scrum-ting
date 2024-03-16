import React from 'react';
import {Link, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'



// Import your components
import Navbar from './components/Navbar';  // <-- Import the Navbar
import LoginPage from './components/LoginPage';
import CreateUserPage from './components/CreateUserPage';
import HomePage from './components/HomePage';
import { UserProvider } from './components/UserContext';
import UserList from './components/UserList';
import CreateTask from './components/CreateTask';
import ProductBacklog from './components/ProductBacklog';
import TetrisBackground from './components/CompleteTetrisComponent'
import FontFace from './components/Fontface';
import SprintComponent from './components/SprintManager';
import logo from './components/tetra.png';

function App() {
    const linkStyle = {
        textDecoration: 'none',
        color: 'inherit', 
    };
    return (
      <UserProvider>
        <TetrisBackground />
        <Router>
            <div>
                <Link to="/" style={linkStyle}>
                    <img src={logo} alt="Tetra Logic PM" />
                </Link>
                <Navbar />  {/* <-- Use the Navbar here */}
                <div style={{ padding: '10px'}} />
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/create-user" element={<CreateUserPage />} />
                    <Route path="/userlist" element={<UserList />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/backlog" element={<ProductBacklog />} />
                    <Route path="/sprint" element={<SprintComponent/>} />

                    {/* Add more routes as needed */}
                </Routes>
               
            </div>

                </Router>
        </UserProvider>
    );
}

export default App;
