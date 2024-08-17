import { Box, ListItem, Typography } from "@mui/material";

type Props = {
  title: string;
  children: React.ReactNode;
};

const TabViewPortSubSection = (props: Props) => {
  return (
    <ListItem
      divider
      sx={{
        flexDirection: "column",
        alignItems: "flex-start",

        py: "2rem",
      }}
    >
      <Typography variant="h6" mb={2}>
        {props.title}
      </Typography>
      <Box width={"100%"}>{props.children}</Box>
    </ListItem>
  );
};

export default TabViewPortSubSection;
