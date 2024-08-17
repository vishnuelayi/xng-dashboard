import { Stack, Typography } from "@mui/material";
import MSBClose from "../../components/button_close";

function CloseButtonDemo() {
  return (
    <Stack gap="2rem">
      <Typography>
        Our standard component for creating close buttons. Most commonly found on our modals.
      </Typography>

      <Stack gap="1rem">
        <Typography variant="h6">Component Example</Typography>
        <MSBClose onClick={() => {}} />
      </Stack>
    </Stack>
  );
}

export default CloseButtonDemo;
