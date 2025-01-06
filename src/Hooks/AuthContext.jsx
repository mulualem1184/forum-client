import React, { createContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check localStorage for a token on initial load
  useEffect(() => {
    const token = localStorage.getItem('user-token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Login function
  const login = (token) => {
    localStorage.setItem('user-token', token); // Save the token to localStorage
    setIsLoggedIn(true);
  };

  useEffect(() => {
    console.log(`Authentication state updated: isLoggedIn = ${isLoggedIn}`);
    
  }, [isLoggedIn]);
  // Logout function
  const logout = () => {
    
    localStorage.removeItem('user-token'); // Remove the token from localStorage
    setIsLoggedIn(false); // Update state
    console.log(`Authentication state updated: isLoggedIn = ${isLoggedIn}`);
  };

  // Debugging/logging when `isLoggedIn` changes

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
