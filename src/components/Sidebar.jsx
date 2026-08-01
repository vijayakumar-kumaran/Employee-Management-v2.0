import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Collapse,
  Divider,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  ListOrdered,
  CheckSquare,
  PlusSquare,
  Calendar,
  Clock,
  Building2,
  ChevronDown,
  ChevronRight,
  Settings,
} from 'lucide-react';
import { useSelector } from 'react-redux';

const Sidebar = ({ openSidebar, setOpenSidebar }) => {
  const location = useLocation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const user = useSelector((state) => state.user);

  const [openEmployee, setOpenEmployee] = useState(true);
  const [openTask, setOpenTask] = useState(true);
  const [openLeave, setOpenLeave] = useState(true);

  const isCurrent = (path) => location.pathname === path;

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={openSidebar}
      sx={{
        width: openSidebar ? 280 : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          bgcolor: isDark ? '#0b0f19' : '#ffffff',
          color: 'text.primary',
          borderRight: '1px solid',
          borderColor: 'divider',
          padding: '16px',
          top: '64px',
          height: 'calc(100vh - 64px)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowY: 'auto',
        },
      }}
    >
      {/* User Card */}
      <Box
        sx={{
          p: 2,
          mb: 2,
          borderRadius: '14px',
          bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(15, 23, 42, 0.03)',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>
          ADMINISTRATOR PORTAL
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
          {user?.username || 'Admin User'}
        </Typography>
      </Box>

      <List disablePadding>
        {/* Dashboard */}
        <ListItemButton
          component={Link}
          to="/"
          selected={isCurrent('/')}
          sx={{
            borderRadius: '10px',
            mb: 1,
            py: 1.2,
            '&.Mui-selected': {
              bgcolor: 'primary.main',
              color: '#ffffff',
              '& .MuiListItemIcon-root': { color: '#ffffff' },
              '&:hover': { bgcolor: 'primary.dark' },
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>
            <LayoutDashboard size={18} />
          </ListItemIcon>
          <ListItemText primary="Admin Dashboard" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
        </ListItemButton>

        <Divider sx={{ my: 1.5 }} />

        {/* Employee Management Section */}
        <ListItemButton
          onClick={() => setOpenEmployee(!openEmployee)}
          sx={{ borderRadius: '10px', mb: 0.5, py: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#ef4444' }}>
            <Users size={18} />
          </ListItemIcon>
          <ListItemText primary="Employees" primaryTypographyProps={{ fontWeight: 700, fontSize: '0.85rem' }} />
          {openEmployee ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </ListItemButton>

        <Collapse in={openEmployee} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 2 }}>
            <ListItemButton
              component={Link}
              to="/create-employee"
              selected={isCurrent('/create-employee')}
              sx={{
                borderRadius: '8px',
                mb: 0.5,
                py: 0.9,
                '&.Mui-selected': { bgcolor: 'action.selected', fontWeight: 700 },
              }}
            >
              <ListItemIcon sx={{ minWidth: 30, color: 'text.secondary' }}>
                <UserPlus size={16} />
              </ListItemIcon>
              <ListItemText primary="Add Employee" primaryTypographyProps={{ fontSize: '0.85rem' }} />
            </ListItemButton>

            <ListItemButton
              component={Link}
              to="/show-all"
              selected={isCurrent('/show-all') || isCurrent('/employee-management')}
              sx={{
                borderRadius: '8px',
                mb: 0.5,
                py: 0.9,
                '&.Mui-selected': { bgcolor: 'action.selected', fontWeight: 700 },
              }}
            >
              <ListItemIcon sx={{ minWidth: 30, color: 'text.secondary' }}>
                <ListOrdered size={16} />
              </ListItemIcon>
              <ListItemText primary="Employee Directory" primaryTypographyProps={{ fontSize: '0.85rem' }} />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Task Management Section */}
        <ListItemButton
          onClick={() => setOpenTask(!openTask)}
          sx={{ borderRadius: '10px', mb: 0.5, py: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#10b981' }}>
            <CheckSquare size={18} />
          </ListItemIcon>
          <ListItemText primary="Task Suite" primaryTypographyProps={{ fontWeight: 700, fontSize: '0.85rem' }} />
          {openTask ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </ListItemButton>

        <Collapse in={openTask} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 2 }}>
            <ListItemButton
              component={Link}
              to="/create-task"
              selected={isCurrent('/create-task')}
              sx={{
                borderRadius: '8px',
                mb: 0.5,
                py: 0.9,
                '&.Mui-selected': { bgcolor: 'action.selected', fontWeight: 700 },
              }}
            >
              <ListItemIcon sx={{ minWidth: 30, color: 'text.secondary' }}>
                <PlusSquare size={16} />
              </ListItemIcon>
              <ListItemText primary="Create Task" primaryTypographyProps={{ fontSize: '0.85rem' }} />
            </ListItemButton>

            <ListItemButton
              component={Link}
              to="/task-management"
              selected={isCurrent('/task-management') || isCurrent('/show-all-tasks')}
              sx={{
                borderRadius: '8px',
                mb: 0.5,
                py: 0.9,
                '&.Mui-selected': { bgcolor: 'action.selected', fontWeight: 700 },
              }}
            >
              <ListItemIcon sx={{ minWidth: 30, color: 'text.secondary' }}>
                <ListOrdered size={16} />
              </ListItemIcon>
              <ListItemText primary="Task Board" primaryTypographyProps={{ fontSize: '0.85rem' }} />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Leave Management Section */}
        <ListItemButton
          onClick={() => setOpenLeave(!openLeave)}
          sx={{ borderRadius: '10px', mb: 0.5, py: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#f59e0b' }}>
            <Calendar size={18} />
          </ListItemIcon>
          <ListItemText primary="Leaves" primaryTypographyProps={{ fontWeight: 700, fontSize: '0.85rem' }} />
          {openLeave ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </ListItemButton>

        <Collapse in={openLeave} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 2 }}>
            <ListItemButton
              component={Link}
              to="/leave-track"
              selected={isCurrent('/leave-track') || isCurrent('/grand-leave')}
              sx={{
                borderRadius: '8px',
                mb: 0.5,
                py: 0.9,
                '&.Mui-selected': { bgcolor: 'action.selected', fontWeight: 700 },
              }}
            >
              <ListItemIcon sx={{ minWidth: 30, color: 'text.secondary' }}>
                <ListOrdered size={16} />
              </ListItemIcon>
              <ListItemText primary="Leave Requests" primaryTypographyProps={{ fontSize: '0.85rem' }} />
            </ListItemButton>
          </List>
        </Collapse>

        <Divider sx={{ my: 1.5 }} />

        {/* New Modules */}
        <ListItemButton
          component={Link}
          to="/attendance-management"
          selected={isCurrent('/attendance-management')}
          sx={{
            borderRadius: '10px',
            mb: 0.5,
            py: 1,
            '&.Mui-selected': { bgcolor: 'primary.main', color: '#fff', '& .MuiListItemIcon-root': { color: '#fff' } },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#06b6d4' }}>
            <Clock size={18} />
          </ListItemIcon>
          <ListItemText primary="Attendance" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/organization"
          selected={isCurrent('/organization')}
          sx={{
            borderRadius: '10px',
            mb: 0.5,
            py: 1,
            '&.Mui-selected': { bgcolor: 'primary.main', color: '#fff', '& .MuiListItemIcon-root': { color: '#fff' } },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#8b5cf6' }}>
            <Building2 size={18} />
          </ListItemIcon>
          <ListItemText primary="Organization" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/settings"
          selected={isCurrent('/settings')}
          sx={{
            borderRadius: '10px',
            mb: 0.5,
            py: 1,
            '&.Mui-selected': { bgcolor: 'primary.main', color: '#fff', '& .MuiListItemIcon-root': { color: '#fff' } },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
            <Settings size={18} />
          </ListItemIcon>
          <ListItemText primary="Settings" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
