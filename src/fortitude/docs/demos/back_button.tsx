import { Stack, Typography } from "@mui/material";
import MSBBack from "../../components/button_back";

function BackButtonDemo() {
  return (
    <Stack gap="2rem">
      <Typography>Our standard component for creating back buttons.</Typography>

      <Stack gap="1rem">
        <Typography variant="h6">Component Example</Typography>
        <MSBBack onClick={() => {}} />
      </Stack>
    </Stack>
  );
}

export default BackButtonDemo;
