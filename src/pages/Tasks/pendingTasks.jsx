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
} from '@mui/material';
import axios from 'axios';
import SearchBar from '../../components/SearchBox';
import {API_URL} from '../../Config'

const PendingTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [employees, setEmployees] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksResponse = await axios.get(`${API_URL}/tasks/all`);
        const employeesResponse = await axios.get(`${API_URL}/employees/all`);

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

    fetchData();
  }, []);

  // Filter tasks by search query
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

  const getEmployeeName = (id) => (employees[id] ? employees[id].name : 'Unknown');

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={2}>
        <Typography variant="h4" align="center" gutterBottom>
          Pending Tasks
        </Typography>
      </Box>

      {/* Search Bar */}
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
                    <TableCell>
                      {new Date(task.dueDate).toLocaleDateString()}{' '}
                      {new Date(task.dueDate) < new Date() ? (
                        <span style={{ color: 'red', fontWeight: 'bold' }}>Expired</span>
                      ) : (
                        ''
                      )}
                    </TableCell>
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

export default PendingTasks;
