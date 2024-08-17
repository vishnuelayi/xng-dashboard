import { Stack, Typography } from "@mui/material";
import StaffDirectoryHomePageFilter from "./staff_directory_home_page_filter";
import { MaxWidthWrapper } from "../../../../../components/max_width_wrapper";

const StaffDirectoryHeader = () => {
  return (
    <Stack mb={3}>
      <MaxWidthWrapper>
        <Stack
          direction={"row"}
          gap={4}
          alignItems={"center"}
          sx={{
            flexDirection: {
              flexDirection: "column",
              md: "row",
            },

            justifyContent: {
              justifyContent: "center",
              // sm: "flex-start"
            },
          }}
        >
          <Typography fontWeight={500} fontSize={24} variant="h1" sx={{ whiteSpace: "nowrap" }}>
            Staff Directory
          </Typography>
          <StaffDirectoryHomePageFilter />
        </Stack>
      </MaxWidthWrapper>
    </Stack>
  );
};

export default StaffDirectoryHeader;
