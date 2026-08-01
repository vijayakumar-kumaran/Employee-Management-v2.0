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
  Search,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import StatCard from '../components/ui/StatCard';
import KanbanBoard from '../components/ui/KanbanBoard';
import TaskCalendarView from '../components/TaskCalendarView';
import DataTable from '../components/ui/DataTable';
import StatusChip from '../components/ui/StatusChip';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import { fetchEmployeeTasks } from '../services/api';

const TaskManagementEmployee = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user) || {};

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const loadTasks = async () => {
    const targetId = user.employee?._id || user.employee || user._id;
    if (!targetId) return;

    setLoading(true);
    try {
      const res = await fetchEmployeeTasks(targetId);
      setTasks(res.data || []);
    } catch (err) {
      console.error('Error fetching employee tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [user._id, user.employee]);

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const assignedCount = tasks.filter((t) => t.status === 'Assigned').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress' || t.status === 'Accepted').length;
  const waitingReviewCount = tasks.filter((t) => t.status === 'Waiting Review').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed' || t.status === 'Closed').length;

  const tableColumns = [
    {
      field: 'title',
      headerName: 'Task Title',
      flex: 1.5,
      renderCell: (params) => (
        <Box onClick={() => navigate(`/task-detail/${params.row._id}`)} sx={{ cursor: 'pointer', py: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}>
            {params.row.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.category || 'Work'}
          </Typography>
        </Box>
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
          {params.row.dueDate ? new Date(params.row.dueDate).toLocaleDateString() : 'N/A'}
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
          variant="contained"
          onClick={() => navigate(`/task-detail/${params.row._id}`)}
          sx={{ borderRadius: '8px', fontWeight: 700 }}
        >
          Work On Task
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Top Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Sparkles size={20} color="#6366f1" />
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
            My Assigned Tasks
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Accept assignments, update checklist items, upload work proofs, and submit for review.
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="New Assignments" value={assignedCount} subtitle="Requires Acceptance" icon={Clock} color="#6366f1" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="In Progress" value={inProgressCount} subtitle="Work Active" icon={Clock} color="#06b6d4" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Submitted for Review" value={waitingReviewCount} subtitle="Awaiting Approval" icon={Send} color="#f59e0b" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Completed Work" value={completedCount} subtitle="Approved Tasks" icon={CheckCircle2} color="#10b981" />
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
              placeholder="Search my tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={16} color="#9ca3af" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '10px' },
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

      {/* Views */}
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

export default TaskManagementEmployee;
