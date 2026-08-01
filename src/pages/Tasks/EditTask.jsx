import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

// Import SearchBar
import SearchBar from '../../components/SearchBox';
import {API_URL} from '../../Config'

const EditDeleteTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedTask, setEditedTask] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/tasks/all`);
        setTasks(response.data);
        setFilteredTasks(response.data); // Initially show all tasks
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  // Filter tasks based on search query
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const result = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTasks(result);
    } else {
      setFilteredTasks(tasks); // Reset to show all tasks if query is less than 2 characters
    }
  }, [searchQuery, tasks]);

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setEditedTask(task);
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`${API_URL}/tasks/${editedTask._id}`, editedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === editedTask._id ? { ...task, ...editedTask } : task
        )
      );
      setFilteredTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === editedTask._id ? { ...task, ...editedTask } : task
        )
      );
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      setFilteredTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <Container>
      <h2>Manage Tasks</h2>

      {/* Search Bar with correct prop names */}
      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(task)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(task._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Task Dialog */}
      {selectedTask && (
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              fullWidth
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              margin="normal"
            />
            <TextField
              label="Description"
              fullWidth
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              margin="normal"
            />
            <TextField
              label="Status"
              fullWidth
              value={editedTask.status}
              onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default EditDeleteTasks;
