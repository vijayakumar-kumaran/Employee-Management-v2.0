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
  Button,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { useSelector } from 'react-redux';
import {API_URL} from '../../Config'

const GrantLeave = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const user = useSelector((state)=> state.user)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch leave requests data (now it contains employee name)
        const leaveResponse = await axios.get(`${API_URL}/leaves/all`);
        setLeaveRequests(leaveResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // console.log(leaveRequests[0].leaveType)
  
  const handleUpdateStatus = async (leaveId, updatedStatus) => {
       
    try {
      // Notifications 
      const msg = {
        from:user._id,
        to: leaveRequests.find((leave) => leave._id === leaveId).employeeId, 
        status: updatedStatus

      }
      console.log(msg.to)
      await axios.put(`${API_URL}/leaves/update/${leaveId}`, msg);
      
      setLeaveRequests((prevRequests) =>
        prevRequests.map((leave) =>
          leave._id === leaveId ? { ...leave, status: updatedStatus } : leave
        )
      );
      
      setSnackbarMessage('Leave request updated successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      // Refresh the leave requests list after status update
      const response = await axios.get(`${API_URL}/leaves/all`);
      setLeaveRequests(response.data);

    } catch (error) {
      setSnackbarMessage('Error updating leave request');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  // Filter to show only "Pending" leave requests
  const pendingLeaveRequests = leaveRequests.filter(leave => leave.status === 'Pending');

  return (
    <Container maxWidth="lg" style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom textAlign={"center"}>
        Leave Management
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Employee</strong></TableCell>
                  <TableCell><strong>Leave Type</strong></TableCell>
                  <TableCell><strong>Start Date</strong></TableCell>
                  <TableCell><strong>End Date</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {pendingLeaveRequests.map((leave) => (
                <TableRow key={leave._id}>
                  <TableCell>{leave.name}</TableCell>
                  <TableCell>{leave.leaveType}</TableCell>
                  <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>{leave.status}</TableCell>
                  <TableCell>
                    {leave.status === 'Pending' && (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleUpdateStatus(leave._id, 'approved')}
                          style={{ marginRight: '10px' }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleUpdateStatus(leave._id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
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

export default GrantLeave;
