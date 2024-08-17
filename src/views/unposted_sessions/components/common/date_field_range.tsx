import { Box, Stack } from "@mui/material";

import React from "react";
import { XNGDateField, XNGDateFieldProps } from "./date_field";

type Props = {
  maxWidth?: string;
  useStartDate: XNGDateFieldProps;
  useEndDate: XNGDateFieldProps;
};

const DateFieldRange = (props: Props) => {
  return (
    <Stack direction={"row"} maxWidth={props.maxWidth}>
      <XNGDateField
        label={props.useStartDate.label}
        size={props.useStartDate.size}
        borderStyle={props.useStartDate.borderStyle}
        fullWidth={props.useStartDate.fullWidth}
        defaultValue={props.useStartDate.defaultValue}
        value={props.useStartDate.value}
        onChange={props.useStartDate.onChange}
      />
      <Box bgcolor={"#D9D9D9"} p={1}>
        to
      </Box>
      <XNGDateField
        label={props.useEndDate.label}
        size={props.useEndDate.size}
        borderStyle={props.useEndDate.borderStyle}
        fullWidth={props.useEndDate.fullWidth}
        defaultValue={props.useEndDate.defaultValue}
        value={props.useEndDate.value}
        onChange={props.useEndDate.onChange}
      />
    </Stack>
  );
};

export default DateFieldRange;
