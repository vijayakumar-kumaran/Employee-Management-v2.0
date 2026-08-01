import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
  FormControl,
  Select,
  InputLabel,
  MenuItem, 
} from '@mui/material';
import { useSelector } from 'react-redux';
import {API_URL} from '../../Config'

const CheckLeaveStatus = () => {
  const user = useSelector((state) => state.user); // Get the logged-in user
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get(`${API_URL}/leaves/employee/${user._id}`); // Updated endpoint
        setLeaveRequests(response.data);
        setLoading(false);
      } catch (error) {
        setSnackbarMessage('Error fetching leave requests');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        setLoading(false);
      }
    };
  
    if (user._id) {
      fetchLeaveRequests();
    }
  }, [user._id]);
  

  // Filter leave requests based on status and date filter
  const filteredLeaveRequests = leaveRequests.filter((leave) => {
    let isValid = true;

    if (statusFilter) {
      isValid = isValid && leave.status === statusFilter;
    }

    if (dateFilter) {
      const leaveDate = new Date(leave.startDate);
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Start of the week
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Start of the month

      if (dateFilter === 'today') {
        isValid = isValid && leaveDate.toDateString() === today.toDateString();
      } else if (dateFilter === 'thisWeek') {
        isValid = isValid && leaveDate >= startOfWeek;
      } else if (dateFilter === 'thisMonth') {
        isValid = isValid && leaveDate >= startOfMonth;
      }
    }

    return isValid;
  });

  return (
    <Container maxWidth="lg" style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom textAlign={"center"}>
        My Leave Status
      </Typography>

      <div style={{ marginBottom: '20px' }}>
        {/* Status Filter */}
        <FormControl variant="outlined" style={{
            marginRight: '10px',
            minWidth: '150px', // Increase width
            height: '50px', // Set height
            fontSize: '16px', // Increase font size
          }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </FormControl>

        {/* Date Filter */}
        <FormControl variant="outlined" style={{
            marginRight: '10px',
            minWidth: '150px', // Increase width
            height: '50px', // Set height
            fontSize: '16px', // Increase font size
          }}>
          <InputLabel>Date Filter</InputLabel>
          <Select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            label="Date Filter"
          >
            <MenuItem value="">All Time</MenuItem>
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="thisWeek">This Week</MenuItem>
            <MenuItem value="thisMonth">This Month</MenuItem>
          </Select>
        </FormControl>
      </div>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Leave Type</strong></TableCell>
                  <TableCell><strong>Start Date</strong></TableCell>
                  <TableCell><strong>End Date</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLeaveRequests.length > 0 ? (
                  filteredLeaveRequests.map((leave) => (
                    <TableRow key={leave._id}>
                      <TableCell>{leave.leaveType}</TableCell>
                      <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>{leave.status || 'Pending'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4}>No leave requests found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Snackbar for showing success or error messages */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenSnackbar(false)}
          >
            <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </>
      )}
    </Container>
  );
};

export default CheckLeaveStatus;
