import React from 'react';
import { Card as MuiCard, CardContent, Typography, Box, Divider } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(MuiCard, {
  shouldForwardProp: (prop) => prop !== 'bgColor' && prop !== 'gradientColor',
})(({ bgColor, gradientColor }) => ({
  background: `linear-gradient(135deg, ${bgColor}, ${gradientColor})`,
  color: '#fff',
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  overflow: 'hidden',
  position: 'relative',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.3)',
  },
}));

const StyledIconContainer = styled(Box)(() => ({
  position: 'absolute',
  top: '4px',
  right: '16px',
  zIndex: 1,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '50px',
  height: '50px',
}));

const Card = ({ title, value, bgColor, gradientColor, icon, onClick }) => {
  return (
    <StyledCard bgColor={bgColor} gradientColor={gradientColor} onClick={onClick}>
      <StyledIconContainer>{icon}</StyledIconContainer>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', marginY: 1 }} />
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default Card;
