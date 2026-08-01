import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  CircularProgress, TextField, Button, Typography, Snackbar, Alert
} from '@mui/material';
import EmployeeDetailsModal from "./EmployeeDetailsModal";
import {API_URL} from '../../Config'

const EmployeeStatus = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [detailsModalOpen, setDetailsModalOpen] = useState(false); // State for employee details modal
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null); // Store the employee details for the modal
  

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

  // Handle search input
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Function to handle status toggle
  const handleToggleStatus = async (employee) => {
    const newStatus = employee.status === 'Active' ? 'Inactive' : 'Active';
    
    try {
      // Update status in the database
      await axios.put(`${API_URL}/employees/${employee._id}`, { status: newStatus });
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp._id === employee._id ? { ...emp, status: newStatus } : emp
        )
      );
      setSnackbarMessage(`Employee status updated to ${newStatus}`);
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error updating status:', error);
      setSnackbarMessage('Failed to update status');
      setOpenSnackbar(true);
    }
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDetailsModal = (employee) => {
    setSelectedEmployeeDetails(employee); // Set employee details
    setDetailsModalOpen(true); // Open details modal
  };

  const handleCloseDetailsModal = () => {
    setSelectedEmployeeDetails(null);
    setDetailsModalOpen(false); // Close details modal
  };

  return (
    <div style={{ padding: '20px', maxWidth: '90%', margin: 'auto' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Employee Status Management
      </Typography>

      <TextField
        label="Search Employee"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: '20px' }}
      />

      {loading ? (
        <CircularProgress style={{ display: 'block', margin: '0 auto' }} />
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table aria-label="employee table">
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Department</strong></TableCell>
                <TableCell><strong>Designation</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee._id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.designation}</TableCell>
                  <TableCell>
                    <Link
                      href="#"
                      onClick={() => handleOpenDetailsModal(employee)} // Open the details modal on click
                      color="primary"
                      sx={{
                        textDecoration: "underline",
                        fontWeight: "bold",
                        cursor: "pointer",
                        "&:hover": {
                          color: "#1976d2", // Change to blue on hover
                        },
                      }}
                    >
                      See More
                    </Link>
                  </TableCell>
                  <TableCell>{employee.status}</TableCell>
                  {/* Employee Details Modal */}
      
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color={employee.status === 'Active' ? 'success' : 'error'}
                      onClick={() => handleToggleStatus(employee)}
                    >
                      {employee.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Snackbar for feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={snackbarMessage.includes('Failed') ? 'error' : 'success'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {detailsModalOpen && (
        <EmployeeDetailsModal
          open={detailsModalOpen}
          onClose={handleCloseDetailsModal}
          employeeDetails={selectedEmployeeDetails} // Pass the selected employee details
        />
      )}
    </div>
  );
};

export default EmployeeStatus;
