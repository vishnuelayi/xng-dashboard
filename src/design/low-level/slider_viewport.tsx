import { Box } from "@mui/material";

export function XNGSliderViewport(props: {
  selectedSlideIndex: number;
  children: React.ReactNode;
  speedSeconds?: number;
}) {
  return (
    <Box sx={{ overflowX: "hidden", minWidth: "100%" }}>
      <Box
        sx={{
          transform: `translateX(calc(${-props.selectedSlideIndex} * 100%))`,
          display: "flex",
          transition: `transform ${props.speedSeconds ?? 0.4}s ease`,
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
}

export function XNGSlide(props: { children: React.ReactNode }) {
  return (
    <Box sx={{ flexShrink: 0, minWidth: "100%", width: "100%", overflowX: "auto" }}>
      {props.children}
    </Box>
  );
}
