import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Inbox, Plus } from 'lucide-react';

const EmptyState = ({
  title = 'No records found',
  description = 'There are no items matching your criteria at this time.',
  icon: Icon = Inbox,
  actionLabel,
  onAction,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        textAlign: 'center',
        borderRadius: '16px',
        border: '1px dashed',
        borderColor: 'divider',
        bgcolor: 'transparent',
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          p: 2.5,
          borderRadius: '20px',
          bgcolor: 'action.hover',
          color: 'primary.main',
          mb: 2,
        }}
      >
        <Icon size={40} strokeWidth={1.5} />
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
        {title}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}>
        {description}
      </Typography>

      {actionLabel && onAction && (
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={onAction}
          sx={{ borderRadius: '10px' }}
        >
          {actionLabel}
        </Button>
      )}
    </Paper>
  );
};

export default EmptyState;
