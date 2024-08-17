import { BoxProps, Checkbox, useTheme } from "@mui/material";
import { Box } from "@mui/system";

export function SelectableRow(props: {
  readonly checked: boolean;
  readonly title: string;
  readonly boxProps?: BoxProps;
}) {
  const { palette } = useTheme();
  return (
    <Box
      component="li"
      {...props.boxProps}
      sx={{
        bgcolor: palette.common.white,
        cursor: "pointer",
        p: "0rem .5rem !important",
      }}
    >
      <Checkbox checked={props.checked} />
      {props.title}
    </Box>
  );
}
