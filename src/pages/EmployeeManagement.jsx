import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import {API_URL} from '../Config'

const EmployeeManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const navigate = useNavigate();

  // Fetch employees when the component mounts
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${API_URL}/employees/all`);
        setEmployees(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Filter employees based on search query
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const result = employees.filter((employee) =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEmployees(result);
    } else {
      setFilteredEmployees([]);
    }
  }, [searchQuery, employees]);

  // Open modal with employee details
  const handleOpenModal = (employee) => {
    setSelectedEmployee(employee);
    setOpenModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEmployee(null);
  };

  const cardData = [
    {
      title: 'Show All',
      icon: <AllInclusiveIcon style={{ fontSize: 50, color: 'white' }} />,
      backgroundColor: '#3f51b5',
      route: '/show-all',
    },
    {
      title: 'Edit an Employee',
      icon: <EditIcon style={{ fontSize: 50, color: 'white' }} />,
      backgroundColor: '#ff9800',
      route: '/edit',
    },
    {
      title: 'Leave Tracking',
      icon: <LogoutIcon style={{ fontSize: 50, color: 'white' }} />,
      backgroundColor: '#f44336',
      route: '/leave-track',
    },
    {
      title: 'Status Tracking',
      icon: <CheckCircleIcon style={{ fontSize: 50, color: 'white' }} />,
      backgroundColor: '#4caf50',
      route: '/status',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={2}>
        <Typography variant="h4" align="center" gutterBottom>
          Employee Management
        </Typography>
      </Box>

      <Box mb={4}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search Employees"
          label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      {/* Show cards if searchQuery is empty or less than 2 characters */}
      {searchQuery.length < 2 ? (
        <Grid container spacing={3}>
          {cardData.map((card, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
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
      ) : loading ? (
        <CircularProgress style={{ display: 'block', margin: '0 auto' }} />
      ) : (
        // Show employees matching the search query (if search length >= 2)
        <Grid container spacing={3}>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <Grid item xs={12} sm={6} md={6} key={employee._id}>
                <Card
                  style={{ backgroundColor: '#e3f2fd', cursor: 'pointer' }}
                  onClick={() => handleOpenModal(employee)}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">{employee.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {employee.status}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6" align="center">
                No results found.
              </Typography>
            </Grid>
          )}
        </Grid>
      )}

      {/* Modal for Employee Details with Table */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>Employee Details</DialogTitle>
        <DialogContent>
          {selectedEmployee && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Field</strong></TableCell>
                    <TableCell><strong>Details</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell>{selectedEmployee.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell>{selectedEmployee.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Department</strong></TableCell>
                    <TableCell>{selectedEmployee.department}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Designation</strong></TableCell>
                    <TableCell>{selectedEmployee.designation}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell>{selectedEmployee.status}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmployeeManagement;
