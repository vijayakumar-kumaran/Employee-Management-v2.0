import React from 'react';
import { Box, Skeleton, Card, CardContent, Grid2 as Grid } from '@mui/material';

export const CardSkeleton = ({ count = 4 }) => {
  return (
    <Grid container spacing={2.5}>
      {Array.from({ length: count }).map((_, idx) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="circular" width={40} height={40} />
            </Box>
            <Skeleton variant="text" width="40%" height={40} />
            <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Skeleton variant="rectangular" height={48} sx={{ borderRadius: '12px', mb: 2 }} />
      {Array.from({ length: rows }).map((_, rIdx) => (
        <Box key={rIdx} sx={{ display: 'flex', gap: 2, mb: 1.5, alignItems: 'center' }}>
          {Array.from({ length: cols }).map((_, cIdx) => (
            <Skeleton key={cIdx} variant="rectangular" height={36} sx={{ flex: 1, borderRadius: '8px' }} />
          ))}
        </Box>
      ))}
    </Box>
  );
};

const SkeletonLoader = ({ type = 'card', count = 4, rows = 5 }) => {
  if (type === 'table') return <TableSkeleton rows={rows} />;
  return <CardSkeleton count={count} />;
};

export default SkeletonLoader;
