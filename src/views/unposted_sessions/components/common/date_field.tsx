import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { TextFieldProps } from '@mui/material/TextField';
import { FormHelperText } from '@mui/material';
import { Dayjs } from 'dayjs';


type Props = {
  label: TextFieldProps["label"];
  size?: TextFieldProps["size"];
  borderStyle?: "rounded" | "square";
  disableOpenPicker?: DatePickerProps<Date>["disableOpenPicker"];
  fullWidth?: boolean;
  views?: DatePickerProps<Dayjs>["views"];
  value?: DatePickerProps<Dayjs>["value"];
  defaultValue?: DatePickerProps<Dayjs>["defaultValue"];
  onChange?: DatePickerProps<Dayjs>["onChange"];
  useError?: string;
}

export type { Props as XNGDateFieldProps };

export const XNGDateField = (props: Props) => {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker views={props.views} disableOpenPicker={props.disableOpenPicker} slotProps={{
        textField: {
          size: props.size, InputProps: {
            sx: { borderRadius: props.borderStyle === "square" ? "0px" : undefined, }
          },
          helperText: <FormHelperText component={"span"} error={!!props.useError} sx={{ marginInline: 0 }}>
          {props.useError}
        </FormHelperText>,
          fullWidth: props.fullWidth
        }
      }} label={props.label} value={props.value} onChange={props.onChange} />
    </LocalizationProvider>
  )
}
