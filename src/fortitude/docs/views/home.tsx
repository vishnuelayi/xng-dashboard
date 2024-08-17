import { Box, ButtonBase, Link, Typography, useTheme } from "@mui/material";

export function Home(props: { preloadedImg: string }) {
  const { palette } = useTheme();

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
        <Box component="img" src={props.preloadedImg} />
        <Typography variant="h6" sx={{ color: "#0008" }} className="noselect">
          Integrated Documentation
        </Typography>
      </Box>
      <Typography mt="1.5rem">
        Welcome to the official Fortitude documentation. Fortitude is MSB's completely customized
        superset library built on top of MUI.
      </Typography>
      <Typography variant="h6">What is MUI?</Typography>
      <Typography>
        MUI is a component library built and maintained by Google which was selected as our primary
        component library for front end development efficiency and stability. All of its available
        components can be found below!
      </Typography>
      <ButtonBase
        onClick={() =>
          window.open("https://mui.com/material-ui/all-components/", "_blank")?.focus()
        }
        sx={{
          height: "4rem",
          borderRadius: "4px",
          ":hover": {
            bgcolor: palette.grey[100],
          },
        }}
      >
        <Typography>
          <b>View all of our UI capabilities with MUI: </b>
          <Link>https://mui.com/material-ui/all-components/</Link>
        </Typography>
      </ButtonBase>

      <Typography variant="h6">So how does Fortitude come into play?</Typography>
      <Typography>
        While MUI is an extensive library, it only lays the foundation for a larger product. Our
        custom <b>Radio Table</b>, for example, is not available in MUI. We grow Fortitude and make
        contributions toward it on an as-needed basis in unison with feature development in order to
        move as quickly as possible.
      </Typography>
    </>
  );
}
