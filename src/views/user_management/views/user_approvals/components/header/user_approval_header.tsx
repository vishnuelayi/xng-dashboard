import { Stack, Typography } from "@mui/material";

const UserApprovalHeader = () => {
  return (
    <Stack gap={4} mb={2}>
      <Typography variant="h2" fontWeight={400} fontSize={"24px"} component={"h3"}>
        User Approvals
      </Typography>
    </Stack>
  );
};

export default UserApprovalHeader;
