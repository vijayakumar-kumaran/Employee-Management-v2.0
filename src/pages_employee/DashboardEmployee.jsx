import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid2 as Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Divider,
  Chip,
  Avatar,
} from '@mui/material';
import {
  CheckCircle2,
  Clock,
  Calendar,
  Sparkles,
  Play,
  ArrowRight,
  User,
  Award,
  Zap,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import StatCard from '../components/ui/StatCard';
import StatusChip from '../components/ui/StatusChip';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import { fetchAllTasks, fetchEmployeeLeaves, fetchAllEmployees } from '../services/api';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [tasksPending, setTasksPending] = useState(0);
  const [leaveBalance, setLeaveBalance] = useState(12); // Base quota 12
  const [approvedLeavesCount, setApprovedLeavesCount] = useState(0);
  const [myTasks, setMyTasks] = useState([]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      setLoading(true);
      try {
        const [empRes, taskRes] = await Promise.all([
          fetchAllEmployees(),
          fetchAllTasks(),
        ]);

        const employees = empRes.data || [];
        const currentEmp = employees.find((emp) => emp.email === user?.email);

        if (currentEmp && currentEmp._id) {
          const empId = currentEmp._id;
          const allTasks = taskRes.data || [];

          const assignedToMe = allTasks.filter((t) => (t.assignedTo?._id || t.assignedTo) === empId);
          setMyTasks(assignedToMe.slice(0, 5));

          const completed = assignedToMe.filter((t) => t.status === 'Completed').length;
          const pending = assignedToMe.filter((t) => t.status !== 'Completed').length;

          setTasksCompleted(completed);
          setTasksPending(pending);

          const leavesRes = await fetchEmployeeLeaves(empId);
          const leaves = leavesRes.data || [];
          const approved = leaves.filter((l) => l.status === 'Approved').length;
          setApprovedLeavesCount(approved);
          setLeaveBalance(Math.max(0, 12 - approved));
        }
      } catch (err) {
        console.error('Error loading employee dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [user?.email]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Welcome SaaS Card */}
      <Card
        sx={{
          mb: 4,
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
          color: '#ffffff',
          boxShadow: '0 20px 40px rgba(6, 182, 212, 0.25)',
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Chip
                icon={<Sparkles size={14} color="#fff" />}
                label="Personal Productivity Workspace"
                size="small"
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', fontWeight: 700, mb: 1.5 }}
              />
              <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif", mb: 1 }}>
                Good day, {user?.username || 'Team Member'}! 🚀
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 600 }}>
                Track your active tasks, clock in for your shift, submit leave applications, and view company updates.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Clock size={18} />}
                onClick={() => navigate('/attendance-management')}
                sx={{ bgcolor: '#ffffff', color: '#06b6d4', fontWeight: 700, '&:hover': { bgcolor: '#f1f5f9' }, borderRadius: '12px' }}
              >
                Clock In / Out
              </Button>
              <Button
                variant="outlined"
                startIcon={<Calendar size={18} />}
                onClick={() => navigate('/req-leave')}
                sx={{ borderColor: 'rgba(255, 255, 255, 0.5)', color: '#ffffff', fontWeight: 700, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }, borderRadius: '12px' }}
              >
                Request Leave
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Metric Cards Grid */}
      {loading ? (
        <SkeletonLoader type="card" count={3} />
      ) : (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              title="Tasks Completed"
              value={tasksCompleted}
              subtitle="Finished deliverables"
              icon={CheckCircle2}
              trend="up"
              trendValue="+100%"
              color="#10b981"
              onClick={() => navigate('/task-management')}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              title="Pending Workload"
              value={tasksPending}
              subtitle="Tasks in queue"
              icon={Clock}
              color="#f59e0b"
              onClick={() => navigate('/task-management')}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              title="Leave Balance Days"
              value={leaveBalance}
              subtitle={`${approvedLeavesCount} Days Taken This Year`}
              icon={Calendar}
              color="#6366f1"
              onClick={() => navigate('/leave-management')}
            />
          </Grid>
        </Grid>
      )}

      {/* Task Feed */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>
            My Assigned Tasks
          </Typography>
          <Button size="small" endIcon={<ArrowRight size={16} />} onClick={() => navigate('/task-management')}>
            Go to Task Board
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {myTasks.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
            🎉 All caught up! No active tasks assigned to you currently.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {myTasks.map((t) => (
              <Box
                key={t._id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: 'action.hover',
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {t.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Due Date: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No Deadline'}
                  </Typography>
                </Box>
                <StatusChip status={t.status} />
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default EmployeeDashboard;
