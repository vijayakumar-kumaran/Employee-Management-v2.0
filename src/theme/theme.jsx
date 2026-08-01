import { createTheme } from '@mui/material/styles';

export const getCustomTheme = (mode = 'dark') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#6366f1', // Indigo Linear/Stripe accent
        light: '#818cf8',
        dark: '#4f46e5',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#06b6d4', // Cyan accent
        light: '#22d3ee',
        dark: '#0891b2',
        contrastText: '#ffffff',
      },
      background: {
        default: isDark ? '#0b0f19' : '#f8fafc', // Linear Slate / Soft Light Slate
        paper: isDark ? '#111827' : '#ffffff',   // Dark card slate / pure white card
        subtle: isDark ? '#1f2937' : '#f1f5f9',
      },
      text: {
        primary: isDark ? '#f9fafb' : '#0f172a',
        secondary: isDark ? '#9ca3af' : '#475569',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.8)',
      action: {
        hover: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.04)',
        selected: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)',
      },
      success: {
        main: '#10b981',
      },
      warning: {
        main: '#f59e0b',
      },
      error: {
        main: '#ef4444',
      },
    },
    typography: {
      fontFamily: "'Inter', 'Outfit', sans-serif",
      h1: { fontFamily: "'Outfit', sans-serif", fontWeight: 800 },
      h2: { fontFamily: "'Outfit', sans-serif", fontWeight: 700 },
      h3: { fontFamily: "'Outfit', sans-serif", fontWeight: 700 },
      h4: { fontFamily: "'Outfit', sans-serif", fontWeight: 700 },
      h5: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
      h6: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? '#0b0f19' : '#f8fafc',
            color: isDark ? '#f9fafb' : '#0f172a',
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '10px',
            padding: '8px 18px',
            boxShadow: 'none',
            fontWeight: 600,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: isDark
                ? '0 4px 20px rgba(99, 102, 241, 0.3)'
                : '0 4px 14px rgba(79, 70, 229, 0.18)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            backgroundColor: isDark ? '#111827' : '#ffffff',
            backgroundImage: 'none',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.8)'}`,
            boxShadow: isDark
              ? '0 4px 20px rgba(0, 0, 0, 0.4)'
              : '0 4px 20px rgba(15, 23, 42, 0.03)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? '#111827' : '#ffffff',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(241, 245, 249, 1)'}`,
            padding: '14px 16px',
            fontSize: '0.875rem',
          },
          head: {
            fontWeight: 600,
            color: isDark ? '#9ca3af' : '#64748b',
            backgroundColor: isDark ? 'rgba(17, 24, 39, 0.8)' : 'rgba(248, 250, 252, 0.8)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: '8px',
          },
        },
      },
    },
  });
};

export default getCustomTheme('dark');
