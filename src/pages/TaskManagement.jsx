import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid2 as Grid,
  Button,
  Paper,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import {
  Kanban as KanbanIcon,
  List as ListIcon,
  Calendar as CalendarIcon,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import StatCard from '../components/ui/StatCard';
import KanbanBoard from '../components/ui/KanbanBoard';
import TaskCalendarView from '../components/TaskCalendarView';
import DataTable from '../components/ui/DataTable';
import StatusChip from '../components/ui/StatusChip';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import { fetchAdminTasks, fetchAllTasks } from '../services/api';

const TaskManagement = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user) || {};

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban', 'list', 'calendar'
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadTasks = async () => {
    setLoading(true);
    try {
      // Fetch tasks created by this specific admin
      const res = user._id ? await fetchAdminTasks(user._id) : await fetchAllTasks();
      setTasks(res.data || []);
    } catch (err) {
      console.error('Error fetching admin tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [user._id]);

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignedTo?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const inProgressCount = tasks.filter((t) => t.status === 'In Progress' || t.status === 'Accepted').length;
  const waitingReviewCount = tasks.filter((t) => t.status === 'Waiting Review').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed' || t.status === 'Closed').length;
  const overdueCount = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed' && t.status !== 'Closed').length;

  const tableColumns = [
    {
      field: 'title',
      headerName: 'Task Title & Category',
      flex: 1.5,
      renderCell: (params) => (
        <Box onClick={() => navigate(`/task-detail/${params.row._id}`)} sx={{ cursor: 'pointer', py: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}>
            {params.row.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.category || 'General'} • {params.row.department || 'Tech'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'assignedTo',
      headerName: 'Assigned Employee',
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {params.row.assignedTo?.name || params.row.assignedTo?.username || 'Unassigned'}
        </Typography>
      ),
    },
    {
      field: 'priority',
      headerName: 'Priority',
      flex: 0.8,
      renderCell: (params) => <StatusChip priority={params.row.priority} />,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => <StatusChip status={params.row.status} />,
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      flex: 0.9,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.row.dueDate ? new Date(params.row.dueDate).toLocaleDateString() : 'No Due Date'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 0.8,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => navigate(`/task-detail/${params.row._id}`)}
          sx={{ borderRadius: '8px', fontWeight: 700 }}
        >
          Open Details
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Top Header Card */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Sparkles size={20} color="#6366f1" />
            <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
              My Created Tasks Workspace
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Manage tasks created by you, track employee progress, review submissions, and close workflows.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => navigate('/create-task')}
          sx={{ borderRadius: '12px', fontWeight: 800, py: 1.2, px: 2.5 }}
        >
          Create New Task
        </Button>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="In Progress Tasks" value={inProgressCount} subtitle="Active Work" icon={Clock} color="#6366f1" />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Waiting For Review" value={waitingReviewCount} subtitle="Requires Your Approval" icon={Filter} color="#f59e0b" />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Completed Tasks" value={completedCount} subtitle="Approved & Closed" icon={CheckCircle2} color="#10b981" />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Overdue Tasks" value={overdueCount} subtitle="Requires Attention" icon={AlertTriangle} color="#ef4444" />
        </Grid>
      </Grid>

      {/* Controls Bar */}
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: '20px', border: '1px solid', borderColor: 'divider', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Tabs
            value={viewMode}
            onChange={(e, val) => setViewMode(val)}
            sx={{
              minHeight: 40,
              '& .MuiTab-root': { borderRadius: '10px', minHeight: 40, py: 0.5, px: 2, fontWeight: 700 },
            }}
          >
            <Tab value="kanban" icon={<KanbanIcon size={16} />} iconPosition="start" label="Kanban Board" />
            <Tab value="list" icon={<ListIcon size={16} />} iconPosition="start" label="Data Table View" />
            <Tab value="calendar" icon={<CalendarIcon size={16} />} iconPosition="start" label="Calendar View" />
          </Tabs>

          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', flexGrow: { xs: 1, md: 0 } }}>
            <TextField
              size="small"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={16} color="#9ca3af" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '10px', width: { xs: '100%', sm: 220 } },
                },
              }}
            />

            <TextField
              select
              size="small"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              slotProps={{ input: { sx: { borderRadius: '10px' } } }}
            >
              <MenuItem value="all">All Priorities</MenuItem>
              <MenuItem value="Critical">Critical</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </TextField>
          </Box>
        </Box>
      </Paper>

      {/* Main View Render */}
      {loading ? (
        <SkeletonLoader type="card" count={4} />
      ) : viewMode === 'kanban' ? (
        <KanbanBoard tasks={filteredTasks} onTaskUpdate={loadTasks} />
      ) : viewMode === 'list' ? (
        <DataTable rows={filteredTasks} columns={tableColumns} />
      ) : (
        <TaskCalendarView tasks={filteredTasks} />
      )}
    </Box>
  );
};

export default TaskManagement;
