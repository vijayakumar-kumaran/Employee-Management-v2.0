import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
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
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Modal,
  Box
} from '@mui/material';
import {API_URL} from '../../Config'

const LeaveDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    // Fetch employee list
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${API_URL}/employees/all`);
        setEmployees(response.data);
        setFilteredEmployees(response.data);  // Initially, show all employees
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      // Fetch leave history for the selected employee
      const fetchLeaveHistory = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/leaves/history/${selectedEmployee._id}?filter=${filter}`
          );
          setLeaveHistory(response.data);
          console.log('Leave History Data:', response.data);
        } catch (error) {
          console.error('Error fetching leave history:', error);
        }
      };

      fetchLeaveHistory();
    }
  }, [selectedEmployee, filter]);

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    if (event.target.value === '') {
      setFilteredEmployees(employees);  // Show all employees if search is cleared
    } else {
      setFilteredEmployees(
        employees.filter((employee) =>
          employee.name.toLowerCase().includes(event.target.value.toLowerCase())
        )
      );
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Container maxWidth="false" style={{ padding: '20px', width: '100%' }}>
      <Typography variant="h5" gutterBottom textAlign="center" fontWeight="bold">
        Leave History Management
      </Typography>

      <Grid container spacing={2} style={{ width: '100%' }}>
        {/* Employee List */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Search Employees"
            variant="outlined"
            fullWidth
            value={search}
            onChange={handleSearchChange}
            style={{ marginBottom: '20px' }}
          />
          {loading ? (
            <CircularProgress />
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Employee Name</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Action</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee._id}>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleEmployeeClick(employee)}
                        >
                          View Leave History
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>

        {/* Leave History Section */}
        {selectedEmployee && (
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom textAlign="center">
              Leave History for {selectedEmployee.name}
            </Typography>

            <Button variant="outlined" style={{ float: 'right' }} color="primary" onClick={handleOpenModal}>
              Filter Leave History
            </Button>

            {/* Modal for Filtering Leave History */}
            <Modal open={openModal} onClose={handleCloseModal}>
              <Box
                sx={{
                  width: 400,
                  margin: 'auto',
                  backgroundColor: 'white',
                  padding: '20px',
                  marginTop: '100px',
                  borderRadius: '8px',
                }}
              >
                <FormControl fullWidth style={{ marginBottom: '20px' }}>
                  <InputLabel>Filter By</InputLabel>
                  <Select value={filter} onChange={handleFilterChange}>
                    <MenuItem value="all">All Time</MenuItem>
                    <MenuItem value="week">This Week</MenuItem>
                    <MenuItem value="month">This Month</MenuItem>
                    <MenuItem value="year">This Year</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleCloseModal}
                >
                  Apply Filter
                </Button>
              </Box>
            </Modal>

            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
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
                  {leaveHistory.map((leave) => (
                    <TableRow key={leave._id}>
                      <TableCell>{leave.leaveType}</TableCell>
                      <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>{leave.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default LeaveDetails;
