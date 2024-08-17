//Original Version

import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useApi } from '../../../context/apiContext';
import { ProgressBarProps } from '../types';

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 15,
  borderRadius: 8,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    backgroundColor: '#3cb48c',
  },
}));

const ProgressLabel = styled(Typography)({
  marginBottom: 4,
  display: 'flex',
  gap: 4,
});


const ProgressBar: React.FC<ProgressBarProps> = ({ label, value }) => (
  <Box sx={{ mb: 2 }}>
    <ProgressLabel variant="body1">
      <span>{label}</span>
      <span>{value.toFixed(2)}%</span>
    </ProgressLabel>
    <StyledLinearProgress variant="determinate" value={value} />
  </Box>
);

const ProgressBars: React.FC = () => {

  const { apiValue, isLoading, error } = useApi();
 
  

  const percentOfGoalComplete: number = apiValue?.reimbursementGoalReports?.[0]?.percentOfGoalComplete || 0;
  const percentOfYearComplete: number = apiValue?.reimbursementGoalReports?.[0]?.percentOfYearComplete || 0;


  return (
    <Box sx={{ width: '100%', maxWidth: '500px', paddingY:2 }}>
      <ProgressBar label="Goal Achieved:" value={percentOfGoalComplete * 100} />
      <ProgressBar label="Year Complete:" value={percentOfYearComplete * 100} />
    </Box>
  );
};

export default ProgressBars;




// Tooltiped Version

// import React, { useState } from 'react';
// import { Box, Typography, LinearProgress, Tooltip } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import { useApi } from '../context/apiContext';

// const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
//   height: 15,
//   borderRadius: 8,
//   backgroundColor: theme.palette.grey[200],
//   '& .MuiLinearProgress-bar': {
//     borderRadius: 5,
//     backgroundColor: '#3cb48c',
//   },
//   cursor: 'pointer',
// }));

// const ProgressLabel = styled(Typography)({
//   marginBottom: 4,
//   display: 'flex',
//   justifyContent: 'space-between',
// });

// interface ProgressBarProps {
//   label: string;
//   value: number;
// }

// const ProgressBar: React.FC<ProgressBarProps> = ({ label, value }) => {
//   const [isHovering, setIsHovering] = useState(false);

//   return (
//     <Box sx={{ mb: 2 }}>
//       <ProgressLabel variant="body1">
//         <span>{label}</span>
//         <span>{value.toFixed(2)}%</span>
//       </ProgressLabel>
//       <Tooltip
//         title={`${value.toFixed(2)}% completed`}
//         placement="top"
//         arrow
//         open={isHovering}
//       >
//         <StyledLinearProgress
//           variant="determinate"
//           value={value}
//           onMouseEnter={() => setIsHovering(true)}
//           onMouseLeave={() => setIsHovering(false)}
//         />
//       </Tooltip>
//     </Box>
//   );
// };

// const ProgressBars: React.FC = () => {
//   const { apiValue, isLoading, error } = useApi();

//   const percentOfGoalComplete: number = apiValue?.reimbursementGoalReports?.[0]?.percentOfGoalComplete || 0;
//   const percentOfYearComplete: number = apiValue?.reimbursementGoalReports?.[0]?.percentOfYearComplete || 0;

//   return (
//     <Box sx={{ width: '100%', maxWidth: '500px', paddingY: 2 }}>
//       <ProgressBar label="Goal Achieved:" value={percentOfGoalComplete * 100} />
//       <ProgressBar label="Year Complete:" value={percentOfYearComplete * 100} />
//     </Box>
//   );
// };

// export default ProgressBars;



//Animated Version

// import React, { useState } from 'react';
// import { Box, Typography, LinearProgress, Tooltip } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import { motion, AnimatePresence } from 'framer-motion';

// const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
//   height: 15,
//   borderRadius: 8,
//   backgroundColor: theme.palette.grey[200],
//   '& .MuiLinearProgress-bar': {
//     borderRadius: 5,
//     backgroundColor: '#3cb48c',
//   },
//   cursor: 'pointer',
// }));

