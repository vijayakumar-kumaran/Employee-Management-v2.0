import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  CircularProgress,
  Box,
  Alert,
  Paper,
  Grid2 as Grid,
  Chip,
  IconButton,
} from '@mui/material';
import { Plus, Trash2, Sparkles, ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../Config';
import { fetchAllEmployees } from '../services/api';

const CreateTask = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Frontend Development');
  const [department, setDepartment] = useState('Engineering & Tech');
  const [estimatedHours, setEstimatedHours] = useState(8);
  const [checklistItems, setChecklistItems] = useState(['Setup initial environment', 'Implement core logic']);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(['SaaS', 'Feature']);

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingEmployees, setFetchingEmployees] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const loadEmployees = async () => {
      setFetchingEmployees(true);
      try {
        const response = await fetchAllEmployees();
        const rawList = response.data || [];
        const validList = Array.isArray(rawList) ? rawList.filter((emp) => emp && emp._id) : [];
        setEmployees(validList);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setErrorMsg('Failed to load employee list.');
      } finally {
        setFetchingEmployees(false);
      }
    };

    loadEmployees();
  }, []);

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setChecklistItems([...checklistItems, newChecklistText.trim()]);
    setNewChecklistText('');
  };

  const handleRemoveChecklistItem = (index) => {
    setChecklistItems(checklistItems.filter((_, idx) => idx !== index));
  };

  const handleAddTag = () => {
    if (!tagInput.trim() || tags.includes(tagInput.trim())) return;
    setTags([...tags, tagInput.trim()]);
    setTagInput('');
  };

  const handleRemoveTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!assignedTo) {
      setErrorMsg('Please select an employee to assign this task to.');
      return;
    }

    setLoading(true);

    try {
      const newTask = {
        title,
        description,
        priority,
        category,
        department,
        estimatedHours: Number(estimatedHours) || 8,
        assignedTo,
        assignedFrom: user?._id,
        status: 'Assigned',
        dueDate,
        checklist: checklistItems.map((item) => ({ title: item, completed: false })),
        tags,
      };

      const res = await axios.post(`${API_URL}/tasks`, newTask);
      setSuccessMsg('Rich Task created and assigned successfully!');

      setTimeout(() => {
        navigate(`/task-detail/${res.data._id}`);
      }, 1200);
    } catch (error) {
      console.error('Error creating task:', error);
      setErrorMsg(error.response?.data?.error || 'Error creating task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button startIcon={<ArrowLeft size={18} />} onClick={() => navigate('/task-management')}>
          Back to Workspace
        </Button>
      </Box>

      <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, borderRadius: '24px', border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
            }}
          >
            <Sparkles size={24} color="#fff" />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
            Create Rich Jira/ClickUp Task
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Assign work with checklist items, priorities, estimated hours, and department tags.
          </Typography>
        </Box>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
            {errorMsg}
          </Alert>
        )}

        {successMsg && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>
            {successMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Task Title"
            required
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Design Glassmorphism Dashboard Component"
            slotProps={{ input: { sx: { borderRadius: '12px' } } }}
          />

          <TextField
            label="Description & Brief"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed instructions and requirements..."
            slotProps={{ input: { sx: { borderRadius: '12px' } } }}
          />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Assign To Employee</InputLabel>
                <Select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  label="Assign To Employee"
                  disabled={fetchingEmployees}
                  sx={{ borderRadius: '12px' }}
                >
                  {fetchingEmployees ? (
                    <MenuItem disabled value="">
                      Loading employees...
                    </MenuItem>
                  ) : (
                    employees.map((emp) => (
                      <MenuItem key={emp._id} value={emp._id}>
                        {emp.name || emp.username} ({emp.department || 'Staff'})
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  label="Priority"
                  sx={{ borderRadius: '12px' }}
                >
                  <MenuItem value="Low">Low Priority</MenuItem>
                  <MenuItem value="Medium">Medium Priority</MenuItem>
                  <MenuItem value="High">High Priority</MenuItem>
                  <MenuItem value="Critical">🔥 Critical Priority</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                slotProps={{ input: { sx: { borderRadius: '12px' } } }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                slotProps={{ input: { sx: { borderRadius: '12px' } } }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Estimated Hours"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                slotProps={{ input: { sx: { borderRadius: '12px' } } }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Due Date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: { sx: { borderRadius: '12px' } },
                }}
              />
            </Grid>
          </Grid>

          {/* Checklist Builder */}
          <Box sx={{ p: 2.5, borderRadius: '16px', bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
              Subtask Checklist Builder
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Add subtask step (e.g. Write unit tests)..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddChecklistItem())}
                slotProps={{ input: { sx: { borderRadius: '10px' } } }}
              />
              <Button variant="contained" onClick={handleAddChecklistItem} sx={{ borderRadius: '10px' }}>
                Add Item
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {checklistItems.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    p: 1,
                    px: 1.5,
                    borderRadius: '8px',
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    • {item}
                  </Typography>
                  <IconButton size="small" onClick={() => handleRemoveChecklistItem(idx)}>
                    <Trash2 size={14} color="#ef4444" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ py: 1.5, borderRadius: '12px', fontWeight: 800, fontSize: '1rem' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Task Workflow'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateTask;
