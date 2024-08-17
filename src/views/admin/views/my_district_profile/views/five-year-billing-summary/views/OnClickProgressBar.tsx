import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { useApi } from "../../../context/apiContext";
import { formatDate } from "../components/FormatDate";

const ProgressContainer = styled(Box)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.grey[200],
  },
  borderRadius: 8,
  padding: theme.spacing(2, 2),
  cursor: "pointer",
  marginBottom: theme.spacing(2),
}));

const ProgressBar = styled(Box)<{ width: number }>(({ width }) => ({
  height: 15,
  borderRadius: 8,
  backgroundColor: "#3cb48c",
  width: `${width}%`,
}));

const DetailBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  borderRadius: 8,
  padding: theme.spacing(1.5, 2),
  marginBottom: theme.spacing(2),
  display: "flex",
}));

interface ProgressBarProps {
  year: number;
  value: number;
  actualPercentage: number;
  details: {
    earliestRS: string;
    latestRS: string;
    earliest835: string;
    latest835: string;
  };
}

const ProgressBarComponent: React.FC<ProgressBarProps> = ({ year, value, details, actualPercentage }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <AnimatePresence initial={false} mode="wait">
      {!isExpanded ? (
        <motion.div
          key="progress"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ type: "tween", duration: 0.3 }}
        >
          <ProgressContainer
            onClick={() => setIsExpanded(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body1">{year}</Typography>
              {!isHovered && <Typography variant="body1">{(actualPercentage * 100).toFixed(2)}%</Typography>}
              {isHovered && <Typography variant="body1">{(actualPercentage * 100).toFixed(2)}% of goal achieved</Typography>}
            </Box>
            <ProgressBar width={value} />
          </ProgressContainer>
        </motion.div>
      ) : (
        <motion.div
          key="details"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ type: "tween", duration: 0.3 }}
        >
          <DetailBox onClick={() => setIsExpanded(false)}>
            <Typography variant="body2">Earliest R&S: {details.earliestRS}</Typography>
            <Typography variant="body2">Latest R&S: {details.latestRS}</Typography>
            <Typography variant="body2">Earliest 835: {details.earliest835}</Typography>
            <Typography variant="body2">Latest 835: {details.latest835}</Typography>
          </DetailBox>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const OnClickProgressBar: React.FC = () => {
  const { apiValue, isLoading, error } = useApi();
  const [data, setData] = useState<ProgressBarProps[]>([]);

  useEffect(() => {
    if (apiValue?.fiveYearSummaryReports) {
      const newData = apiValue.fiveYearSummaryReports.map((report) => ({
        year: report.year || 0,
        value: report.percentComplete !== undefined ? (report.percentComplete > 1 ? 1 : report.percentComplete) : 0,
        actualPercentage: report.percentComplete || 0,
        details: {
          earliestRS: formatDate(report.earliestRNS?.toString()) || "",
          latestRS: formatDate(report.latestRNS?.toString()) || "",
          earliest835: formatDate(report.earliest835?.toString()) || "",
          latest835: formatDate(report.latest835?.toString()) || "",
        },
      }));
      setData(newData);
    }
  }, [apiValue]);

  if (isLoading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "500px" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "500px" }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "450px", height: "500px", marginTop: 4 }}>
      {data.map((item, index) => (
        <ProgressBarComponent
          key={index}
          year={item.year}
          value={item.value * 100}
          details={item.details}
          actualPercentage={item.actualPercentage}
        />
      ))}
    </Box>
  );
};

export default OnClickProgressBar;
