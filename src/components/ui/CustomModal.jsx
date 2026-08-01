import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Box, useTheme } from '@mui/material';
import { X } from 'lucide-react';

const CustomModal = ({ open, onClose, title, children, actions, maxWidth = 'sm', fullWidth = true }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: '20px',
          backgroundImage: 'none',
          bgcolor: isDark ? '#111827' : '#ffffff',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(226, 232, 240, 0.9)'}`,
          boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.7)' : '0 20px 50px rgba(15,23,42,0.15)',
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3, borderColor: 'divider' }}>
        {children}
      </DialogContent>

      {actions && (
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CustomModal;
