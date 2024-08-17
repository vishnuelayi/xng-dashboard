import { Box, Stack, StackProps, TextFieldProps } from "@mui/material";

import { DatePicker, DatePickerProps } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

/**
 *  represents the properties for the `msb_date_range_select` component.
 */
type Props = {
  sx?: StackProps["sx"];
  size?: TextFieldProps["size"];
  startDatePickerProps?: DatePickerProps<Dayjs>;
  endDatePickerProps?: DatePickerProps<Dayjs>;
};

/**
 * Renders a component which extends MUI's date picker component, 
 * which is a composition of two MUI date picker components.
 *
 * @component
 * @param {Props} props - The component props.
 * @returns {JSX.Element} - The rendered component.
 */
const MSBDateRangeSelect = (props: Props): JSX.Element => {
  const getDateRangeSelectProps = useDateRangeSelectProps(props);

  return (
    <Stack direction={"row"} sx={props.sx} alignItems={"center"}>
      <DatePicker {...getDateRangeSelectProps(props?.startDatePickerProps)} />
      <Box
        bgcolor={"contrasts.2"}
        p={1}
        display={"flex"}
        alignSelf={"stretch"}
        alignItems={"center"}
        sx={{ aspectRatio: "1 / 1" }}
      >
        to
      </Box>
      <DatePicker {...getDateRangeSelectProps(props?.endDatePickerProps)} />
    </Stack>
  );
};

/**
 * Returns the range picker props with default values for the MSBDateRangeSelect component.
 * @param props - The component props.
 * @returns The range picker props.
 */
const useDateRangeSelectProps = (props: Props) => {
  return (datePickerProp?: DatePickerProps<Dayjs>) => {
    const dateRangeOverride = datePickerProp ?? {};
    dateRangeOverride.sx = dateRangeOverride.sx || {};
    (dateRangeOverride.sx as any)["& .MuiOutlinedInput-root"] = { borderRadius: "0px" };

    dateRangeOverride.slotProps = dateRangeOverride.slotProps || {};
    dateRangeOverride.slotProps.textField = dateRangeOverride.slotProps.textField || {};
    (dateRangeOverride.slotProps.textField as TextFieldProps).size = !props.size
      ? "small"
      : props.size;

    return dateRangeOverride;
  };
};

export default MSBDateRangeSelect;
