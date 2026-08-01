import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Popover,
  Typography,
  Tabs,
  Tab,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Chip,
  InputBase,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Bell,
  CheckCircle2,
  Clock,
  Trash2,
  Search,
  CheckCheck,
  Calendar,
  AlertTriangle,
  Megaphone,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSocket } from '../../context/SocketContext';
import axios from 'axios';
import { API_URL } from '../../Config';

const NotificationCenter = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const user = useSelector((state) => state.user) || {};
  const { socket } = useSocket();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/notifications`, {
        params: { userId: user._id, role: user.role },
      });
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    if (socket) {
      const handleNewNotification = (notif) => {
        setNotifications((prev) => [notif, ...prev]);
      };
      socket.on('notification:new', handleNewNotification);
      return () => {
        socket.off('notification:new', handleNewNotification);
      };
    }
  }, [user._id, socket]);

  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkRead = async (id) => {
    try {
      await axios.put(`${API_URL}/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await axios.put(`${API_URL}/notifications/read-all`, { userId: user._id });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`${API_URL}/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    const matchesTab = activeTab === 'all' || (n.type && n.type.toLowerCase() === activeTab.toLowerCase());
    const matchesSearch =
      n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getCategoryIcon = (type) => {
    switch (type) {
      case 'Task':
        return <Briefcase size={16} color="#6366f1" />;
      case 'Leave':
        return <Calendar size={16} color="#f59e0b" />;
      case 'Announcement':
        return <Megaphone size={16} color="#10b981" />;
      default:
        return <AlertTriangle size={16} color="#06b6d4" />;
    }
  };

  const openPopover = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ color: 'text.secondary', p: 1 }}>
        <Badge badgeContent={unreadCount} color="error" max={99}>
          <Bell size={20} />
        </Badge>
      </IconButton>

      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: { xs: 340, sm: 400 },
            maxHeight: 520,
            borderRadius: '20px',
            bgcolor: isDark ? '#111827' : '#ffffff',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            overflow: 'hidden',
          },
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, pb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif", fontSize: '1.05rem' }}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Chip
                label={`${unreadCount} New`}
                size="small"
                sx={{ bgcolor: 'primary.main', color: '#fff', fontWeight: 800, height: 22, fontSize: '0.7rem' }}
              />
            )}
          </Box>

          {unreadCount > 0 && (
            <Button
              size="small"
              startIcon={<CheckCheck size={14} />}
              onClick={handleMarkAllRead}
              sx={{ fontSize: '0.75rem', fontWeight: 700 }}
            >
              Mark All Read
            </Button>
          )}
        </Box>

        {/* Search Input */}
        <Box sx={{ px: 2, pb: 1 }}>
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 1.5,
              py: 0.5,
              borderRadius: '10px',
              bgcolor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Search size={16} color="#9ca3af" />
            <InputBase
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ ml: 1, flex: 1, fontSize: '0.825rem' }}
            />
          </Paper>
        </Box>

        {/* Tabs Filter */}
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          sx={{
            px: 2,
            minHeight: 36,
            borderBottom: '1px solid',
            borderColor: 'divider',
            '& .MuiTab-root': { minHeight: 36, py: 0.5, px: 1.5, fontSize: '0.75rem', fontWeight: 700 },
          }}
        >
          <Tab value="all" label="All" />
          <Tab value="task" label="Tasks" />
          <Tab value="leave" label="Leaves" />
          <Tab value="announcement" label="News" />
        </Tabs>

        {/* List */}
        <List disablePadding sx={{ maxHeight: 340, overflowY: 'auto' }}>
          {filteredNotifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Bell size={32} color="#9ca3af" style={{ marginBottom: 8, opacity: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                No notifications found
              </Typography>
            </Box>
          ) : (
            filteredNotifications.map((n) => (
              <ListItem
                key={n._id}
                onClick={() => {
                  handleMarkRead(n._id);
                  if (n.link) {
                    navigate(n.link);
                    handleClose();
                  }
                }}
                sx={{
                  py: 1.5,
                  px: 2,
                  cursor: 'pointer',
                  bgcolor: n.read ? 'transparent' : isDark ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.05)',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <ListItemAvatar sx={{ minWidth: 42 }}>
                  <Avatar sx={{ width: 34, height: 34, bgcolor: 'action.hover' }}>{getCategoryIcon(n.type)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: n.read ? 600 : 800, fontSize: '0.85rem' }}>
                        {n.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.775rem', mt: 0.2 }}>
                      {n.message}
                    </Typography>
                  }
                />
                <IconButton size="small" onClick={(e) => handleDelete(n._id, e)} sx={{ ml: 1, opacity: 0.6 }}>
                  <Trash2 size={14} />
                </IconButton>
              </ListItem>
            ))
          )}
        </List>
      </Popover>
    </>
  );
};

export default NotificationCenter;
