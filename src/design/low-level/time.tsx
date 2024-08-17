import dayjs, { Dayjs } from "dayjs";
import { XNGButtonSize } from "./button_types";
import { TimePicker } from "@mui/x-date-pickers";

interface IXNGTimePicker {
  size?: XNGButtonSize;
  value: Dayjs | null;
  onChange: (v: Dayjs | null) => void;
  disabled?: boolean;
}

// This is purely a presentational, or "dumb" component. This is not to house any of its own state. It should only ever provide callbacks.
// See more:
// https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
// https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
export default function XNGTimePicker(props: IXNGTimePicker) {
  const { overrideWidth } = useStylesBasedOnSizeParameter(props.size ?? "default");

  return (
    <TimePicker
      value={props.value}
      onChange={(v) => props.onChange(v)}
      slotProps={{
        textField: {
          sx: { width: overrideWidth },
          value: props.value,
        },
      }}
      disabled={props.disabled}
    />
  );
}

function useStylesBasedOnSizeParameter(size: XNGButtonSize) {
  function getWidthBasedOnSize(): string {
    switch (size) {
      case "large":
        return "18rem";
      case "default":
        return "10rem";
      case "small":
        return "5rem";
      case "tiny":
        return "1rem";
    }
  }

  return { overrideWidth: getWidthBasedOnSize() };
}
