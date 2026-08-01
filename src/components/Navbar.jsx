import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Tooltip,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Search,
  Sun,
  Moon,
  LogOut,
  User,
  Settings,
  Sparkles,
  Wifi,
  WifiOff,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NotificationCenter from './ui/NotificationCenter';
import { useColorMode } from '../context/ThemeContext';
import { useSocket } from '../context/SocketContext';
import CommandPalette from './ui/CommandPalette';

const Navbar = ({ onLogout, openSidebar, setOpenSidebar }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { mode, toggleMode } = useColorMode();
  const { isConnected } = useSocket();

  const user = useSelector((state) => state.user);
  const userName = user?.username || 'User';

  const [profileAnchor, setProfileAnchor] = useState(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const handleLogout = () => {
    setProfileAnchor(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('isLoggedIn');
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: isDark ? 'rgba(11, 15, 25, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 }, minHeight: '64px !important' }}>
          {/* Brand Logo & Sidebar Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {setOpenSidebar && (
              <IconButton
                onClick={() => setOpenSidebar(!openSidebar)}
                sx={{
                  color: 'text.primary',
                  borderRadius: '10px',
                  bgcolor: 'action.hover',
                  p: 1,
                }}
              >
                {openSidebar ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
              </IconButton>
            )}

            <Box
              component="div"
              onClick={() => navigate('/')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                }}
              >
                <Sparkles size={22} color="#ffffff" />
              </Box>

              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    fontFamily: "'Outfit', sans-serif",
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Apex<span style={{ color: '#6366f1' }}>HR</span>
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.675rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                  }}
                >
                  ENTERPRISE V2
                </Typography>
              </Box>
            </Box>

            {/* Socket connection pill */}
            <Tooltip title={isConnected ? 'Real-time WebSocket Live' : 'Reconnecting WebSocket'}>
              <Box
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  gap: 0.8,
                  px: 1.2,
                  py: 0.4,
                  borderRadius: '999px',
                  bgcolor: isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid',
                  borderColor: isConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                  ml: 1,
                }}
              >
                {isConnected ? <Wifi size={13} color="#10b981" /> : <WifiOff size={13} color="#ef4444" />}
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    color: isConnected ? '#10b981' : '#ef4444',
                  }}
                >
                  {isConnected ? 'LIVE' : 'OFFLINE'}
                </Typography>
              </Box>
            </Tooltip>
          </Box>

          {/* Center Search / Command Palette Trigger */}
          <Box
            onClick={() => setCommandPaletteOpen(true)}
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1.5,
              px: 2,
              py: 0.8,
              borderRadius: '14px',
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.04)',
              border: '1px solid',
              borderColor: 'divider',
              cursor: 'pointer',
              width: 320,
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.06)',
              },
            }}
          >
            <Search size={16} color="#9ca3af" />
            <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, fontSize: '0.85rem' }}>
              Search or command...
            </Typography>
            <Typography
              variant="caption"
              sx={{
                px: 0.8,
                py: 0.2,
                borderRadius: '6px',
                bgcolor: 'action.hover',
                fontWeight: 700,
                fontSize: '0.7rem',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              Ctrl+K
            </Typography>
          </Box>

          {/* Right Action Icons & Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={() => setCommandPaletteOpen(true)}
              sx={{ display: { xs: 'flex', md: 'none' }, color: 'text.secondary' }}
            >
              <Search size={20} />
            </IconButton>

            {/* Dark/Light Mode Toggle */}
            <Tooltip title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}>
              <IconButton onClick={toggleMode} sx={{ color: 'text.secondary' }}>
                {isDark ? <Sun size={20} color="#f59e0b" /> : <Moon size={20} color="#6366f1" />}
              </IconButton>
            </Tooltip>

            {/* Floating Notification Center */}
            <NotificationCenter />

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 1.5 }} />

            {/* User Avatar Menu */}
            <Box
              onClick={(e) => setProfileAnchor(e.currentTarget)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                cursor: 'pointer',
                p: 0.5,
                borderRadius: '12px',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'primary.main',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                }}
              >
                {userName.charAt(0).toUpperCase()}
              </Avatar>

              <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: '0.85rem' }}>
                  {userName}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', textTransform: 'capitalize' }}>
                  {user?.role || 'Member'}
                </Typography>
              </Box>
            </Box>

            <Menu
              anchorEl={profileAnchor}
              open={Boolean(profileAnchor)}
              onClose={() => setProfileAnchor(null)}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: '16px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  border: '1px solid',
                  borderColor: 'divider',
                  p: 0.5,
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  setProfileAnchor(null);
                  navigate('/profile');
                }}
                sx={{ borderRadius: '10px', py: 1 }}
              >
                <ListItemIcon>
                  <User size={18} />
                </ListItemIcon>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  My Profile
                </Typography>
              </MenuItem>

              <MenuItem
                onClick={() => {
                  setProfileAnchor(null);
                  navigate('/settings');
                }}
                sx={{ borderRadius: '10px', py: 1 }}
              >
                <ListItemIcon>
                  <Settings size={18} />
                </ListItemIcon>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Settings
                </Typography>
              </MenuItem>

              <Divider sx={{ my: 0.5 }} />

              <MenuItem onClick={handleLogout} sx={{ borderRadius: '10px', py: 1, color: 'error.main' }}>
                <ListItemIcon sx={{ color: 'error.main' }}>
                  <LogOut size={18} />
                </ListItemIcon>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Sign Out
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Global Command Palette */}
      <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </>
  );
};

export default Navbar;
