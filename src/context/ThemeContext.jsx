import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getCustomTheme } from '../theme/theme';

const ColorModeContext = createContext({
  mode: 'dark',
  setMode: () => {},
  toggleMode: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('appThemeMode');
    if (savedMode) return savedMode;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('appThemeMode', mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  const toggleMode = (newMode) => {
    if (newMode) {
      setMode(newMode);
    } else {
      setMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
    }
  };

  const theme = useMemo(() => getCustomTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={{ mode, setMode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
