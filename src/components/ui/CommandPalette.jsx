import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  TextField,
  InputAdornment,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Search,
  LayoutDashboard,
  Users,
  CheckSquare,
  Calendar,
  Clock,
  Building2,
  Settings,
  Sun,
  Moon,
  LogOut,
  UserPlus,
  FileText,
} from 'lucide-react';
import { useColorMode } from '../../context/ThemeContext';

const CommandPalette = ({ open, onClose, onLogout, userRole = 'admin' }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode, toggleMode } = useColorMode();
  const [query, setQuery] = useState('');

  // Handle Ctrl+K / Cmd+K listener globally
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) onClose();
        else onClose(); // parent handles toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const navActions = [
    { title: 'Dashboard Overview', icon: LayoutDashboard, path: '/', section: 'Navigation' },
    { title: 'Employee Directory', icon: Users, path: userRole === 'admin' ? '/show-all' : '/profile', section: 'Navigation' },
    { title: 'Task Workspace', icon: CheckSquare, path: '/task-management', section: 'Navigation' },
    { title: 'Leave Center', icon: Calendar, path: '/leave-management', section: 'Navigation' },
    { title: 'Attendance Tracker', icon: Clock, path: '/attendance-management', section: 'Navigation' },
    { title: 'Organization Structure', icon: Building2, path: '/organization', section: 'Navigation' },
    { title: 'System Settings', icon: Settings, path: '/settings', section: 'Navigation' },
  ];

  if (userRole === 'admin') {
    navActions.push({ title: 'Add New Employee', icon: UserPlus, path: '/create-employee', section: 'Admin Tools' });
    navActions.push({ title: 'Assign New Task', icon: FileText, path: '/create-task', section: 'Admin Tools' });
  }

  const systemActions = [
    {
      title: `Switch Theme to ${mode === 'dark' ? 'Light' : 'Dark'} Mode`,
      icon: mode === 'dark' ? Sun : Moon,
      action: () => toggleMode(),
      section: 'Quick Preferences',
    },
  ];

  const allItems = [...navActions, ...systemActions];

  const filteredItems = allItems.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item) => {
    onClose();
    if (item.path) {
      navigate(item.path);
    } else if (item.action) {
      item.action();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          bgcolor: theme.palette.mode === 'dark' ? '#111827' : '#ffffff',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
          overflow: 'hidden',
        },
      }}
    >
      <Box sx={{ p: 2, pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
        <TextField
          autoFocus
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a command or search page..."
          variant="standard"
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} style={{ opacity: 0.6 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Chip label="ESC" size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
              </InputAdornment>
            ),
            sx: { fontSize: '1rem', py: 0.5 },
          }}
        />
      </Box>

      <DialogContent sx={{ p: 1, maxHeight: 380, overflowY: 'auto' }}>
        {filteredItems.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="body2">No matching commands found.</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filteredItems.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <ListItemButton
                  key={idx}
                  onClick={() => handleSelect(item)}
                  sx={{
                    borderRadius: '10px',
                    mb: 0.5,
                    py: 1.2,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 38, color: 'primary.main' }}>
                    <IconComp size={18} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    {item.section}
                  </Typography>
                </ListItemButton>
              );
            })}
          </List>
        )}
      </DialogContent>

      <Box sx={{ p: 1.5, px: 2, bgcolor: 'action.hover', borderTop: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">
          Tip: Press <kbd style={{ background: 'rgba(150,150,150,0.2)', padding: '2px 6px', borderRadius: '4px' }}>Ctrl + K</kbd> anytime
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          ApexHR SaaS v2.0
        </Typography>
      </Box>
    </Dialog>
  );
};

export default CommandPalette;
