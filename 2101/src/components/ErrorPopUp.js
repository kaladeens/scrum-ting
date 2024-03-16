import React from 'react';
import './styles/ErrorPopUp.css';
const ErrorPopUp = ({ errors, onClose }) => {
    return (
        <div className="pop-up">
            <div className="error">
                <button onClick={onClose}>X</button>
                <h1 style={{ textAlign: 'center', color: 'black' }}>ERROR</h1>
                {errors.map((error, index) => (
                    <h3 key={index}>{error}</h3>
                ))}
            </div>
        </div>
    );
};
export default ErrorPopUp;
