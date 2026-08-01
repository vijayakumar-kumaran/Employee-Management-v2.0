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
import { useSelector } from 'react-redux';
import {API_URL} from '../../Config'

const PendingTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [employees, setEmployees] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [empid, setEmpid] = useState("");
  const [taskDetails, setTaskDetails] = useState({
    description: '',
    remarks: '',
    progress: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const user = useSelector((state)=> state.user)
  
  
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const tasksResponse = await axios.get(`${API_URL}/tasks/all`);
      const employeesResponse = await axios.get(`${API_URL}/employees/all`);

      // test
      const employee = await axios.get(`${API_URL}/users/user/${user._id}`)
      
      setEmpid(employee.data.employee._id)

      const pendingTasks = tasksResponse.data.filter((task) => task.status === 'Pending');
      setTasks(pendingTasks);
      setFilteredTasks(pendingTasks);

      const employeeData = employeesResponse.data.reduce((acc, employee) => {
        acc[employee._id] = employee;
        return acc;
      }, {});

      setEmployees(employeeData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    let result = tasks;

    if (dateFilter) {
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      result = tasks.filter((task) => {
        const taskDate = new Date(task.createdAt);
        if (dateFilter === 'today') return taskDate.toDateString() === new Date().toDateString();
        if (dateFilter === 'thisWeek') return taskDate >= startOfWeek;
        if (dateFilter === 'thisMonth') return taskDate >= startOfMonth;
        return true;
      });
    }

    if (searchQuery.length >= 2) {
      result = result.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(result);
  }, [dateFilter, searchQuery, tasks]);

  const getEmployeeName = (id) => (employees[id] ? employees[id].name : 'Unknown');

  const handleActionClick = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedTask(null);
    setTaskDetails({ description: '', remarks: '', progress: '' });
  };

  const handleTaskUpdate = async () => {
    
    try {
      const updatedTask = {
        ...selectedTask,
        
        status: taskDetails.progress === 'Completed' ? 'Completed' : 'In Progress',
        description: taskDetails.description,
        remarks: taskDetails.remarks,
        progress: taskDetails.progress,
        assignedFrom: empid,
        assignedTo: selectedTask.assignedFrom
      };

      await axios.put(`${API_URL}/tasks/update/${selectedTask._id}`, updatedTask);
      await fetchTasks();
      handleModalClose();
      setSnackbarOpen(true); // Show success message
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={2}>
        <Typography variant="h4" align="center" gutterBottom>
          Pending Tasks
        </Typography>
      </Box>

      <Box mb={4} display="flex" gap="10px">
        <Button variant="outlined" onClick={() => setDateFilter('today')}>
          Today
        </Button>
        <Button variant="outlined" onClick={() => setDateFilter('thisWeek')}>
          This Week
        </Button>
        <Button variant="outlined" onClick={() => setDateFilter('thisMonth')}>
          This Month
        </Button>
        <Button variant="outlined" onClick={() => setDateFilter('')}>
          Clear Filters
        </Button>
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
                      <span
                        style={{
                          color: new Date(task.dueDate) < new Date() ? 'red' : 'inherit',
                          fontWeight: new Date(task.dueDate) < new Date() ? 'bold' : 'normal',
                        }}
                      >
                        {new Date(task.dueDate).toLocaleDateString()}
                        {new Date(task.dueDate) < new Date() && ' (Expired)'}
                      </span>
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
                    No pending tasks found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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

export default PendingTasks;
