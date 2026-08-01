import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid2 as Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  Avatar,
  Divider,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import { Building2, Megaphone, Plus, Pin, Calendar, Users, Award } from 'lucide-react';
import { useSelector } from 'react-redux';
import OrgChartTree from '../components/ui/OrgChartTree';
import CustomModal from '../components/ui/CustomModal';
import { useSocket } from '../context/SocketContext';
import { fetchOrgChart, fetchAnnouncements, createAnnouncement, fetchDepartmentSummary } from '../services/api';

const OrganizationView = () => {
  const user = useSelector((state) => state.user);
  const { showNotification } = useSocket();
  const isAdmin = user?.role === 'admin';

  const [tabIndex, setTabIndex] = useState(0);
  const [orgTree, setOrgTree] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [deptSummary, setDeptSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for new Announcement
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('HR News');
  const [newPinned, setNewPinned] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [treeRes, annRes, deptRes] = await Promise.all([
        fetchOrgChart(),
        fetchAnnouncements(),
        fetchDepartmentSummary(),
      ]);
      setOrgTree(treeRes.data || []);
      setAnnouncements(annRes.data || []);
      setDeptSummary(deptRes.data || []);
    } catch (err) {
      console.error('Error fetching org data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAnnouncement = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      showNotification('Title and content are required', 'error');
      return;
    }
    try {
      await createAnnouncement({
        title: newTitle,
        content: newContent,
        category: newCategory,
        pinned: newPinned,
        author: user?.username || 'HR Admin',
      });
      showNotification('Announcement posted successfully! 📢', 'success');
      setModalOpen(false);
      setNewTitle('');
      setNewContent('');
      loadData();
    } catch (err) {
      showNotification('Failed to post announcement', 'error');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
            Organization & Company Hub
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visual organizational structure, team departments, announcements, and company policy updates.
          </Typography>
        </Box>

        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => setModalOpen(true)}
            sx={{ borderRadius: '12px', py: 1, px: 2.5 }}
          >
            Post Announcement
          </Button>
        )}
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabIndex} onChange={(_, val) => setTabIndex(val)} sx={{ '& .MuiTab-root': { fontWeight: 700 } }}>
          <Tab icon={<Building2 size={18} />} iconPosition="start" label="Org Hierarchy Chart" />
          <Tab icon={<Megaphone size={18} />} iconPosition="start" label="Announcements & News" />
          <Tab icon={<Users size={18} />} iconPosition="start" label="Department Overview" />
        </Tabs>
      </Box>

      {/* Tab 0: Org Tree */}
      {tabIndex === 0 && <OrgChartTree data={orgTree} />}

      {/* Tab 1: Announcements Stream */}
      {tabIndex === 1 && (
        <Grid container spacing={3}>
          {announcements.map((item) => (
            <Grid size={{ xs: 12, md: 6 }} key={item._id}>
              <Card
                sx={{
                  borderRadius: '16px',
                  border: item.pinned ? '2px solid' : '1px solid',
                  borderColor: item.pinned ? 'primary.main' : 'divider',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'translateY(-2px)' },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Chip
                      label={item.category || 'General'}
                      size="small"
                      sx={{ fontWeight: 700, bgcolor: 'primary.main', color: '#ffffff' }}
                    />
                    {item.pinned && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main', fontSize: '0.75rem', fontWeight: 700 }}>
                        <Pin size={14} /> Pinned News
                      </Box>
                    )}
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontFamily: "'Outfit', sans-serif" }}>
                    {item.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.6 }}>
                    {item.content}
                  </Typography>

                  <Divider sx={{ mb: 1.5 }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Posted by {item.author || 'HR'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Tab 2: Department Summary Grid */}
      {tabIndex === 2 && (
        <Grid container spacing={3}>
          {deptSummary.map((dept, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 44, height: 44 }}>
                    <Building2 size={22} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {dept.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Department Analytics
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Workforce:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {dept.count} Members
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Active Status Ratio:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {dept.active} / {dept.count} Active
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* New Announcement Modal */}
      <CustomModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Post Company Announcement"
        actions={
          <>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateAnnouncement}>
              Publish Now
            </Button>
          </>
        }
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <TextField
            fullWidth
            label="Announcement Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. Q3 All-Hands Meeting & Awards"
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Announcement Details"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Provide full description for employees..."
          />
        </Box>
      </CustomModal>
    </Box>
  );
};

export default OrganizationView;
