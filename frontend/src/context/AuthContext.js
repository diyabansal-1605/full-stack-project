import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode as jwt_decode} from 'jwt-decode';

/*
 * Creating context to manage authentication state.
 * Provides `authState`, `login`, and `logout` functions to its children.
*/ 
export const AuthContext = createContext();

/**
 * AuthProvider component.
 * This component wraps the application to provide authentication functionality.
 * It manages the authentication state (token and user) and provides methods for login and logout.
 */
export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({ token: null, user: null });

    /*
     * useEffect hook to check for a valid token in localStorage on initial render.
     * If a valid token exists, it decodes the token and updates the auth state.
     * If the token is invalid, it removes it from localStorage.
    */
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwt_decode(token);
                console.log('Decoded token:', decoded);
                setAuthState({
                    token,
                    user: decoded, 
                });
            } catch (error) {
                console.error('Invalid token:', error);
                localStorage.removeItem('token');
            }
        }
    }, []);

    /*
     * Logs in a user.
     * @param {string} token - The JWT token received after user authentication.
     * Saves the token in localStorage, decodes it, and updates the auth state.
     */
    const login = (token) => {
        localStorage.setItem('token', token);
        const decoded = jwt_decode(token);
        setAuthState({ token, user: decoded });
    };

    /*
     * Logs out a user.
     * Clears the token from localStorage and resets the auth state to its initial values.
    */
    const logout = () => {
        localStorage.removeItem('token');
        setAuthState({ token: null, user: null });
    };


    return (
        /*
         * provides `authState`, `login`, and `logout` to the children components.
        */
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};