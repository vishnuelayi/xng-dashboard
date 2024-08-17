import { Typography } from "@mui/material";

export function Capitalize(props: { children: React.ReactNode }) {
  return (
    <Typography
      display={"inline-block"}
      variant="inherit"
      sx={{
        textTransform: "lowercase",
        ":first-letter": { textTransform: "uppercase" },
      }}
    >
      {props.children}
    </Typography>
  );
}
