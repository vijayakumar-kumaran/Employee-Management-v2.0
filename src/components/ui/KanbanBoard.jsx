import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Avatar, Chip, Tooltip, Stack } from '@mui/material';
import { Clock, MessageSquare, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import StatusChip from './StatusChip';

const COLUMNS = [
  {
    id: 'assigned',
    label: 'Assigned / To Do',
    color: '#6366f1',
    matchStatuses: ['Assigned', 'Pending', 'Rejected'],
  },
  {
    id: 'in_progress',
    label: 'In Progress',
    color: '#06b6d4',
    matchStatuses: ['Accepted', 'In Progress', 'Changes Requested'],
  },
  {
    id: 'waiting_review',
    label: 'Waiting For Review',
    color: '#f59e0b',
    matchStatuses: ['Waiting Review'],
  },
  {
    id: 'completed',
    label: 'Completed / Closed',
    color: '#10b981',
    matchStatuses: ['Completed', 'Closed'],
  },
];

const KanbanBoard = ({ tasks = [], onTaskUpdate }) => {
  const navigate = useNavigate();

  const getTasksForColumn = (matchStatuses) => {
    return tasks.filter((t) => {
      const status = t.status || 'Assigned';
      return matchStatuses.includes(status);
    });
  };

  return (
    <Box sx={{ display: 'flex', gap: 2.5, overflowX: 'auto', pb: 2, minHeight: 650 }}>
      {COLUMNS.map((col) => {
        const columnTasks = getTasksForColumn(col.matchStatuses);

        return (
          <Box
            key={col.id}
            sx={{
              flex: 1,
              minWidth: 300,
              maxWidth: 360,
              bgcolor: 'background.paper',
              borderRadius: '20px',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {/* Column Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, px: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: col.color }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '0.95rem', fontFamily: "'Outfit', sans-serif" }}>
                  {col.label}
                </Typography>
              </Box>
              <Chip
                label={columnTasks.length}
                size="small"
                sx={{ fontWeight: 800, bgcolor: 'action.hover', height: 22, fontSize: '0.75rem' }}
              />
            </Box>

            {/* Task Cards Column */}
            <Stack spacing={2} sx={{ flexGrow: 1, overflowY: 'auto' }}>
              {columnTasks.length === 0 ? (
                <Box
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: '16px',
                    color: 'text.secondary',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    No tasks in {col.label}
                  </Typography>
                </Box>
              ) : (
                columnTasks.map((task) => (
                  <Card
                    key={task._id}
                    onClick={() => navigate(`/task-detail/${task._id}`)}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: '16px',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 28px rgba(99, 102, 241, 0.15)',
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      {/* Priority and Status Badges */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                        <StatusChip priority={task.priority} />
                        <StatusChip status={task.status} />
                      </Box>

                      {/* Title */}
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.8, lineHeight: 1.3 }}>
                        {task.title}
                      </Typography>

                      {/* Category & Department */}
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                        {task.category || 'General'} • {task.department || 'Tech'}
                      </Typography>

                      {/* Footer: Due Date, Assigned Employee Avatar, Comments Counter */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'space-between',
                          pt: 1.5,
                          borderTop: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar
                            sx={{
                              width: 26,
                              height: 26,
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              bgcolor: 'primary.main',
                            }}
                          >
                            {(task.assignedTo?.name || task.assignedTo?.username || 'E')[0]}
                          </Avatar>
                          <Typography variant="caption" sx={{ fontWeight: 700, noWrap: true, maxWidth: 100 }}>
                            {task.assignedTo?.name || task.assignedTo?.username || 'Unassigned'}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          {task.comments?.length > 0 && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: 'flex', alignItems: 'center', gap: 0.3, fontWeight: 700 }}
                            >
                              <MessageSquare size={12} />
                              {task.comments.length}
                            </Typography>
                          )}

                          {task.dueDate && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: 'flex', alignItems: 'center', gap: 0.3, fontWeight: 700 }}
                            >
                              <Clock size={12} />
                              {new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))
              )}
            </Stack>
          </Box>
        );
      })}
    </Box>
  );
};

export default KanbanBoard;
