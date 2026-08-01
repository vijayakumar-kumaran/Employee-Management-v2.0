import React from 'react';
import { Card, CardContent, Box, Typography, Avatar, useTheme } from '@mui/material';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = '#6366f1' }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: isDark
            ? '0 12px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.15)'
            : '0 12px 30px rgba(15, 23, 42, 0.08)',
          borderColor: color,
        },
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.02em' }}>
            {title}
          </Typography>
          {Icon && (
            <Avatar
              sx={{
                bgcolor: `${color}15`,
                color: color,
                width: 44,
                height: 44,
                borderRadius: '12px',
                border: `1px solid ${color}30`,
              }}
            >
              <Icon size={22} />
            </Avatar>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
            {value}
          </Typography>
          {trendValue && (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.3,
                px: 1,
                py: 0.3,
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                bgcolor: trend === 'down' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                color: trend === 'down' ? '#ef4444' : '#10b981',
              }}
            >
              {trend === 'down' ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
              {trendValue}
            </Box>
          )}
        </Box>

        {subtitle && (
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1, fontWeight: 500 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
