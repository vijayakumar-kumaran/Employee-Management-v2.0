import React from 'react';
import { Box, Card, CardContent, Typography, Avatar, Grid2 as Grid, Chip, Divider } from '@mui/material';
import { Building2, User, Shield } from 'lucide-react';
import StatusChip from './StatusChip';

const OrgChartTree = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body1">No department organization data available.</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {data.map((dept, idx) => (
        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={idx}>
          <Card
            sx={{
              borderRadius: '16px',
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: 'primary.main',
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                    <Building2 size={20} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', fontFamily: "'Outfit', sans-serif" }}>
                      {dept.department}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {dept.headCount} Team Member{dept.headCount === 1 ? '' : 's'}
                    </Typography>
                  </Box>
                </Box>
                <Chip label="Department" size="small" variant="outlined" sx={{ borderRadius: '6px', fontWeight: 600 }} />
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Team Members
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {dept.members && dept.members.map((member) => (
                  <Box
                    key={member._id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      p: 1.2,
                      borderRadius: '10px',
                      bgcolor: 'action.hover',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: '0.85rem', bgcolor: 'secondary.main' }}>
                        {(member.name || 'E')[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                          {member.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {member.designation}
                        </Typography>
                      </Box>
                    </Box>
                    <StatusChip status={member.status} />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default OrgChartTree;
