import { SxProps, TextField, InputAdornment } from "@mui/material";
import Box from "../components-dev/BoxExtended";
import { XNGICONS, XNGIconRenderer } from "../icons";
import usePalette from "../../hooks/usePalette";
import { getSizing } from "../sizing";
import { XNGButtonSize, getButtonHeight } from "./button_types";
import { ChangeEvent } from "react";

interface IXNGInput {
  size?: XNGButtonSize;
  itype?: JSX.Element;
  disableRenderer?: boolean;
  placeholder?: string;
  onBlur?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: "number" | "text";
  calendarParams?: any;
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  value?: string | number;
  variant?: "Contained" | "Free";
  multiline?: boolean;
  row?: number;
  numberArrows?: boolean;
  width?: string;
  sx?: SxProps;
  label?: string;
  disabled?: boolean;
  startAdornment?: JSX.Element;
}

function XNGInput(props: IXNGInput) {
  const palette = usePalette();
  const SIZE: XNGButtonSize = props.size ? props.size : "default";
  const HEIGHT = getButtonHeight(SIZE);
  const WIDTH = props.width ? props.width : undefined;
  const Render = props.disableRenderer ? props.disableRenderer : undefined;
  const TYPE = props.type ? props.type : "text";
  const CALENDAR = props.calendarParams ? props.calendarParams : {};
  const ROW = props.row ? props.row : 1;
  const Multi = props.multiline ? props.multiline : false;
  const VALUE = props.value ? props.value : undefined;
  const STYLE = props.sx;
  const SX = props.numberArrows
    ? {
        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
          WebkitAppearance: "none",
          margin: 0,
        },
        "& input[type=number]": { MozAppearance: "textfield" },
        ...STYLE,
      }
    : { ...STYLE };
  const ABPAD =
    SIZE === "large" ? ".4rem" : SIZE === "default" ? ".2rem" : SIZE === "small" ? ".1rem" : 0;

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        sx={{
          ".MuiOutlinedInput-input": {
            width: WIDTH,
            height: HEIGHT,
            paddingY: 0,
            paddingX: getSizing(1),
          },
        }}
      >
        <TextField
          label={props.label}
          disabled={props.disabled}
          {...(props.defaultValue ? { defaultValue: props.defaultValue } : {})}
          onBlur={(e) => {
            if (props.onBlur) {
              props.onBlur(e);
            }
          }}
          onChange={(e) => {
            if (props.onChange) {
              props.onChange(e);
            }
          }}
          {...CALENDAR}
          size="small"
          fullWidth
          multiline={Multi}
          minRows={ROW}
          variant="outlined"
          placeholder={props.placeholder}
          type={TYPE}
          value={VALUE}
          sx={[SX, { borderRadius: "4px" }]}
          InputProps={
            props.startAdornment
              ? {
                  startAdornment: (
                    <InputAdornment position="start">{props.startAdornment}</InputAdornment>
                  ),
                }
              : {}
          }
        />
      </Box>
      {props.itype ? (
        <Box sx={{ position: "absolute", top: 0, right: 0, padding: ABPAD }}>
          <XNGIconRenderer
            disableRenderer={Render}
            color={palette.contrasts[0]}
            i={props.itype}
            size="md"
          />
        </Box>
      ) : null}
    </Box>
  );
}

export default XNGInput;
