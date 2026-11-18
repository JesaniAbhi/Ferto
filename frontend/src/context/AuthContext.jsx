import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('ferto_token'));
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('ferto_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            let data = {};
            const text = await response.text();
            if (text) {
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    // Ignore parsing error for non-JSON response
                }
            }

            if (!response.ok) {
                throw new Error(data.message || 'Login failed. Invalid username or password.');
            }
            
            setToken(data.token);
            setUser({ username: data.username, email: data.email, role: data.role });
            localStorage.setItem('ferto_token', data.token);
            localStorage.setItem('ferto_user', JSON.stringify({ username: data.username, email: data.email, role: data.role }));
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (username, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            let data = {};
            const text = await response.text();
            if (text) {
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    // Ignore parsing error for non-JSON response
                }
            }

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed.');
            }
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('ferto_token');
        localStorage.removeItem('ferto_user');
    };

    const fetchWithAuth = async (url, options = {}) => {
        const headers = {
            ...options.headers
        };
        
        if (options.body && !(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const res = await fetch(url, { ...options, headers });
            if (res.status === 401) {
                logout(); // Auto-logout if token is expired/invalid
                throw new Error('Session expired. Please log in again.');
            }
            return res;
        } catch (err) {
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{ token, user, loading, error, login, register, logout, fetchWithAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
