import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

// Create the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user info is already saved in localStorage when the app loads
    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Login Action
    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        // The secure cookie is automatically set by the browser here
        setUser(response.data);
        localStorage.setItem('userInfo', JSON.stringify(response.data));
    };

    // Register Action
    const register = async (userData) => {
        const response = await api.post('/auth/register', userData);
        setUser(response.data);
        localStorage.setItem('userInfo', JSON.stringify(response.data));
    };

    // Logout Action
    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    // NEW: Listen for changes across different tabs
    useEffect(() => {
        const syncAuthState = (e) => {
            // e.key tells us which localStorage item changed
            if (e.key === 'userInfo') {
                if (e.newValue) {
                    // Another tab logged in, update this tab too
                    setUser(JSON.parse(e.newValue));
                } else {
                    // Another tab logged out, log this tab out too
                    setUser(null);
                }
            }
        };

        window.addEventListener('storage', syncAuthState);
        
        // Cleans up the listener when the component unmounts
        return () => window.removeEventListener('storage', syncAuthState);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};