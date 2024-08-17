import { Stack, Typography, Chip } from "@mui/material";
import usePalette from "../../../../hooks/usePalette";

type Props = {
  title: string;
  count: number;
};

const PageTitle = (props: Props) => {
  const palette = usePalette();
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={1}
      sx={{
        justifyContent: {
          xs: "center",
          sm: "start",
        },
      }}
    >
      <Typography
        variant="h4"
        fontSize={"24px"}
        fontWeight={500}
        whiteSpace={"nowrap"}
      >
        {props.title}
      </Typography>
      <Chip
        label={props.count}
        size="small"
        sx={{
          backgroundColor: palette.danger[4],
          color: "white",
        }}
      />
    </Stack>
  );
};

export default PageTitle;