// const ProgressLabel = styled(Typography)({
//   marginBottom: 4,
//   display: 'flex',
//   justifyContent: 'space-between',
// });

// const DetailBox = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(2),
//   backgroundColor: theme.palette.grey[100],
//   borderRadius: 8,
//   width: '100%',
// }));

// interface ProgressBarProps {
//   label: string;
//   value: number;
//   details: {
//     paid: number;
//     billed: number;
//     goal: number;
//   };
// }

// const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, details }) => {
//   const [isHovering, setIsHovering] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);

//   return (
//     <Box sx={{ mb: 2, overflow: 'hidden' }}>
//       <ProgressLabel variant="body1">
//         <span>{label}</span>
//         <span>{value.toFixed(2)}%</span>
//       </ProgressLabel>
//       <AnimatePresence initial={false}>
//         {!isExpanded ? (
//           <motion.div
//             key="progress"
//             initial={{ x: '-100%' }}
//             animate={{ x: 0 }}
//             exit={{ x: '-100%' }}
//             transition={{ type: 'tween', duration: 0.3 }}
//           >
//             <Tooltip
//               title={`${value.toFixed(2)}% completed`}
//               placement="top"
//               arrow
//               open={isHovering}
//             >
//               <StyledLinearProgress
//                 variant="determinate"
//                 value={value}
//                 onMouseEnter={() => setIsHovering(true)}
//                 onMouseLeave={() => setIsHovering(false)}
//                 onClick={() => setIsExpanded(true)}
//               />
//             </Tooltip>
//           </motion.div>
//         ) : (
//           <motion.div
//             key="details"
//             initial={{ x: '100%' }}
//             animate={{ x: 0 }}
//             exit={{ x: '100%' }}
//             transition={{ type: 'tween', duration: 0.3 }}
//           >
//             <DetailBox onClick={() => setIsExpanded(false)}>
//               <Typography variant="body2">Paid: ${details.paid.toFixed(2)}</Typography>
//               <Typography variant="body2">Billed: ${details.billed.toFixed(2)}</Typography>
//               <Typography variant="body2">Goal: ${details.goal.toFixed(2)}</Typography>
//             </DetailBox>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </Box>
//   );
// };

// const ProgressBars: React.FC = () => {
//   // Dummy data for development purposes
//   const dummyApiValue = {
//     reimbursementGoalReports: [{
//       percentOfGoalComplete: 0.75,
//       percentOfYearComplete: 0.42,
//       paid: 150000,
//       billed: 200000,
//       goal: 300000,
//       yearPaid: 420000,
//       yearBilled: 500000,
//       yearGoal: 1000000
//     }]
//   };

//   const percentOfGoalComplete: number = dummyApiValue.reimbursementGoalReports[0].percentOfGoalComplete;
//   const percentOfYearComplete: number = dummyApiValue.reimbursementGoalReports[0].percentOfYearComplete;

//   const goalDetails = {
//     paid: dummyApiValue.reimbursementGoalReports[0].paid,
//     billed: dummyApiValue.reimbursementGoalReports[0].billed,
//     goal: dummyApiValue.reimbursementGoalReports[0].goal,
//   };

//   const yearDetails = {
//     paid: dummyApiValue.reimbursementGoalReports[0].yearPaid,
//     billed: dummyApiValue.reimbursementGoalReports[0].yearBilled,
//     goal: dummyApiValue.reimbursementGoalReports[0].yearGoal,
//   };

//   return (
//     <Box sx={{ width: '100%', maxWidth: '500px', paddingY: 2 }}>
//       <ProgressBar label="Goal Achieved:" value={percentOfGoalComplete * 100} details={goalDetails} />
//       <ProgressBar label="Year Complete:" value={percentOfYearComplete * 100} details={yearDetails} />
//     </Box>
//   );
// };

// export default ProgressBars;