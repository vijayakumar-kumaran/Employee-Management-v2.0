import React from 'react';
import { Chip, Box } from '@mui/material';

const STATUS_CONFIG = {
  active: { label: 'Active', bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981', dot: '#10b981' },
  inactive: { label: 'Inactive', bg: 'rgba(107, 114, 128, 0.12)', color: '#6b7280', dot: '#9ca3af' },
  pending: { label: 'Pending', bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', dot: '#f59e0b' },
  approved: { label: 'Approved', bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981', dot: '#10b981' },
  rejected: { label: 'Rejected', bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', dot: '#ef4444' },
  'in progress': { label: 'In Progress', bg: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4', dot: '#06b6d4' },
  completed: { label: 'Completed', bg: 'rgba(99, 102, 241, 0.12)', color: '#6366f1', dot: '#6366f1' },
  present: { label: 'Present', bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981', dot: '#10b981' },
  late: { label: 'Late', bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', dot: '#f59e0b' },
  high: { label: 'High Priority', bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', dot: '#ef4444' },
  urgent: { label: 'Urgent', bg: 'rgba(220, 38, 38, 0.2)', color: '#dc2626', dot: '#dc2626' },
  medium: { label: 'Medium', bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', dot: '#f59e0b' },
  low: { label: 'Low', bg: 'rgba(107, 114, 128, 0.12)', color: '#6b7280', dot: '#9ca3af' },
};

const StatusChip = ({ status, label: customLabel, size = 'small' }) => {
  const key = (status || '').toString().toLowerCase();
  const config = STATUS_CONFIG[key] || {
    label: customLabel || status || 'Default',
    bg: 'rgba(99, 102, 241, 0.12)',
    color: '#6366f1',
    dot: '#6366f1',
  };

  return (
    <Chip
      size={size}
      icon={
        <Box
          sx={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: config.dot,
            ml: 1,
          }}
        />
      }
      label={customLabel || config.label}
      sx={{
        bgcolor: config.bg,
        color: config.color,
        fontWeight: 700,
        fontSize: '0.75rem',
        borderRadius: '8px',
        border: `1px solid ${config.color}30`,
        '& .MuiChip-label': { px: 1 },
      }}
    />
  );
};

export default StatusChip;
