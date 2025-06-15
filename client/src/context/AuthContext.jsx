// context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [role, setRole] = useState(localStorage.getItem('role') || null);
    const [username, setUsername] = useState(localStorage.getItem('username') || '');

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('username', username);
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('username');
        }
    }, [token, role, username]);

    const login = (newToken, newRole, newUsername) => {
        setToken(newToken);
        setRole(newRole);
        setUsername(newUsername);
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        setUsername(null);
    };

    const value = {
        token,
        role,
        username,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;