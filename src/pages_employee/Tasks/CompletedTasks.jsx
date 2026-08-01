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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  LinearProgress,
} from '@mui/material';
import axios from 'axios';
import SearchBar from '../../components/SearchBox';
import {API_URL} from '../../Config'

const CompletedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [employees, setEmployees] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState(''); 

  useEffect(() => {

    const fetchData = async () => {
      try {
        const tasksResponse = await axios.get(`${API_URL}/tasks/all`);
        const employeesResponse = await axios.get(`${API_URL}/employees/all`);

        const pendingTasks = tasksResponse.data.filter((task) => task.status === 'Completed');
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

    fetchData();
  }, []);

  // Filter tasks based on date and search query
  useEffect(() => {
    let result = tasks;

    // Apply date filter
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

    // Apply search query
    if (searchQuery.length >= 2) {
      result = result.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(result);
  }, [dateFilter, searchQuery, tasks]);

  const getEmployeeName = (id) => (employees[id] ? employees[id].name : 'Unknown');

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={2}>
        <Typography variant="h4" align="center" gutterBottom>
          Completed Tasks
        </Typography>
      </Box>

      <Box mb={4} display="flex" gap="10px">
        {/* Date Filter Buttons */}
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
                    <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No pending tasks found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default CompletedTasks;
