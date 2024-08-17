import { Typography } from "@mui/material";
import Box from "../../../design/components-dev/BoxExtended";
import { FloatingLayout, NextButtonJustifiedRight, HEADER_SIZE, BLUE_BACKGROUND } from "../layout";
import { getSizing } from "../../../design/sizing";

export default function InactiveUserView(props: { onLogout: () => void }) {
  return (
    <Box sx={BLUE_BACKGROUND}>
      <FloatingLayout>
        <Typography variant={HEADER_SIZE}>Inactive User</Typography>
        <Typography sx={{ marginTop: getSizing(2), textAlign: "justify" }} variant="body1">
          {MESSAGE}
        </Typography>
        <NextButtonJustifiedRight overrideText="Logout" onNext={() => props.onLogout()} />
      </FloatingLayout>
    </Box>
  );
}

const MESSAGE = "Your user has been deactivated. Please contact your district admin for access";
