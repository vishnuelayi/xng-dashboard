import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { CustomCircularProgressBarProps } from '../types/custom-circular-progress';

// Custom styles for the CircularProgress component
const CustomCircularProgress = styled(CircularProgress)(({ theme }) => ({
  '& .MuiCircularProgress-circle': {
    strokeLinecap: 'round',
  },
}));

const CustomCircularProgressBar: React.FC<CustomCircularProgressBarProps> = ({
  value,
  size = 20,
  thickness = 4,
  progressColor = '#3cb48c', // Default progress color is green
  circleColor = '#bdbdbd', // Default circle background color is gray
}) => {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={thickness}
        color="inherit" // Set color to 'inherit' to avoid TypeScript error
        sx={{ color: circleColor, opacity: 0.3 }}
      />
      <CircularProgress
        variant="determinate"
        value={value}
        size={size}
        thickness={thickness}
        color="inherit" // Set color to 'inherit' to avoid TypeScript error
        sx={{ color: progressColor, position: 'absolute', top: 0, left: 0 }}
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
        >{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
};

export default CustomCircularProgressBar;
