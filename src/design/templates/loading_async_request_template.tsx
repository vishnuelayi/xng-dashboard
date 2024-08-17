import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";

/**
 * For use as a feedback message when a report generation request is offloaded in some way.
 */
export function LoadingAsyncResponseMessageTemplate(
  props: Readonly<{
    title?: string;
    widthAnchor?: string;
    extraContent?: React.ReactNode;
  }>,
) {
  return (
    <Paper sx={{ boxShadow: 4 }}>
      <Box
        sx={{
          gap: "2rem",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: `calc(100vw - ${props.widthAnchor ?? "9rem"})`,
          maxWidth: "50rem",
        }}
      >
        <Typography
          className="noselect"
          variant="h5"
          sx={{ display: "inline", textAlign: "center" }}
        >
          {props.title ?? "Hang tight! We're gathering info for you"}
        </Typography>

        <Box sx={{ width: "100%" }}>
          <Typography
            className="noselect"
            variant="h6"
            sx={{
              fontWeight: 300,
              ...SX_ANIMATION_PULSE,
              textAlign: "center",
            }}
          >
            This will only be a moment. You can use other parts of the application while you wait
          </Typography>
        </Box>

        {props.extraContent}
      </Box>
    </Paper>
  );
}

const SX_ANIMATION_PULSE = {
  animation: "pulse 1.5s infinite ease-in-out",
  "@keyframes pulse": {
    "0%, 100%": {
      opacity: 0.5,
    },
    "50%": {
      opacity: 1,
    },
  },
};
