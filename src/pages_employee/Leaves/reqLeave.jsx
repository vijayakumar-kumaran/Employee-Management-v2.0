import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import {API_URL} from '../../Config'

const ReqLeave = () => {
  const user = useSelector((state) => state.user); // Logged-in user
  const [employeeName, setEmployeeName] = useState(''); // State for employee name
  const [admins, setAdmins] = useState([]); // State to store all admins
  const [selectedAdmin, setSelectedAdmin] = useState(''); // State for selected admin
  const [admin, setAdmin] = useState("");
  const [leaveData, setLeaveData] = useState({
    leaveType: 'Sick',
    startDate: '',
    endDate: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  // Fetch employee name
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/employees/${user.employee}`);
        if (response.data && response.data.name) {
          setEmployeeName(response.data.name);
        } else {
          setEmployeeName('Unknown Employee');
        }
      } catch (error) {
        console.error('Error fetching employee details:', error);
        setEmployeeName('Unknown Employee');
      }
    };

    if (user.employee) {
      fetchEmployeeDetails();
    } else {
      console.error('user.employee is undefined or null:', user);
    }
  }, [user.employee]);

  // Fetch all admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(`${API_URL}/employees/role/admin`);
        setAdmins(response.data);
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };

    fetchAdmins();
  }, []);


  // Get admin user ID
  const GetUserID = async() =>{
    const userid = await axios.get(`${API_URL}/employees/userid/${selectedAdmin}`)
    setAdmin(userid.data._id)
  }
  // Handle input change
  const handleChange = (e) => {
    setLeaveData({ ...leaveData, [e.target.name]: e.target.value });
  };

  // Handle leave request
  const handleRequestLeave = async () => {
    setLoading(true);
    const leaveRequest = {
      ...leaveData,
      employeeId: user._id,
      name: employeeName,
      email: user.email,
      assignedAdmin: selectedAdmin, 

      // for notification
      from:user._id,
      to: admin
    };
    GetUserID()
    try {
      await axios.post(`${API_URL}/leaves/request`, leaveRequest);
      alert('Leave request submitted!');
      setLeaveData({ leaveType: 'Sick', startDate: '', endDate: '', description: '' });
      setSelectedAdmin('');
    } catch (error) {
      console.error('Error requesting leave:', error);
      alert('Error requesting leave');
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <Container maxWidth="md" style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Request Leave
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={employeeName} // Use the fetched employee name
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={user.email}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Leave Type</InputLabel>
            <Select
              name="leaveType"
              value={leaveData.leaveType}
              onChange={handleChange}
            >
              <MenuItem value="Sick">Sick</MenuItem>
              <MenuItem value="Vacation">Vacation</MenuItem>
              <MenuItem value="Emergency">Emergency</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="date"
            label="Start Date"
            variant="outlined"
            fullWidth
            name="startDate"
            value={leaveData.startDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="date"
            label="End Date"
            variant="outlined"
            fullWidth
            name="endDate"
            value={leaveData.endDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            name="description"
            value={leaveData.description}
            onChange={handleChange}
            multiline
            rows={4}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Select Admin</InputLabel>
            <Select
              value={selectedAdmin}
              onChange={(e) => setSelectedAdmin(e.target.value)}
            >
              {admins.length > 0 ? (
                admins.map((admin) => (
                  admin && admin._id ? (  // Check if admin is valid and has an _id
                    <MenuItem key={admin._id} value={admin._id}>
                      {admin.name || 'Unnamed Admin'}
                    </MenuItem>
                  ) : null
                ))
              ) : (
                <MenuItem value="" disabled>No Admins Available</MenuItem> // Show this message if no admins are available
              )}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleRequestLeave} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Request Leave'}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReqLeave;
