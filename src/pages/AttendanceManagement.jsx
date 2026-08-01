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
  Paper,
  Divider,
} from '@mui/material';
import { Clock, Play, Square, AlertCircle, CheckCircle2, Calendar, MapPin } from 'lucide-react';
import { useSelector } from 'react-redux';
import StatCard from '../components/ui/StatCard';
import StatusChip from '../components/ui/StatusChip';
import DataTable from '../components/ui/DataTable';
import { useSocket } from '../context/SocketContext';
import {
  checkInAttendance,
  checkOutAttendance,
  getAttendanceStatus,
  getAttendanceHistory,
  getTodayAttendanceSummary,
} from '../services/api';

const AttendanceManagement = () => {
  const user = useSelector((state) => state.user);
  const { showNotification } = useSocket();

  const employeeId = user?.employee?._id || user?.employee;
  const isAdmin = user?.role === 'admin';

  const [attendanceState, setAttendanceState] = useState({
    isCheckedIn: false,
    isCheckedOut: false,
    record: null,
  });
  const [history, setHistory] = useState([]);
  const [adminSummary, setAdminSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('HQ Office — Bangalore');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Timer logic for active check-in
  useEffect(() => {
    let timer;
    if (attendanceState.isCheckedIn && attendanceState.record?.checkInTime) {
      const startTime = new Date(attendanceState.record.checkInTime).getTime();
      timer = setInterval(() => {
        const now = Date.now();
        setElapsedSeconds(Math.floor((now - startTime) / 1000));
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(timer);
  }, [attendanceState]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (employeeId) {
        const statusRes = await getAttendanceStatus(employeeId);
        setAttendanceState(statusRes.data);

        const historyRes = await getAttendanceHistory(employeeId);
        setHistory(historyRes.data || []);
      }

      if (isAdmin) {
        const summaryRes = await getTodayAttendanceSummary();
        setAdminSummary(summaryRes.data);
      }
    } catch (err) {
      console.error('Failed to load attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [employeeId, isAdmin]);

  const handleCheckIn = async () => {
    if (!employeeId) {
      showNotification('Employee record not linked to account', 'error');
      return;
    }
    try {
      const res = await checkInAttendance({ employeeId, notes, location });
      showNotification('Successfully Checked In for Today! ⏱️', 'success');
      loadData();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Check-in failed', 'error');
    }
  };

  const handleCheckOut = async () => {
    if (!employeeId) return;
    try {
      const res = await checkOutAttendance({ employeeId, notes });
      showNotification('Successfully Checked Out! Total hours saved.', 'success');
      loadData();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Check-out failed', 'error');
    }
  };

  const formatTimer = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const tableColumns = [
    { field: 'date', header: 'Date', sortable: true },
    {
      field: 'checkInTime',
      header: 'Check In',
      render: (row) => (row.checkInTime ? new Date(row.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'),
    },
    {
      field: 'checkOutTime',
      header: 'Check Out',
      render: (row) => (row.checkOutTime ? new Date(row.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Active'),
    },
    {
      field: 'totalHours',
      header: 'Total Work Hours',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {row.totalHours ? `${row.totalHours} hrs` : row.checkOutTime ? '-' : 'In Progress'}
        </Typography>
      ),
    },
    {
      field: 'status',
      header: 'Status',
      render: (row) => <StatusChip status={row.status} />,
    },
    { field: 'notes', header: 'Notes / Location', render: (row) => row.notes || row.location || 'Office' },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
            Attendance & Time Tracking Hub
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time clock-in/out, work hours monitor, late marks, and monthly logs.
          </Typography>
        </Box>
      </Box>

      {/* Metric Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Active Team"
            value={adminSummary ? adminSummary.totalEmployees : '1'}
            subtitle="Registered employees"
            icon={Calendar}
            color="#6366f1"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Present Today"
            value={adminSummary ? adminSummary.presentCount + adminSummary.lateCount : attendanceState.isCheckedIn ? '1' : '0'}
            subtitle="Checked in members"
            icon={CheckCircle2}
            color="#10b981"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Late Marks"
            value={adminSummary ? adminSummary.lateCount : attendanceState.record?.status === 'Late' ? '1' : '0'}
            subtitle="After 09:30 AM"
            icon={AlertCircle}
            color="#f59e0b"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Absences / On Leave"
            value={adminSummary ? adminSummary.absentCount : '0'}
            subtitle="Not checked in"
            icon={Clock}
            color="#ef4444"
          />
        </Grid>
      </Grid>

      {/* Clock-In Widget */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 3, borderRadius: '20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '0.1em' }}>
                DAILY TIME CLOCK
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif", my: 1.5, color: 'primary.main' }}>
                {attendanceState.isCheckedIn ? formatTimer(elapsedSeconds) : '00:00:00'}
              </Typography>

              <Box sx={{ mb: 3 }}>
                {attendanceState.isCheckedIn ? (
                  <StatusChip status={attendanceState.record?.status || 'Present'} customLabel={`Active Clock-In (${attendanceState.record?.status})`} />
                ) : attendanceState.isCheckedOut ? (
                  <StatusChip status="completed" customLabel="Shift Completed Today" />
                ) : (
                  <StatusChip status="pending" customLabel="Not Checked In Today" />
                )}
              </Box>

              <TextField
                fullWidth
                size="small"
                label="Location / Work Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Remote / Hybrid from home office"
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={attendanceState.isCheckedIn || attendanceState.isCheckedOut}
                  startIcon={<Play size={18} />}
                  onClick={handleCheckIn}
                  sx={{ py: 1.2, borderRadius: '12px' }}
                >
                  Clock In Now
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  disabled={!attendanceState.isCheckedIn || attendanceState.isCheckedOut}
                  startIcon={<Square size={18} />}
                  onClick={handleCheckOut}
                  sx={{ py: 1.2, borderRadius: '12px' }}
                >
                  Clock Out
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: 3, borderRadius: '20px', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: "'Outfit', sans-serif" }}>
                {isAdmin ? "Company Today's Attendance Feed" : 'Your Recent Shift Details'}
              </Typography>

              {isAdmin && adminSummary?.records?.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: 280, overflowY: 'auto' }}>
                  {adminSummary.records.map((rec) => (
                    <Paper key={rec._id} elevation={0} sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.85rem' }}>
                          {(rec.employeeId?.name || 'E')[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {rec.employeeId?.name || 'Employee'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {rec.employeeId?.department} • Check In: {new Date(rec.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Box>
                      </Box>
                      <StatusChip status={rec.status} />
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Check-in records will populate here in real-time as team members clock in.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Attendance History Table */}
      <DataTable
        title="Attendance Logs"
        columns={tableColumns}
        data={history}
        loading={loading}
        searchPlaceholder="Filter attendance date or notes..."
      />
    </Box>
  );
};

export default AttendanceManagement;
