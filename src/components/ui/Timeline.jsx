import React from 'react';
import { Box, Typography, Avatar, Paper } from '@mui/material';
import { Clock, CheckCircle2, User, Award, Calendar, FileText } from 'lucide-react';

const ICON_MAP = {
  task: CheckCircle2,
  leave: Calendar,
  award: Award,
  profile: User,
  default: Clock,
};

const Timeline = ({ items = [] }) => {
  if (!items || items.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
        No recent activity recorded.
      </Typography>
    );
  }

  return (
    <Box sx={{ position: 'relative', pl: 3, py: 1 }}>
      {/* Vertical Timeline Bar */}
      <Box
        sx={{
          position: 'absolute',
          left: 12,
          top: 0,
          bottom: 0,
          width: 2,
          bgcolor: 'divider',
        }}
      />

      {items.map((item, idx) => {
        const IconComp = ICON_MAP[item.type] || ICON_MAP.default;

        return (
          <Box key={idx} sx={{ position: 'relative', mb: 3, '&:last-child': { mb: 0 } }}>
            {/* Timeline Dot */}
            <Avatar
              sx={{
                position: 'absolute',
                left: -24,
                top: 2,
                width: 26,
                height: 26,
                bgcolor: item.color || 'primary.main',
                fontSize: '0.75rem',
                boxShadow: '0 0 0 3px var(--mui-palette-background-paper)',
              }}
            >
              <IconComp size={14} color="#fff" />
            </Avatar>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '12px',
                bgcolor: 'action.hover',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {item.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.time || 'Recently'}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
            </Paper>
          </Box>
        );
      })}
    </Box>
  );
};

export default Timeline;
