import { Button, MenuItem, Select, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import MSBInputErrorWrapper from "../../components/input_error_wrapper";

const InputErrorWrapperDemo = () => {
  const options = ["Option 1", "Option 2", "Option 3"];
  const [selectedOption, setselectedOption] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(true);

  return (
    <Stack gap="2rem">
      <Typography>
        Our standard component for wrapping input components that typically depend on an API request
        for it's data or options. This component will display an error message and a refresh icon to
        retry the api request upon request failure.
      </Typography>

      <Stack gap="1rem">
        <Typography variant="h6">Component Example</Typography>
        <MSBInputErrorWrapper
          isError={isError}
          errorText="Error Loading Options, please click refresh icon to retry"
          refetch={() => setIsError(false)}
        >
          <Select
            value={selectedOption}
            onChange={(e) => setselectedOption(e.target.value)}
            label="Select an option"
            fullWidth
            disabled={isError}
            size="small"
          >
            {options.map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </MSBInputErrorWrapper>
        {!isError && (
          <Button sx={{ width: "50%" }} onClick={() => setIsError(true)}>
            Trigger Error
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default InputErrorWrapperDemo;
