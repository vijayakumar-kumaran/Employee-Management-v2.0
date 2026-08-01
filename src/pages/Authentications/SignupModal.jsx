import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import {API_URL} from'../../Config'

const SignupModal = ({ open, onClose, employeeDetails, onAccountCreated }) => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("employee"); // Default role
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();

  // Create a ref for the username input field
  const usernameRef = useRef(null);

  // Email and phoneNumber are prefilled from employeeDetails
  const email = employeeDetails?.email || "";
  const phoneNumber = employeeDetails?.phoneNumber || "";

  // Email and password validation
  const isValidPassword = (password) => password.length >= 6; // Simple password validation (length)

  // Reset form fields when the modal is opened
  useEffect(() => {
    if (open) {
      setUsername("");
      setPassword("");
      setErrorMessage("");
      setSuccessMessage("");
      // Use setTimeout to ensure the modal and input field are fully rendered before focusing
      setTimeout(() => {
        if (usernameRef.current) {
          usernameRef.current.focus();
        }
      }, 0); // Focus after the modal is rendered
    }
  }, [open]);

  const handleSignup = async (e) => {
    e.preventDefault();
  
    if (!username || !password) {
      setErrorMessage('All fields are required');
      return;
    }
  
    if (!isValidPassword(password)) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
  
    try {
      const response = await axios.post(
        `${API_URL}/users/signup`,
        {
          username,
          role,
          phoneNumber,
          email,
          password,
          employeeId: employeeDetails._id, // Pass the employee ID
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      dispatch(setUser(response.data.user));
  
      onAccountCreated(employeeDetails);
  
      setSuccessMessage(response.data.message);
      alert('Signup successful!');
      setUsername('');
      setRole('employee');
      setPassword('');
      onClose();
    } catch (error) {
      console.error('Error during signup:', error.response?.data || error.message);
      if (error.response?.data?.code === 11000) {
        const duplicateField = Object.keys(error.response?.data?.keyPattern || {})[0]; // Get the field that caused the duplicate error
  
        if (duplicateField === 'phoneNumber') {
          setErrorMessage('Phone number already exists. Please use a different number.');
        } else if (duplicateField === 'email') {
          setErrorMessage('Email already exists. Please use a different email.');
        } else {
          setErrorMessage('Duplicate entry detected. Please try again with a different value.');
        }
      } else {
        setErrorMessage(error.response?.data?.error || 'Signup failed. Please try again.');
      }
    }
  };
  

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" textAlign="center" gutterBottom>
          Create Work Account
        </Typography>
        <form
          noValidate
          onSubmit={handleSignup}
          autoComplete="off" // Prevent browser autofill
        >
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="off" // Prevent autofill on this field
            inputRef={usernameRef} // Assign the ref to the username input field
          />

          {/* Role Dropdown */}
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              label="Role"
              autoComplete="off" // Prevent autofill on this field
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="employee">Employee</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={phoneNumber}
            disabled
            autoComplete="off" // Prevent autofill on this field
          />
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            disabled
            autoComplete="off" // Prevent autofill on this field
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password" // Prevent autofill on this field
          />

          <Grid container spacing={2} sx={{ marginTop: "16px" }}>
            <Grid item xs={6}>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={onClose}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </form>
        {errorMessage && (
          <Typography color="error" sx={{ marginTop: "10px", textAlign: "center" }}>
            {errorMessage}
          </Typography>
        )}
        {successMessage && (
          <Typography color="primary" sx={{ marginTop: "10px", textAlign: "center" }}>
            {successMessage}
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default SignupModal;
