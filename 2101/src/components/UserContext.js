import React, { createContext, useState } from 'react';



// Define the shape of the context data
const defaultContextData = {
    user: null,
    user_id: null,
    setUser: () => {}
};

export const UserContext = createContext(defaultContextData);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Change null to { username: 'your name', role: 'your role'
    const [user_id, setUserId] = useState(null);
    return (
        <UserContext.Provider value={{ user, user_id, setUserId, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
