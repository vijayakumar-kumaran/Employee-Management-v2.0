import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  ButtonGroup,
  Button,
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

const ShowAllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [employees, setEmployees] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, today, thisWeek, thisMonth
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksResponse = await axios.get(`${API_URL}/tasks/all`);
        const employeesResponse = await axios.get(`${API_URL}/employees/all`);

        setTasks(tasksResponse.data);
        setFilteredTasks(tasksResponse.data); // Initially show all tasks

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

  useEffect(() => {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));
  
    // Get the start and end of the current week (Monday to Sunday)
    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    startOfWeek.setHours(0, 0, 0, 0);
  
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
    endOfWeek.setHours(23, 59, 59, 999);
  
    const filtered = tasks.filter((task) => {
      const taskDate = new Date(task.createdAt);
      
      // Apply search filter
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
  
      // Apply date-based filter
      let matchesDate = true;
      if (filter === 'today') {
        matchesDate = taskDate >= todayStart && taskDate <= todayEnd;
      } else if (filter === 'thisWeek') {
        matchesDate = taskDate >= startOfWeek && taskDate <= endOfWeek;
      } else if (filter === 'thisMonth') {
        matchesDate =
          taskDate.getMonth() === now.getMonth() && taskDate.getFullYear() === now.getFullYear();
      }
  
      return matchesSearch && matchesDate;
    });
  
    setFilteredTasks(filtered);
  }, [filter, searchQuery, tasks]);
  
  const getEmployeeName = (id) => (employees[id] ? employees[id].name : 'Unknown');

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={2}>
        <Typography variant="h4" align="center" gutterBottom>
          All Tasks
        </Typography>
      </Box>

      {/* Search Bar */}
      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Filter Buttons */}
      <Box mb={4} display="flex" justifyContent="center">
        <ButtonGroup variant="contained" color="primary">
          <Button
            onClick={() => setFilter('all')}
            color={filter === 'all' ? 'secondary' : 'primary'}
          >
            All
          </Button>
          <Button
            onClick={() => setFilter('today')}
            color={filter === 'today' ? 'secondary' : 'primary'}
          >
            Today
          </Button>
          <Button
            onClick={() => setFilter('thisWeek')}
            color={filter === 'thisWeek' ? 'secondary' : 'primary'}
          >
            This Week
          </Button>
          <Button
            onClick={() => setFilter('thisMonth')}
            color={filter === 'thisMonth' ? 'secondary' : 'primary'}
          >
            This Month
          </Button>
        </ButtonGroup>
      </Box>

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
                <TableCell><strong>Status</strong></TableCell>
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
                    <TableCell
                      style={{
                        fontWeight: 'bold',
                        color:
                          task.status === 'Pending'
                            ? '#FFA500'
                            : task.status === 'Progress'
                            ? '#1E90FF'
                            : '#32CD32',
                      }}
                    >
                      {task.status}
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
                  <TableCell colSpan={5} align="center">
                    No tasks found.
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

export default ShowAllTasks;
