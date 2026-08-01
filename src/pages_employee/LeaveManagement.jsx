import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  CircularProgress,
  IconButton
} from '@mui/material';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import {API_URL} from '../Config'

const LeaveManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredLeaveRequests, setFilteredLeaveRequests] = useState([]);
  const navigate = useNavigate();

  // Fetch leave requests when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
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

  // Filter leave requests based on search query
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const result = leaveRequests.filter((leave) =>
        leave.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLeaveRequests(result);
    } else {
      setFilteredLeaveRequests([]);
    }
  }, [searchQuery, leaveRequests]);

  const cardData = [
    {
      title: 'Request Leave',
      icon: <RequestPageIcon style={{ fontSize: 50, color: 'white' }} />,
      backgroundColor: '#3f51b5', // Blue for requesting leave
      route: '/req-leave',
    },
    {
      title: 'Check Leave Status',
      icon: <CheckCircleIcon style={{ fontSize: 50, color: 'white' }} />,
      backgroundColor: '#4CAF50', // Green for checking status
      route: '/leave-status',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={2}>
        <Typography variant="h4" align="center" gutterBottom>
          Leave Management
        </Typography>
      </Box>

      <Box mb={4}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search Leave Requests"
          label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      {loading ? (
        <CircularProgress style={{ display: 'block', margin: '0 auto' }} />
      ) : (
        <Grid container spacing={3}>
          {cardData.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                style={{ backgroundColor: card.backgroundColor, cursor: 'pointer' }}
                onClick={() => navigate(card.route)}
              >
                <CardContent>
                  <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                    <IconButton>{card.icon}</IconButton>
                    <Typography variant="h6" style={{ color: 'white' }}>
                      {card.title}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Display leave requests if searchQuery length is greater than 2 */}
      {searchQuery.length >= 2 && !loading && filteredLeaveRequests.length > 0 && (
        <Grid container spacing={3}>
          {filteredLeaveRequests.map((leave) => (
            <Grid item xs={12} sm={6} md={4} key={leave._id}>
              <Card
                style={{ backgroundColor: '#e3f2fd', cursor: 'pointer' }}
                onClick={() => navigate(`/leave-details/${leave._id}`)}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{leave.employeeName}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {leave.status}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default LeaveManagement;
