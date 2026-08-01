import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Grid2 as Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Paper,
  Divider,
  LinearProgress,
  Checkbox,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Paperclip,
  ArrowLeft,
  User,
  Building2,
  Calendar,
  Sparkles,
  FileText,
  ShieldCheck,
  XCircle,
  Play,
  RotateCcw,
  CheckCheck,
  Lock,
  Plus,
  Download,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useSocket } from '../context/SocketContext';
import { API_URL } from '../Config';
import StatusChip from '../components/ui/StatusChip';
import SkeletonLoader from '../components/ui/SkeletonLoader';

const STAGES = ['Assigned', 'Accepted', 'In Progress', 'Waiting Review', 'Completed', 'Closed'];

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { socket } = useSocket();
  const user = useSelector((state) => state.user) || {};

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
  const [newAttachment, setNewAttachment] = useState({ name: '', url: '', type: 'image' });

  const commentsEndRef = useRef(null);

  const fetchTaskDetail = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks/${id}`);
      setTask(res.data);
    } catch (err) {
      console.error('Error fetching task detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetail();

    if (socket) {
      socket.on(`task:comment:${id}`, (newComment) => {
        setTask((prev) => (prev ? { ...prev, comments: [...(prev.comments || []), newComment] } : prev));
      });

      return () => {
        socket.off(`task:comment:${id}`);
      };
    }
  }, [id, socket]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [task?.comments]);

  const handleStatusChange = async (newStatus, details = '', reason = '') => {
    try {
      const res = await axios.put(`${API_URL}/tasks/${id}/status`, {
        status: newStatus,
        actor: { id: user._id, name: user.username, role: user.role },
        details: details || `Status updated to ${newStatus}`,
        rejectionReason: reason,
      });
      setTask(res.data);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(`${API_URL}/tasks/${id}/comments`, {
        text: commentText,
        user: { id: user._id, name: user.username, role: user.role },
      });
      setTask(res.data);
      setCommentText('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleToggleChecklist = async (itemId, currentStatus) => {
    try {
      const res = await axios.put(`${API_URL}/tasks/${id}/checklist`, {
        itemId,
        completed: !currentStatus,
        actorName: user.username,
      });
      setTask(res.data);
    } catch (err) {
      console.error('Error toggling checklist:', err);
    }
  };

  const handleAddAttachment = async () => {
    if (!newAttachment.name || !newAttachment.url) return;

    try {
      const res = await axios.post(`${API_URL}/tasks/${id}/attachments`, {
        name: newAttachment.name,
        url: newAttachment.url,
        type: newAttachment.type,
        uploadedBy: user.username,
      });
      setTask(res.data);
      setAttachmentModalOpen(false);
      setNewAttachment({ name: '', url: '', type: 'image' });
    } catch (err) {
      console.error('Error adding attachment:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <SkeletonLoader type="card" count={2} />
      </Box>
    );
  }

  if (!task) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="error">Task not found or has been removed.</Alert>
        <Button startIcon={<ArrowLeft size={18} />} onClick={() => navigate('/task-management')} sx={{ mt: 2 }}>
          Back to Tasks
        </Button>
      </Box>
    );
  }

  const currentStageIndex = STAGES.indexOf(task.status);
  const isEmployee = user.role === 'employee';
  const isAdmin = user.role === 'admin';

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1300, mx: 'auto' }}>
      {/* Top Navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Button
          startIcon={<ArrowLeft size={18} />}
          onClick={() => navigate(-1)}
          sx={{ borderRadius: '10px', fontWeight: 700 }}
        >
          Back to Workspace
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip label={`ID: #${task._id.slice(-6)}`} size="small" sx={{ fontWeight: 800 }} />
          <Chip label={task.category || 'Work'} size="small" color="primary" sx={{ fontWeight: 700 }} />
        </Box>
      </Box>

      {/* Main Task Header Card */}
      <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: '24px', border: '1px solid', borderColor: 'divider', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Box sx={{ maxWidth: 800 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, flexWrap: 'wrap' }}>
              <StatusChip status={task.status} />
              <StatusChip priority={task.priority} />
              <Chip icon={<Building2 size={14} />} label={task.department || 'Engineering'} size="small" variant="outlined" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif", mb: 1 }}>
              {task.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {task.description || 'No additional description provided.'}
            </Typography>
          </Box>

          {/* Action Control Buttons Bar */}
          <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block', mb: 1.5, letterSpacing: '0.05em' }}>
              LIFECYCLE CONTROLS
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {/* EMPLOYEE CONTROLS */}
              {isEmployee && task.status === 'Assigned' && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle2 size={18} />}
                    onClick={() => handleStatusChange('Accepted', 'Employee accepted the task assignment.')}
                    sx={{ borderRadius: '10px', fontWeight: 800 }}
                  >
                    Accept Task
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<XCircle size={18} />}
                    onClick={() => setRejectionModalOpen(true)}
                    sx={{ borderRadius: '10px', fontWeight: 800 }}
                  >
                    Reject Task
                  </Button>
                </>
              )}

              {isEmployee && (task.status === 'Accepted' || task.status === 'Changes Requested') && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Play size={18} />}
                  onClick={() => handleStatusChange('In Progress', 'Work started on the task.')}
                  sx={{ borderRadius: '10px', fontWeight: 800 }}
                >
                  Start Work
                </Button>
              )}

              {isEmployee && task.status === 'In Progress' && (
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<Send size={18} />}
                  onClick={() => handleStatusChange('Waiting Review', 'Employee submitted work for admin review.')}
                  sx={{ borderRadius: '10px', fontWeight: 800 }}
                >
                  Submit For Review
                </Button>
              )}

              {/* ADMIN CONTROLS */}
              {isAdmin && task.status === 'Waiting Review' && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCheck size={18} />}
                    onClick={() => handleStatusChange('Completed', 'Admin approved the work submission.')}
                    sx={{ borderRadius: '10px', fontWeight: 800 }}
                  >
                    Approve Work
                  </Button>
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<RotateCcw size={18} />}
                    onClick={() => handleStatusChange('Changes Requested', 'Admin requested revisions.')}
                    sx={{ borderRadius: '10px', fontWeight: 800 }}
                  >
                    Request Changes
                  </Button>
                </>
              )}

              {isAdmin && task.status === 'Completed' && (
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<Lock size={18} />}
                  onClick={() => handleStatusChange('Closed', 'Task officially closed.')}
                  sx={{ borderRadius: '10px', fontWeight: 800 }}
                >
                  Close Task
                </Button>
              )}
            </Box>
          </Paper>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Lifecycle Stepper */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>
            WORKFLOW LIFECYCLE PIPELINE
          </Typography>
          <Grid container spacing={1}>
            {STAGES.map((stage, idx) => {
              const isCurrent = stage === task.status;
              const isPassed = currentStageIndex > idx;
              return (
                <Grid key={stage} size={{ xs: 6, sm: 4, md: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      textAlign: 'center',
                      bgcolor: isCurrent ? 'primary.main' : isPassed ? 'action.selected' : 'action.hover',
                      color: isCurrent ? '#fff' : 'text.primary',
                      border: '1px solid',
                      borderColor: isCurrent ? 'primary.main' : 'divider',
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', fontSize: '0.75rem' }}>
                      {stage}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Paper>

      {/* Main Grid: Details + Checklist + Comments + Timeline */}
      <Grid container spacing={3}>
        {/* Left Column (Checklist & Attachments & Progress) */}
        <Grid size={{ xs: 12, md: 7 }}>
          {/* Progress Card */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid', borderColor: 'divider', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
                Task Progress ({task.progress || 0}%)
              </Typography>
              <Chip label={`${task.checklist?.filter((i) => i.completed).length || 0} / ${task.checklist?.length || 0} Done`} size="small" />
            </Box>
            <LinearProgress
              variant="determinate"
              value={task.progress || 0}
              sx={{ height: 10, borderRadius: 5, bgcolor: 'action.hover' }}
            />
          </Paper>

          {/* Subtasks Checklist */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid', borderColor: 'divider', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif", mb: 2 }}>
              Subtask Checklist
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {(!task.checklist || task.checklist.length === 0) ? (
                <Typography variant="body2" color="text.secondary">
                  No subtask items created for this task.
                </Typography>
              ) : (
                task.checklist.map((item) => (
                  <Box
                    key={item._id}
                    onClick={() => handleToggleChecklist(item._id, item.completed)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 1.2,
                      borderRadius: '12px',
                      bgcolor: item.completed ? 'rgba(16, 185, 129, 0.08)' : 'action.hover',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': { bgcolor: 'action.selected' },
                    }}
                  >
                    <Checkbox checked={item.completed} color="success" />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        textDecoration: item.completed ? 'line-through' : 'none',
                        color: item.completed ? 'text.secondary' : 'text.primary',
                        flexGrow: 1,
                      }}
                    >
                      {item.title}
                    </Typography>
                    {item.completedBy && (
                      <Chip label={`Done by ${item.completedBy}`} size="small" variant="outlined" sx={{ fontSize: '0.675rem' }} />
                    )}
                  </Box>
                ))
              )}
            </Box>
          </Paper>

          {/* Attachments Section */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid', borderColor: 'divider', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
                Work Attachments & Proofs
              </Typography>
              <Button size="small" startIcon={<Plus size={16} />} onClick={() => setAttachmentModalOpen(true)}>
                Add Attachment
              </Button>
            </Box>
            <Grid container spacing={2}>
              {(!task.attachments || task.attachments.length === 0) ? (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="text.secondary">
                    No work files or screenshots attached yet.
                  </Typography>
                </Grid>
              ) : (
                task.attachments.map((att) => (
                  <Grid key={att._id} size={{ xs: 12, sm: 6 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.8,
                        borderRadius: '14px',
                        bgcolor: 'action.hover',
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      <Paperclip size={20} color="#6366f1" />
                      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                        <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
                          {att.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          By {att.uploadedBy}
                        </Typography>
                      </Box>
                      <IconButton component="a" href={att.url} target="_blank" size="small">
                        <Download size={16} />
                      </IconButton>
                    </Paper>
                  </Grid>
                ))
              )}
            </Grid>
          </Paper>

          {/* Activity History Timeline */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif", mb: 2 }}>
              Timeline Activity Stream
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {task.timeline?.map((event, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.75rem' }}>
                      {event.actor?.name?.charAt(0) || 'A'}
                    </Avatar>
                    {idx < task.timeline.length - 1 && <Box sx={{ width: 2, flexGrow: 1, bgcolor: 'divider', my: 0.5 }} />}
                  </Box>
                  <Box sx={{ pb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {event.action}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.details}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {new Date(event.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Right Column (Comments Discussion Stream & Metadata) */}
        <Grid size={{ xs: 12, md: 5 }}>
          {/* Metadata Card */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid', borderColor: 'divider', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif", mb: 2 }}>
              Task Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Assigned Employee:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {task.assignedTo?.name || task.assignedTo?.username || 'Unassigned'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Due Date:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Estimated Hours:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {task.estimatedHours || 8} Hours
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Live Comments Discussion */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '20px',
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              height: 520,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif", mb: 2 }}>
              Live Team Discussion
            </Typography>

            <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {(!task.comments || task.comments.length === 0) ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No comments yet. Start the conversation!
                </Typography>
              ) : (
                task.comments.map((c, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#6366f1', fontSize: '0.8rem', fontWeight: 700 }}>
                      {c.user?.name?.charAt(0) || 'U'}
                    </Avatar>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '14px',
                        bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.03)',
                        border: '1px solid',
                        borderColor: 'divider',
                        flexGrow: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.8rem' }}>
                          {c.user?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.675rem' }}>
                          {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                        {c.text}
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
              <div ref={commentsEndRef} />
            </Box>

            <Box component="form" onSubmit={handleAddComment} sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                slotProps={{ input: { sx: { borderRadius: '12px' } } }}
              />
              <Button type="submit" variant="contained" disabled={!commentText.trim()} sx={{ borderRadius: '12px', minWidth: 46 }}>
                <Send size={18} />
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Rejection Reason Modal */}
      <Dialog open={rejectionModalOpen} onClose={() => setRejectionModalOpen(false)} PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Reject Task Assignment</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please specify why you are unable to accept this task assignment:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Reason for rejection..."
            slotProps={{ input: { sx: { borderRadius: '12px' } } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRejectionModalOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setRejectionModalOpen(false);
              handleStatusChange('Rejected', 'Employee rejected task assignment.', rejectionReason);
            }}
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>

      {/* Attachment Upload Modal */}
      <Dialog open={attachmentModalOpen} onClose={() => setAttachmentModalOpen(false)} PaperProps={{ sx: { borderRadius: '20px', p: 1, minWidth: 400 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Add Work Attachment</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            fullWidth
            label="File Name"
            value={newAttachment.name}
            onChange={(e) => setNewAttachment({ ...newAttachment, name: e.target.value })}
            placeholder="e.g. Dashboard Screenshot.png"
          />
          <TextField
            fullWidth
            label="File URL / Link"
            value={newAttachment.url}
            onChange={(e) => setNewAttachment({ ...newAttachment, url: e.target.value })}
            placeholder="https://example.com/file.png"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAttachmentModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddAttachment}>
            Upload Attachment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskDetailPage;
