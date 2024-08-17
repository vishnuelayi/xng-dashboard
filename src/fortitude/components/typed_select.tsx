import { MenuItem, MenuProps, Select, SelectProps, useTheme } from "@mui/material";
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

export default function MSBTypedSelect<T>(props: {
  options: T[];
  getDisplayValue: (v: T) => string;
  onChange: (v: T) => void;
  defaultOption?: T;
  selectProps?: SelectProps;
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
      onChange={(e) => setSelectedString(e.target.value as string)}
      inputProps={{ "aria-label": "Without label" }}
      size="small"
      sx={{ bgcolor: palette.background.default }}
      MenuProps={leftAlignedMenuProp}
      {...props.selectProps}
    >
      {optionsToStrings.map((option, i) => (
        <MenuItem key={i} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
}

export function MSBTypedSelectControlled<T>(props: {
  options: T[];
  value: T | "";
  getOptionLabel: (v: T) => string;
  onChange: (v: T) => void;
  selectProps?: SelectProps;
}) {
  const { options, value, getOptionLabel, onChange, selectProps } = props;

  const labelToValueMap = new Map<string, T>();
  options.forEach((option) => {
    const label = getOptionLabel(option);
    labelToValueMap.set(label, option);
  });

  return (
    <Select
      value={getOptionLabel(value as T) ?? ""} // Display label in the select
      onChange={(e) => {
        const selectedOption = labelToValueMap.get(e.target.value as string);
        if (selectedOption !== undefined) {
          onChange(selectedOption);
        }
      }}
      size="small"
      {...selectProps}
    >
      {options.map((option, index) => (
        <MenuItem key={index} value={getOptionLabel(option)}>
          {getOptionLabel(option)}
        </MenuItem>
      ))}
    </Select>
  );
}
