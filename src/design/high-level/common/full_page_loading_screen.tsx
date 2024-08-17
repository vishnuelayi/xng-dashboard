import { Box, Typography } from "@mui/material";
import XNGSpinner from "../../low-level/spinner";
import { BoxProps } from "@mui/system";

type Props = {
  text: string;
  text_sx?: BoxProps["sx"];
  pulse?: boolean;
};

const FullPageLoadingScreen = (props: Props) => {
  return (
    <Box
      height={"100vh"}
      width={"100%"}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      position={"fixed"}
      bgcolor={"rgba(0, 0, 0, 0.12)"}
      top={"0"}
      left={"0"}
      gap={3}
      zIndex={1000}
    >
      <XNGSpinner />
      <Typography
        variant="h5"
        color={"primary.3"}
        textAlign={"center"}
        sx={{
          ...props.text_sx,
          "@keyframes pulse": {
            "0%": {
              transform: "scale(1)",
              opacity: 0.5,
            },
            "50%": {
              transform: "scale(1.05)",
              opacity: 1,
            },
            "100%": {
              transform: "scale(1)",
              opacity: 0.5,
            },
          },
          animation: props.pulse ? "pulse 1.5s ease-in-out infinite" : "none",
        }}
      >
        {props.text}
      </Typography>
    </Box>
  );
};

export default FullPageLoadingScreen;
