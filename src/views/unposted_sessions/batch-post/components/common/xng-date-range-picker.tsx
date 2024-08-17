import "dayjs/locale/en-gb";
import { type Dayjs } from "dayjs";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const DatePicker = styled(MuiDatePicker<Dayjs>)(() => ({
  width: "200px",
  textField: {
    textAlign: "center",
  },
}));

interface IXNGDateRangePicker<T = Dayjs> {
  start: T;
  end: T;
  onChange: (dateRange: { start: T; end: T }) => void;
}

export default function XNGDateRangePicker({ start, end, onChange }: IXNGDateRangePicker) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
      <Box sx={{ display: "inline-flex", alignItems: "center" }}>
        <DatePicker
          label="Start Date"
          maxDate={end}
          value={start}
          onChange={(value) =>
            onChange({
              start: value!,
              end,
            })
          }
          sx={{
            "div.MuiInputBase-root": {
              borderRadius: "5px 0 0 5px",
            },
          }}
        />

        <Typography
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            aspectRatio: "1/1",
            color: "#555555",
            backgroundColor: "#c4c4c4",
            padding: "16px",
          }}
          component="span"
        >
          to
        </Typography>

        <DatePicker
          label="End Date"
          minDate={start}
          value={end}
          onChange={(value) =>
            onChange({
              start,
              end: value!,
            })
          }
          sx={{
            "div.MuiInputBase-root": {
              borderRadius: "0 5px 5px 0",
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}
