import React, { useState } from 'react';
import { Box, Paper, Typography, Grid2 as Grid, IconButton, Chip, Tooltip, useTheme } from '@mui/material';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusChip from './ui/StatusChip';

const TaskCalendarView = ({ tasks = [] }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Group tasks by day
  const tasksByDay = {};
  tasks.forEach((task) => {
    if (task.dueDate) {
      const d = new Date(task.dueDate);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const dayNum = d.getDate();
        if (!tasksByDay[dayNum]) tasksByDay[dayNum] = [];
        tasksByDay[dayNum].push(task);
      }
    }
  });

  const daysGrid = [];
  // Empty leading slots
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysGrid.push(null);
  }
  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    daysGrid.push(day);
  }

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', border: '1px solid', borderColor: 'divider' }}>
      {/* Calendar Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              bgcolor: 'primary.main',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CalendarIcon size={20} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
            {monthNames[month]} {year}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={handlePrevMonth} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <ChevronLeft size={18} />
          </IconButton>
          <IconButton onClick={handleNextMonth} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <ChevronRight size={18} />
          </IconButton>
        </Box>
      </Box>

      {/* Weekday Names Header */}
      <Grid container spacing={1} sx={{ mb: 1, textAlign: 'center' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Grid key={day} size={{ xs: 12 / 7 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.8rem' }}>
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* Calendar Grid */}
      <Grid container spacing={1}>
        {daysGrid.map((day, idx) => {
          if (day === null) {
            return (
              <Grid key={`empty-${idx}`} size={{ xs: 12 / 7 }}>
                <Box sx={{ height: 110, borderRadius: '12px', bgcolor: 'action.hover', opacity: 0.3 }} />
              </Grid>
            );
          }

          const dayTasks = tasksByDay[day] || [];
          const isToday =
            new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

          return (
            <Grid key={`day-${day}`} size={{ xs: 12 / 7 }}>
              <Box
                sx={{
                  height: 110,
                  p: 1,
                  borderRadius: '14px',
                  bgcolor: isToday ? 'rgba(99, 102, 241, 0.08)' : 'background.paper',
                  border: '1px solid',
                  borderColor: isToday ? 'primary.main' : 'divider',
                  overflowY: 'auto',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      bgcolor: isToday ? 'primary.main' : 'transparent',
                      color: isToday ? '#fff' : 'text.primary',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {day}
                  </Typography>

                  {dayTasks.length > 0 && (
                    <Chip label={`${dayTasks.length}`} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800 }} />
                  )}
                </Box>

                {/* Tasks List for the Day */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {dayTasks.map((t) => (
                    <Tooltip key={t._id} title={`${t.title} (${t.status})`}>
                      <Box
                        onClick={() => navigate(`/task-detail/${t._id}`)}
                        sx={{
                          p: 0.5,
                          px: 0.8,
                          borderRadius: '6px',
                          bgcolor: t.priority === 'Critical' ? 'rgba(239, 68, 68, 0.15)' : 'action.selected',
                          borderLeft: '3px solid',
                          borderColor:
                            t.priority === 'Critical'
                              ? '#ef4444'
                              : t.priority === 'High'
                              ? '#f59e0b'
                              : t.priority === 'Medium'
                              ? '#6366f1'
                              : '#10b981',
                          cursor: 'pointer',
                          '&:hover': { opacity: 0.8 },
                        }}
                      >
                        <Typography variant="caption" noWrap sx={{ fontWeight: 700, fontSize: '0.7rem', display: 'block' }}>
                          {t.title}
                        </Typography>
                      </Box>
                    </Tooltip>
                  ))}
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default TaskCalendarView;
