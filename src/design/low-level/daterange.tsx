import { Stack } from "@mui/material";
import XNGDatePicker, { IXNGDatePicker } from "./calendar";

type Props = {
  useStartDate: IXNGDatePicker;
  useEndDate: IXNGDatePicker;
};

const XNGDateRange = (props: Props) => {
  return (
    <Stack
      gap={2}
      sx={{
        flexDirection: {
          flexDirection: "column",
          sm: "row",
        },
        width: {
          width: "100%",
          sm: "fit-content",
        },
      }}
    >
      <XNGDatePicker
        setValue={props.useStartDate.setValue}
        defaultValue={props.useStartDate.defaultValue}
        label={props.useStartDate.label}
        title={props.useStartDate.label}
        size={props.useStartDate.size}
      />

      <XNGDatePicker
        setValue={props.useEndDate.setValue}
        defaultValue={props.useEndDate.defaultValue}
        label={props.useEndDate.label}
        title={props.useEndDate.label}
        size={props.useEndDate.size}
      />
    </Stack>
  );
};

export default XNGDateRange;
