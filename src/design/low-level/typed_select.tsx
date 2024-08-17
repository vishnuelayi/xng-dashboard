import { MenuItem, MenuProps, Select, useTheme } from "@mui/material";
import { useEffect, useState } from "react";

const leftAlignedMenuProp: Partial<MenuProps> = {
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "left",
  },
};

export function XNGTypedSelect<T>(props: {
  options: T[];
  getDisplayValue: (v: T) => string;
  onChange: (v: T) => void;
  defaultOption?: T;
}) {
  const defaultValueIfAny = props.defaultOption ? props.getDisplayValue(props.defaultOption) : null;
  const [selectedString, setSelectedString] = useState<string>(defaultValueIfAny ?? "");

  useEffect(() => {
    const typedSelectedOption = props.options.find(
      (o) => props.getDisplayValue(o) === selectedString,
    );
    if (typedSelectedOption) {
      props.onChange(typedSelectedOption);
    }
  }, [selectedString]);

  const optionsToStrings = props.options.map((typedOption) => {
    return props.getDisplayValue(typedOption);
  });

  const { palette } = useTheme();

  return (
    <Select
      value={selectedString}
      onChange={(e) => setSelectedString(e.target.value)}
      inputProps={{ "aria-label": "Without label" }}
      size="small"
      sx={{ bgcolor: palette.background.default }}
      MenuProps={leftAlignedMenuProp}
    >
      {optionsToStrings.map((option, i) => (
        <MenuItem key={i} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
}
