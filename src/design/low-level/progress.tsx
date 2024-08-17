import * as React from "react";
import LinearProgress, { LinearProgressProps } from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function LinearWithValueLabel(props: any) {
  const [progress, setProgress] = React.useState(0);
  const x = props.progress;

  React.useEffect(() => {
    setProgress(x);
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgressWithLabel
        value={progress}
        color="success"
        sx={{ background: "rgba(75,75,75,.2)" }}
      />
    </Box>
  );
}
