import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid2 as Grid,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Paper,
  Chip,
  useTheme,
} from '@mui/material';
import { Sun, Moon, Monitor, Key, Shield, Info, Sparkles } from 'lucide-react';
import { useColorMode } from '../context/ThemeContext';
import { useSocket } from '../context/SocketContext';
import StatCard from '../components/ui/StatCard';

const SettingsPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { mode, toggleMode } = useColorMode();
  const { isConnected } = useSocket();

  const shortcuts = [
    { key: 'Ctrl + K', label: 'Open Command Palette & Global Spotlight' },
    { key: 'ESC', label: 'Close Modals, Command Palette & Drawers' },
    { key: 'Tab', label: 'Navigate Table & Form Controls' },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
          System Settings & Preferences
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Customize UI theme, view keyboard shortcuts, and review system runtime health.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Theme Preferences */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: '20px', p: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontFamily: "'Outfit', sans-serif" }}>
                Aesthetics & Theme Selection
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Select your preferred workspace theme token palette.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Paper
                  onClick={() => toggleMode('dark')}
                  elevation={0}
                  sx={{
                    flex: 1,
                    p: 2.5,
                    borderRadius: '16px',
                    cursor: 'pointer',
                    bgcolor: '#0b0f19',
                    color: '#ffffff',
                    border: '2px solid',
                    borderColor: mode === 'dark' ? 'primary.main' : 'transparent',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Moon size={24} color="#818cf8" style={{ marginBottom: 8 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Dark Mode (Linear)
                  </Typography>
                </Paper>

                <Paper
                  onClick={() => toggleMode('light')}
                  elevation={0}
                  sx={{
                    flex: 1,
                    p: 2.5,
                    borderRadius: '16px',
                    cursor: 'pointer',
                    bgcolor: '#f8fafc',
                    color: '#0f172a',
                    border: '2px solid',
                    borderColor: mode === 'light' ? 'primary.main' : 'divider',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Sun size={24} color="#f59e0b" style={{ marginBottom: 8 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Light Slate Mode
                  </Typography>
                </Paper>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Current Workspace Theme
                </Typography>
                <Chip label={mode.toUpperCase()} size="small" color="primary" sx={{ fontWeight: 700 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Keyboard Shortcuts */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: '20px', p: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontFamily: "'Outfit', sans-serif" }}>
                Keyboard Shortcuts
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Fast productivity actions built into the SaaS engine.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {shortcuts.map((sc, idx) => (
                  <Paper
                    key={idx}
                    elevation={0}
                    sx={{
                      p: 1.8,
                      borderRadius: '12px',
                      bgcolor: 'action.hover',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {sc.label}
                    </Typography>
                    <Chip label={sc.key} size="small" sx={{ fontWeight: 700, fontFamily: 'monospace' }} />
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System & Architecture Info */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ borderRadius: '20px', p: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontFamily: "'Outfit', sans-serif" }}>
                System Architecture & Live Services
              </Typography>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', bgcolor: 'action.hover' }}>
                    <Typography variant="caption" color="text.secondary">
                      REALTIME SOCKET.IO ENGINE
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: isConnected ? 'success.main' : 'error.main' }}>
                      {isConnected ? 'Connected — Live' : 'Offline'}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', bgcolor: 'action.hover' }}>
                    <Typography variant="caption" color="text.secondary">
                      UI FRAMEWORK & STACK
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      React 18 + MUI v6 + Vite
                    </Typography>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', bgcolor: 'action.hover' }}>
                    <Typography variant="caption" color="text.secondary">
                      BACKEND DATABASE & SERVER
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Node Express + MongoDB
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPage;
