// src/context/ThemeContext.js
import React, { createContext, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ value, children }) => (
    <ThemeContext.Provider value={value}>
        {children}
    </ThemeContext.Provider>
);

export const useTheme = () => useContext(ThemeContext);
