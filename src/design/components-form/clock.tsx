import { TextField } from "@mui/material";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Control, Controller, FieldValues, Path, PathValue, UseFormWatch } from "react-hook-form";
import { getSizing } from "../sizing";
import dayjs, { Dayjs } from "dayjs";

type IXNGClock<T extends FieldValues> = {
  control: Control<T, any>;
  label: string;
  name: Path<T>;
  watch: UseFormWatch<T>;
  onAfterChange?: (e: Date | null) => void;
  defaultValue?: Dayjs;
};

export function XNGClockInput<T extends FieldValues>(props: IXNGClock<T>) {
  // console.log(`-----------${props.name} value`, props.watch(props.name))
  // console.log(`-----------${props.defaultValue} default value`, props.watch(props.name))
  // debugger;
  return (
    <Controller
      control={props.control}
      name={props.name}
      defaultValue={
        props.defaultValue
          ? (props.defaultValue as PathValue<T, Path<T>>)
          : (null as PathValue<T, Path<T>>)
      } // forces to default to current date
      render={({ field: { onChange } }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label={props.label}
            value={
              (props.watch(props.name) as object) instanceof Date
                ? dayjs(props.watch(props.name))
                : props.watch(props.name)
            }
            onChange={(e) => {
              onChange(e);
              if (props.onAfterChange) {
                // @ts-ignore
                props.onAfterChange(e);
              }
            }}
            slotProps={{
              textField: {
                InputProps: {
                  size: "small",
                  fullWidth: true,
                },
              },
            }}
            sx={{
              minWidth: getSizing(15),
              ".MuiInputBase-root": { padding: 0 },
              button: { transform: `translateX(${getSizing(-1.5)})` },
            }}
          />
        </LocalizationProvider>
      )}
    />
  );
}
