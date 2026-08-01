import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Button,
  Badge,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useSelector } from 'react-redux';
import {API_URL} from '../Config'

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const user = useSelector((state)=> state.user)
  return (
    <ListItem alignItems="flex-start" sx={{ padding: 1 }}>
      <ListItemAvatar>
        <Avatar sx={{ backgroundColor: notification.color || '#1976d2' }}>
          {notification.icon || <PersonIcon />}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
            {notification.title}
          </Typography>
        }
        secondary={
          <>
            <Typography variant="body2" component="div">
              Task Title: "{notification.message}"
            </Typography>
            <Typography variant="body2" component="div">
              {user && user.role === "employee"
                ? `Created: ${new Date(notification.createdAt).toLocaleString()}`
                : `Updated: ${new Date(notification.createdAt).toLocaleString()}`}
            </Typography>
          </>
        }
      />
      {!notification.read && (
        <Button
          size="small"
          onClick={onMarkAsRead}
          sx={{ marginLeft: 1, textTransform: 'none' }}
        >
          Mark as Read
        </Button>
      )}
    </ListItem>
  );
};

const NotificationsPanel = ({ onViewAll }) => {
  const [notifications, setNotifications] = useState([]);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userId = user._id; // Retrieve userId from Redux
        if (!userId) {
          console.error('User ID is not available');
          return;
        }
        
        const response = await axios.get(
          `${API_URL}/notifications/task/${userId}`
        );
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [user._id]);

  const handleMarkAsRead = async (index) => {
    const notification = notifications[index];
    try {
      const response = await axios.put(
        `${API_URL}/notifications/markAsRead/${notification._id}`
      );
      if (response.status === 200) {
        const updatedNotifications = [...notifications];
        updatedNotifications[index].read = true;
        setNotifications(updatedNotifications);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/notifications/clearAll/${user._id}`
      );
      if (response.status === 200) {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  return (
    <Box
      sx={{
        width: 350,
        maxHeight: 450,
        overflow: 'hidden',
        padding: 0,
        backgroundColor: '#f9f9f9',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 2,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #ddd',
        }}
      >
        <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>
          Notifications
        </Typography>
        <Button
          size="small"
          color="error"
          onClick={handleClearAll}
          sx={{ textTransform: 'none', fontWeight: 'bold', padding: '4px 8px' }}
        >
          Clear All
        </Button>
      </Box>
      <Box
        sx={{
          maxHeight: 300,
          overflowY: 'auto',
          padding: 2,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#bdbdbd',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#9e9e9e',
          },
        }}
      >
        <List>
          {unreadNotifications.length > 0 ? (
            unreadNotifications.map((notification, index) => (
              <NotificationItem
                key={index}
                notification={notification}
                onMarkAsRead={() => handleMarkAsRead(index)}
              />
            ))
          ) : (
            <Typography
              sx={{ padding: 2, textAlign: 'center', color: 'gray' }}
            >
              No unread notifications
            </Typography>
          )}
        </List>
        {readNotifications.length > 0 && (
          <>
            <Divider sx={{ marginY: 1 }} />
            <Typography sx={{ fontSize: '14px', fontWeight: 'bold', color: 'gray' }}>
              Read Notifications
            </Typography>
            <List>
              {readNotifications.map((notification, index) => (
                <NotificationItem
                  key={index}
                  notification={notification}
                  onMarkAsRead={() => {}}
                />
              ))}
            </List>
          </>
        )}
      </Box>
      <Box
        sx={{
          padding: 0.5,
        
          backgroundColor: '#ffffff',
          borderTop: '1px solid #ddd',
        }}
      >
        <Button
          fullWidth
          sx={{
            textTransform: 'none',
            fontWeight: 'bold',
            padding: 1,
          }}
          onClick={onViewAll}
        >
          View All Activity
        </Button>
      </Box>
    </Box>
  );
};

export default NotificationsPanel;
