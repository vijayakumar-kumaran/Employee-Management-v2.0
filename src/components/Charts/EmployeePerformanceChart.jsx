import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const EmployeePerformanceChart = ({ avgTaskCompletionTime, performanceData }) => {
  if (!performanceData) {
    return (
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 4, textAlign: 'center' }}>
        <Typography variant="h6">Employee Performance</Typography>
        <Typography variant="body2" color="text.secondary">
          Loading data...
        </Typography>
      </Paper>
    );
  }

  const totalCompletedTasks =
    performanceData.withinDueDate + performanceData.overDueDate;

  const data = [
    {
      name: 'Within Due Date',
      percentage: totalCompletedTasks
        ? ((performanceData.withinDueDate / totalCompletedTasks) * 100).toFixed(2)
        : 0,
      count: performanceData.withinDueDate,
    },
    {
      name: 'Overdue',
      percentage: totalCompletedTasks
        ? ((performanceData.overDueDate / totalCompletedTasks) * 100).toFixed(2)
        : 0,
      count: performanceData.overDueDate,
    },
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
        Employee Performance
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
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(tick) => `${tick}%`}
          />
          <YAxis type="category" dataKey="name" />
          <Tooltip
            formatter={(value, name, props) =>
              `${props.payload.count} tasks (${value}%)`
            }
          />
          <Bar
            dataKey="percentage"
            fill="#8884d8"
            barSize={30}
            label={{ position: 'right', formatter: (value) => `${value}%` }}
          />
        </BarChart>
      </Box>
      <Typography
        variant="body2"
        sx={{ mt: 2, color: 'text.secondary', fontStyle: 'italic' }}
      >
        Average Task Completion Time: {avgTaskCompletionTime} days
      </Typography>
    </Paper>
  );
};

export default EmployeePerformanceChart;
