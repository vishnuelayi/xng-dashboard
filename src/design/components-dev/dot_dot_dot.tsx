import { Box } from "@mui/system";

/**
 * Renders a cycling 1-3 dots for use in loading animations. Works best when used inside `p` or Typography tags.
 */
export function DotDotDot() {
  return (
    <Box
      component="span"
      sx={{
        ":before": {
          animation: "dots 2s linear infinite",
          content: "''",
          "@keyframes dots": {
            "0%, 20%": {
              content: "'.'",
            },
            "40%": {
              content: "'..'",
            },
            "60%": {
              content: "'...'",
            },
            "90, 100%": {
              content: "'.'",
            },
          },
        },
      }}
    />
  );
}
