import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Grid,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import {API_URL} from '../Config'

function EmployeeAddPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    designation: '',
    phoneNumber: '',
    gender: '',
    aadhaarNumber: '',
    address: '',
  });

  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Basic Details', 'Additional Details'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/employees/`, formData);
      alert('Employee added successfully');
      
      setFormData({
        name: '',
        email: '',
        department: '',
        designation: '',
        phoneNumber: '',
        gender: '',
        aadhaarNumber: '',
        address: '',
      });
      setActiveStep(0);
    } catch (err) {
      console.error(err);
      alert('Failed to add employee');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" textAlign="center" gutterBottom>
        Add Employee
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        {activeStep === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                type="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="button"
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleNext}
              >
                Next
              </Button>
            </Grid>
          </Grid>
        )}

        {activeStep === 1 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Aadhaar Number"
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleBack}
              >
                Back
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
}

export default EmployeeAddPage;
