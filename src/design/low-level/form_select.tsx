import { TextField, MenuItem, FormControl, Menu, Typography, SxProps } from "@mui/material";
import Box from "../components-dev/BoxExtended";
import { useState } from "react";
import { XNGErrorFeedback } from "../components-form/_error";
import DropdownIndicator from "./dropdown_indicator";
import { getSizing } from "../sizing";
import { placeholderForFutureLogErrorText } from "../../temp/errorText";

type StyleVariant = "minimal" | "default";

export type IXNGNonformSelect<T> = {
  items: T[];
  label: string;
  /** Default value is required by design. This is the only way to render no selected value while remaining a controlled component. If you don't intend to use one of your options as a default value, pass the Default<T> variant of your object here. (I.E., JSONs become {}, strings become "")*/
  defaultValue: T;
  onSelect: (t: T) => void;
  getOptionLabel: (option: T) => string | undefined;
  getOptionCallback?: (option: T) => void;
  variant?: StyleVariant;
};

export function XNGNonformSelect<T>(props: IXNGNonformSelect<T>) {
  if (props.defaultValue === undefined)
    throw new Error(
      placeholderForFutureLogErrorText +
        " | XNGFormSelect can't be invoked unless default value is populated. If the select component's items prop depends on an API fulfillment, simply render only when populated. Use a double-ampersand before components render, for example.",
    );

  const [selectValue, setSelectValue] = useState<T>(props.defaultValue);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const variant: StyleVariant = props.variant ?? "default";

  function getStyleVariantMenuOption(variant: StyleVariant, item: T) {
    switch (variant) {
      case "default":
        return <Typography variant="body1">{props.getOptionLabel(item)}</Typography>;
      case "minimal":
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: getSizing(1) }}>
            <DropdownIndicator size="sm" open={Boolean(anchorEl)} />
            <Typography variant="body1">{props.getOptionLabel(item)}</Typography>
          </Box>
        );
    }
  }

  return (
    <FormControl fullWidth sx={getStyleVariation(variant).formControl}>
      <Box onClick={handleClick} sx={{ cursor: "pointer" }}>
        <TextField
          fullWidth
          variant="standard"
          size="small"
          select
          sx={{ pointerEvents: "none" }}
          label={props.label}
          value={props.getOptionLabel(selectValue)}
        >
          {/* This is NOT for display, it's here to provide values to the MUI TextField since they don't provide an intuitive way to do so like an attribute. Sorry for the lack of clarity here. */}
          {/* These ARE the values used for the closed-select's input display, however. */}
          {props.items.map((item, i) => {
            // assign value as indexer
            return (
              <MenuItem key={i} value={props.getOptionLabel(item)}>
                {getStyleVariantMenuOption(variant, item)}
              </MenuItem>
            );
          })}
        </TextField>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {props.items.map((item, i) => {
          return (
            <MenuItem
              onClick={() => {
                handleClose();
                setSelectValue(item);
                props.onSelect(item);
                if (props.getOptionCallback) {
                  props.getOptionCallback(item);
                }
              }}
              key={i}
              value={i}
            >
              {props.getOptionLabel(item)}
            </MenuItem>
          );
        })}
      </Menu>
    </FormControl>
  );
}

interface StyleVariantGuide {
  formControl: SxProps;
}

function getStyleVariation(styleVariant: StyleVariant): StyleVariantGuide {
  switch (styleVariant) {
    case "minimal":
      return {
        formControl: {
          ".MuiInput-root:before": { border: "none" },
          ".MuiSvgIcon-root": { display: "none" },
        },
      };
    case "default":
      return { formControl: {} };
  }
}
