import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid2 as Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
  Paper,
  Divider,
  Chip,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  Edit3,
  XCircle,
  ShieldCheck,
  Building2,
  Calendar,
  Sparkles,
  CheckCircle2,
  Key,
  Clock,
  Briefcase,
  CheckSquare,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../redux/slices/userSlice';
import { API_URL } from '../Config';

const Profile = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user) || {};

  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [profileData, setProfileData] = useState({
    username: user.username || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    department: user.department || 'Engineering & Products',
    designation: user.designation || (user.role === 'admin' ? 'System Administrator' : 'Senior Specialist'),
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      setSnackbar({ open: true, message: 'New Password and Confirm Password must match!', severity: 'error' });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(`${API_URL}/users/update-profile`, {
        userId: user._id,
        username: profileData.username,
        email: profileData.email,
        phoneNumber: profileData.phoneNumber,
        currentPassword: profileData.currentPassword,
        newPassword: profileData.newPassword,
      });

      if (response.status === 200) {
        const updatedUser = { ...user, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        dispatch(setUser(updatedUser));

        setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
        setEditMode(false);
        setProfileData((prev) => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      }
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Failed to update profile details.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Cover Header Banner */}
      <Card
        sx={{
          borderRadius: '24px',
          overflow: 'hidden',
          mb: 4,
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            height: 160,
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            position: 'relative',
            p: 3,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          }}
        >
          <Chip
            icon={<Sparkles size={14} color="#fff" />}
            label="Verified Enterprise Account"
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, backdropFilter: 'blur(10px)' }}
          />
        </Box>

        <CardContent sx={{ pt: 0, px: { xs: 2, md: 4 }, pb: 3, position: 'relative' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-end' },
              justifyContent: 'space-between',
              gap: 2,
              mt: -6,
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2.5 }}>
              <Avatar
                sx={{
                  width: 110,
                  height: 110,
                  border: '4px solid',
                  borderColor: isDark ? '#0b0f19' : '#ffffff',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                  bgcolor: '#4f46e5',
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {(profileData.username || 'U').charAt(0).toUpperCase()}
              </Avatar>

              <Box sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
                    {profileData.username || 'User Profile'}
                  </Typography>
                  <Chip
                    label={user?.role === 'admin' ? 'ADMIN' : 'EMPLOYEE'}
                    size="small"
                    sx={{
                      bgcolor: user?.role === 'admin' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      color: user?.role === 'admin' ? '#ef4444' : '#10b981',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5 }}>
                  {profileData.designation} • {profileData.department}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ pb: 1 }}>
              {editMode ? (
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<Save size={18} />}
                    onClick={handleSave}
                    disabled={loading}
                    sx={{ borderRadius: '12px', fontWeight: 700 }}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<XCircle size={18} />}
                    onClick={() => setEditMode(false)}
                    sx={{ borderRadius: '12px', fontWeight: 700 }}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<Edit3 size={18} />}
                  onClick={() => setEditMode(true)}
                  sx={{ borderRadius: '12px', fontWeight: 700, px: 3 }}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Quick Metrics Bar */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Briefcase size={20} color="#6366f1" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      SYSTEM ROLE
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {user?.role === 'admin' ? 'System Administrator' : 'Staff Employee'}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CheckSquare size={20} color="#10b981" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      ACCOUNT STATUS
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#10b981' }}>
                      Active & Authenticated
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Clock size={20} color="#06b6d4" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      LAST LOGIN SESSION
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      Active JWT Token Session
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs Control */}
      <Paper elevation={0} sx={{ borderRadius: '18px', border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          sx={{
            px: 2,
            pt: 1,
            borderBottom: '1px solid',
            borderColor: 'divider',
            '& .MuiTab-root': { fontWeight: 700, py: 1.5, fontSize: '0.9rem' },
          }}
        >
          <Tab icon={<User size={18} />} iconPosition="start" label="Personal Details" />
          <Tab icon={<Lock size={18} />} iconPosition="start" label="Security & Password" />
        </Tabs>

        <Box sx={{ p: { xs: 3, md: 4 } }}>
          {/* TAB 0: PERSONAL DETAILS */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={profileData.username}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  slotProps={{
                    input: {
                      startAdornment: <User size={18} style={{ marginRight: 8, color: '#9ca3af' }} />,
                      sx: { borderRadius: '12px' },
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  slotProps={{
                    input: {
                      startAdornment: <Mail size={18} style={{ marginRight: 8, color: '#9ca3af' }} />,
                      sx: { borderRadius: '12px' },
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  slotProps={{
                    input: {
                      startAdornment: <Phone size={18} style={{ marginRight: 8, color: '#9ca3af' }} />,
                      sx: { borderRadius: '12px' },
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Department"
                  name="department"
                  value={profileData.department}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  slotProps={{
                    input: {
                      startAdornment: <Building2 size={18} style={{ marginRight: 8, color: '#9ca3af' }} />,
                      sx: { borderRadius: '12px' },
                    },
                  }}
                />
              </Grid>
            </Grid>
          )}

          {/* TAB 1: SECURITY & PASSWORD */}
          {activeTab === 1 && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Alert severity="warning" sx={{ borderRadius: '12px', mb: 2 }}>
                  Changing your password will require entering your current password to authorize security modifications.
                </Alert>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  type="password"
                  label="Current Password"
                  name="currentPassword"
                  value={profileData.currentPassword}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  placeholder="Enter current password"
                  slotProps={{
                    input: {
                      startAdornment: <Key size={18} style={{ marginRight: 8, color: '#9ca3af' }} />,
                      sx: { borderRadius: '12px' },
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  name="newPassword"
                  value={profileData.newPassword}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  placeholder="Enter new password"
                  slotProps={{
                    input: {
                      startAdornment: <Lock size={18} style={{ marginRight: 8, color: '#9ca3af' }} />,
                      sx: { borderRadius: '12px' },
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={profileData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  placeholder="Confirm new password"
                  slotProps={{
                    input: {
                      startAdornment: <CheckCircle2 size={18} style={{ marginRight: 8, color: '#9ca3af' }} />,
                      sx: { borderRadius: '12px' },
                    },
                  }}
                />
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>

      {/* Toast Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ borderRadius: '14px', fontWeight: 600, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
