import * as React from "react";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { XNGButtonSize } from "./button_types";
import Box from "../components-dev/BoxExtended";

export interface IXNGDatePicker {
  title?: string;
  size?: XNGButtonSize;
  fullwidth?: boolean;
  setValue: React.Dispatch<React.SetStateAction<Dayjs | null>>;
  defaultValue?: Dayjs | null;
  label?: string;
  onChange?: (value: Dayjs | null) => void;
}

export default function XNGDatePicker(props: IXNGDatePicker) {
  const [value, setValue] = React.useState<Dayjs | null>(null);
  const TITLE = props.title ? props.title : "MM/DD/YYYY";

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={value !== null ? value : props.defaultValue}
          onChange={(newValue) => {
            setValue(newValue!);
            props.setValue!(newValue!);
            props.onChange && props.onChange(newValue);
          }}
          sx={{ "&.MuiInputBase-root": { height: "40px" } }}
          slotProps={{
            textField: {
              InputProps: {
                size: props?.size === "large" ? "medium" : "small",
                placeholder: TITLE,
              },
            },
          }}
          label={props.label}
        />
      </LocalizationProvider>
    </Box>
  );
}
