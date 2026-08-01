import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const MonthlyTaskReportChart = ({ monthlyTaskReport }) => {
  const totalTasks = monthlyTaskReport.completed + monthlyTaskReport.pending;
  const completedPercentage = totalTasks ? ((monthlyTaskReport.completed / totalTasks) * 100).toFixed(2) : 0;
  const pendingPercentage = totalTasks ? ((monthlyTaskReport.pending / totalTasks) * 100).toFixed(2) : 0;

  const data = [
    { name: 'Completed', value: parseFloat(completedPercentage) },
    { name: 'Pending', value: parseFloat(pendingPercentage) },
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        borderRadius: 4,
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        This Month's Task Report (%)
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <BarChart
          width={500}
          height={200}
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
          <YAxis type="category" dataKey="name" />
          <Tooltip formatter={(value) => `${value}%`} />
          <Bar dataKey="value" fill="#82ca9d" barSize={30} />
        </BarChart>
      </Box>
    </Paper>
  );
};

export default MonthlyTaskReportChart;
