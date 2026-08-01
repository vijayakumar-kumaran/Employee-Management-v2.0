import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid2 as Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  Award,
  Calendar,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import StatCard from '../components/ui/StatCard';
import StatusChip from '../components/ui/StatusChip';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import EmployeePerformanceChart from '../components/Charts/EmployeePerformanceChart';
import MonthlyTaskReportChart from '../components/Charts/MonthlyTaskReportChart';
import { fetchAllEmployees, fetchAllTasks, fetchAllLeaves } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    pendingLeaves: 0,
    avgTaskCompletionTime: 0,
    monthlyTaskReport: { completed: 0, pending: 0 },
    performanceData: { withinDueDate: 0, overDueDate: 0 },
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentLeaves, setRecentLeaves] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [empRes, taskRes, leaveRes] = await Promise.all([
          fetchAllEmployees(),
          fetchAllTasks(),
          fetchAllLeaves(),
        ]);

        const employees = empRes.data || [];
        const tasks = taskRes.data || [];
        const leaves = leaveRes.data || [];

        const completedTasks = tasks.filter((t) => t.status === 'Completed');
        const pendingTasks = tasks.filter((t) => t.status === 'Pending');
        const inProgressTasks = tasks.filter((t) => t.status === 'In Progress');
        const pendingLeaves = leaves.filter((l) => l.status === 'Pending');

        const completedWithinDueDate = completedTasks.filter(
          (t) => new Date(t.updatedAt) <= new Date(t.dueDate)
        ).length;
        const completedOverDueDate = completedTasks.length - completedWithinDueDate;

        const avgDays =
          completedTasks.reduce((total, task) => {
            const completionTime = new Date(task.updatedAt) - new Date(task.dueDate);
            return total + Math.max(0, completionTime / (1000 * 60 * 60 * 24));
          }, 0) / (completedTasks.length || 1);

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        setStats({
          totalEmployees: employees.length,
          completedTasks: completedTasks.length,
          pendingTasks: pendingTasks.length,
          inProgressTasks: inProgressTasks.length,
          pendingLeaves: pendingLeaves.length,
          avgTaskCompletionTime: avgDays.toFixed(1),
          monthlyTaskReport: {
            completed: tasks.filter(
              (t) =>
                new Date(t.createdAt).getMonth() === currentMonth &&
                new Date(t.createdAt).getFullYear() === currentYear &&
                t.status === 'Completed'
            ).length,
            pending: tasks.filter(
              (t) =>
                new Date(t.createdAt).getMonth() === currentMonth &&
                new Date(t.createdAt).getFullYear() === currentYear &&
                t.status === 'Pending'
            ).length,
          },
          performanceData: {
            withinDueDate: completedWithinDueDate,
            overDueDate: completedOverDueDate,
          },
        });

        setRecentTasks(tasks.slice(0, 5));
        setRecentLeaves(leaves.slice(0, 5));
      } catch (err) {
        console.error('Error fetching admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Welcome Banner */}
      <Card
        sx={{
          mb: 4,
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(79, 70, 229, 0.25)',
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Chip
                icon={<Sparkles size={14} color="#fff" />}
                label="Executive Control Center"
                size="small"
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', fontWeight: 700, mb: 1.5 }}
              />
              <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif", mb: 1, color: '#ffffff' }}>
                Welcome back, {user?.username || 'Admin'}! 👋
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.95)', maxWidth: 600 }}>
                Here is your live enterprise operational summary, real-time team metrics, task progress, and leave approvals.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Plus size={18} color="#3730a3" />}
                onClick={() => navigate('/create-employee')}
                sx={{
                  bgcolor: '#ffffff !important',
                  background: '#ffffff !important',
                  color: '#3730a3 !important',
                  fontWeight: 800,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                  '&:hover': { bgcolor: '#f8fafc !important', background: '#f8fafc !important' },
                  borderRadius: '12px',
                  py: 1,
                  px: 2.2,
                }}
              >
                New Employee
              </Button>
              <Button
                variant="contained"
                startIcon={<Zap size={18} color="#ffffff" />}
                onClick={() => navigate('/create-task')}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2) !important',
                  background: 'rgba(255, 255, 255, 0.2) !important',
                  color: '#ffffff !important',
                  border: '1px solid rgba(255, 255, 255, 0.7)',
                  fontWeight: 800,
                  backdropFilter: 'blur(10px)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3) !important', borderColor: '#ffffff' },
                  borderRadius: '12px',
                  py: 1,
                  px: 2.2,
                }}
              >
                Assign Task
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Metric Cards Grid */}
      {loading ? (
        <SkeletonLoader type="card" count={4} />
      ) : (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Total Employees"
              value={stats.totalEmployees}
              subtitle="Active Workforce"
              icon={Users}
              trend="up"
              trendValue="+12%"
              color="#6366f1"
              onClick={() => navigate('/show-all')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Tasks Completed"
              value={stats.completedTasks}
              subtitle="On-time delivery"
              icon={CheckCircle2}
              trend="up"
              trendValue="+24%"
              color="#10b981"
              onClick={() => navigate('/completed-tasks')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Pending Tasks"
              value={stats.pendingTasks}
              subtitle="Requires action"
              icon={Clock}
              trend="down"
              trendValue="-5%"
              color="#f59e0b"
              onClick={() => navigate('/pending-tasks')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Leave Approvals"
              value={stats.pendingLeaves}
              subtitle="Awaiting review"
              icon={Calendar}
              color="#06b6d4"
              onClick={() => navigate('/leave-track')}
            />
          </Grid>
        </Grid>
      )}

      {/* Analytics Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <EmployeePerformanceChart
            avgTaskCompletionTime={stats.avgTaskCompletionTime}
            performanceData={stats.performanceData}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MonthlyTaskReportChart monthlyTaskReport={stats.monthlyTaskReport} />
        </Grid>
      </Grid>

      {/* Recent Activity Lists */}
      <Grid container spacing={3}>
        {/* Recent Tasks */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>
                Recent Task Workflows
              </Typography>
              <Button size="small" endIcon={<ArrowRight size={16} />} onClick={() => navigate('/task-management')}>
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {recentTasks.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  No task activity recorded yet.
                </Typography>
              ) : (
                recentTasks.map((t) => (
                  <Box
                    key={t._id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      p: 1.5,
                      borderRadius: '12px',
                      bgcolor: 'action.hover',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {t.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </Box>
                    <StatusChip status={t.status} />
                  </Box>
                ))
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Recent Leaves */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>
                Pending Leave Requests
              </Typography>
              <Button size="small" endIcon={<ArrowRight size={16} />} onClick={() => navigate('/leave-track')}>
                Manage Leaves
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {recentLeaves.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  No pending leave requests.
                </Typography>
              ) : (
                recentLeaves.map((l) => (
                  <Box
                    key={l._id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      p: 1.5,
                      borderRadius: '12px',
                      bgcolor: 'action.hover',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {l.name} — {l.leaveType}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(l.startDate).toLocaleDateString()} to {new Date(l.endDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <StatusChip status={l.status} />
                  </Box>
                ))
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
