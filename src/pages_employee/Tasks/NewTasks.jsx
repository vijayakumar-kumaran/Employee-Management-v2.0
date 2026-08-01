import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import axios from 'axios';
import SearchBar from '../../components/SearchBox';
import { API_URL } from '../../Config';

const NewTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [employees, setEmployees] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    description: '',
    remarks: '',
    progress: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fetch today's tasks & employees
  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      const tasksResponse = await axios.get(`${API_URL}/tasks/today`);  
      const employeesResponse = await axios.get(`${API_URL}/employees/all`);
  
      if (!Array.isArray(tasksResponse.data)) {
        console.error("Invalid task data format:", tasksResponse.data);
        setLoading(false);
        return;
      }
  
      const newTasks = tasksResponse.data.filter((task) => task.status === "Pending");
      setTasks(newTasks);
      setFilteredTasks(newTasks);
  
      const employeeData = Array.isArray(employeesResponse.data)
        ? employeesResponse.data.reduce((acc, employee) => {
            acc[employee._id] = employee;
            return acc;
          }, {})
        : {};
  
      setEmployees(employeeData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const result = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTasks(result);
    } else {
      setFilteredTasks(tasks);
    }
  }, [searchQuery, tasks]);

  const getEmployeeName = (id) => {
    return employees[id]?.name || 'Unknown';
  };

  const handleActionClick = (task) => {
    setSelectedTask(task);
    setTaskDetails({
      description: task.description || '',
      remarks: '',
      progress: task.status || '',
    });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedTask(null);
    setTaskDetails({ description: '', remarks: '', progress: '' });
  };

  const handleTaskUpdate = async () => {
    try {
      if (!selectedTask) return;

      const updatedTask = {
        ...selectedTask,
        status: taskDetails.progress === 'Completed' ? 'Completed' : 'In Progress',
        description: taskDetails.description,
        remarks: taskDetails.remarks,
        assignedFrom: selectedTask.assignedFrom,
        assignedTo: selectedTask.assignedTo,
      };

      await axios.put(`${API_URL}/tasks/update/${selectedTask._id}`, updatedTask);
      await fetchTasks(); // Refresh tasks after update
      handleModalClose();
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={2}>
        <Typography variant="h4" align="center" gutterBottom>
          New Tasks (Created Today)
        </Typography>
      </Box>

      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {loading ? (
        <CircularProgress style={{ display: 'block', margin: '0 auto' }} />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Assigned To</strong></TableCell>
                <TableCell><strong>Due Date</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell style={{ color: '#1E90FF', fontWeight: 'bold' }}>
                      {getEmployeeName(task.assignedTo)}
                    </TableCell>
                    <TableCell>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="info"
                        onClick={() => handleActionClick(task)}
                      >
                        <PlayArrow />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No new tasks found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal for Task Update */}
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 4,
            boxShadow: 24,
            borderRadius: 2,
            width: 400,
          }}
        >
          <Typography variant="h6" mb={2}>
            Update Task
          </Typography>
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={taskDetails.description}
            onChange={(e) => setTaskDetails({ ...taskDetails, description: e.target.value })}
          />
          <TextField
            label="Remarks"
            fullWidth
            margin="normal"
            value={taskDetails.remarks}
            onChange={(e) => setTaskDetails({ ...taskDetails, remarks: e.target.value })}
          />
          <Select
            fullWidth
            value={taskDetails.progress}
            onChange={(e) => setTaskDetails({ ...taskDetails, progress: e.target.value })}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Progress
            </MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="outlined" onClick={handleModalClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!taskDetails.progress}
              onClick={handleTaskUpdate}
            >
              Update Task
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar for success message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          Task updated successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NewTasks;
