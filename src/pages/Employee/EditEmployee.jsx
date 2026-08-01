import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  CircularProgress, Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar
} from '@mui/material';
import { Alert } from '@mui/material';
import {API_URL} from '../../Config'

const EditEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openSnackbar, setOpenSnackbar] = useState(false);

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

  // Handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle modal open
  const handleOpenModal = (employee) => {
    setSelectedEmployee(employee);
    setOpenModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEmployee(null);
  };

  // Handle employee update
  const handleUpdateEmployee = async () => {
    try {
      const updatedEmployee = {
        ...selectedEmployee,
        name: selectedEmployee.name,
        email: selectedEmployee.email,
        department: selectedEmployee.department,
        designation: selectedEmployee.designation,
        status: selectedEmployee.status,  // Status will not change
        phoneNumber: selectedEmployee.phoneNumber,
        adharNumber: selectedEmployee.adharNumber,
        gender: selectedEmployee.gender,
        address: selectedEmployee.address
      };

      await axios.put(`${API_URL}/employees/${selectedEmployee._id}`, updatedEmployee);
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp._id === selectedEmployee._id ? updatedEmployee : emp
        )
      );
      setSnackbarMessage('Employee updated successfully');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setOpenModal(false);
    } catch (error) {
      console.error('Error updating employee:', error);
      setSnackbarMessage('Error updating employee');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  // Handle employee deletion
  const handleDeleteEmployee = async () => {
    try {
      await axios.delete(`${API_URL}/employees/${selectedEmployee._id}`);
      setEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp._id !== selectedEmployee._id)
      );
      setSnackbarMessage('Employee deleted successfully');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setOpenModal(false);
    } catch (error) {
      console.error('Error deleting employee:', error);
      setSnackbarMessage('Error deleting employee');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', maxWidth: '90%', margin: 'auto' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Edit Employee
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
                  <TableCell>{employee.status}</TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => handleOpenModal(employee)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Employee Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent style={{padding:"10px"}}>
          {selectedEmployee && (
            <>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={selectedEmployee.name}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, name: e.target.value })}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={selectedEmployee.email}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, email: e.target.value })}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Department"
                variant="outlined"
                fullWidth
                value={selectedEmployee.department}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, department: e.target.value })}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Designation"
                variant="outlined"
                fullWidth
                value={selectedEmployee.designation}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, designation: e.target.value })}
                style={{ marginBottom: '10px' }}
              />

              {/* Additional fields for Aadhaar, Phone, Gender, Address */}
              <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                value={selectedEmployee.phoneNumber}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, phoneNumber: e.target.value })}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Aadhaar Number"
                variant="outlined"
                fullWidth
                value={selectedEmployee.aadhaarNumber}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, adharNumber: e.target.value })}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Gender"
                variant="outlined"
                fullWidth
                value={selectedEmployee.gender}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, gender: e.target.value })}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Address"
                variant="outlined"
                fullWidth
                value={selectedEmployee.address}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, address: e.target.value })}
                style={{ marginBottom: '10px' }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateEmployee} color="primary">
            Save
          </Button>
          <Button 
            onClick={handleDeleteEmployee} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success/error messages */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={3000} 
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EditEmployee;
