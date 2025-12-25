import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Optionally verify token with backend
            checkAuthStatus();
        } else {
            setLoading(false);
        }
    }, []);

    const checkAuthStatus = React.useCallback(async () => {
        try {
            console.log('Checking auth status...');
            const token = localStorage.getItem('token');
            const response = await api.get('/auth/profile');
            setUser(response.data);
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    }, []);

    const login = React.useCallback(async (email, password, userType = 'user') => {
        setAuthError('');
        try {
            const response = await api.post('/auth/login', { email, password, userType });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                setUser(response.data.user);
                return { success: true };
            }
        } catch (error) {
            setAuthError(error.response?.data?.message || 'Login failed. Please try again.');
            return { success: false };
        }
    }, []);

    const logout = React.useCallback(() => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        setAuthError('');
    }, []);

    const updateUser = React.useCallback((userData) => {
        setUser(userData);
    }, []);

    const value = React.useMemo(() => ({
        user,
        loading,
        authError,
        login,
        logout,
        updateUser
    }), [user, loading, authError, login, logout, updateUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
