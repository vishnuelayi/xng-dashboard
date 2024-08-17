import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { type SelectProps } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

interface XNGSelectProps<T> extends SelectProps<string | string[]> {
  options: T[];
  getOptionText?: (option: T) => string;
}

export default function XNGSelect<T = string>({
  options,
  getOptionText,
  ...otherProps
}: XNGSelectProps<T>) {
  const { value, multiple } = otherProps;

  const getValue = (option: T, index: number) => {
    if (typeof option === "object") {
      return ((option as any)?.id as string) ?? index.toString();
    }
    return option as string;
  };

  const _getOptionText = (option: T) => option?.toString();

  return (
    <FormControl sx={{ width: "200px" }}>
      <InputLabel>{otherProps.label}</InputLabel>

      <Select
        renderValue={(selected) => {
          if (multiple) {
            return `${otherProps.label} (${(selected as string[])?.length} selected)`;
          } else {
            const selectedOption = options.find(
              (option, index) => getValue(option, index) === value,
            );

            return (
              selectedOption && (getOptionText?.(selectedOption) ?? _getOptionText(selectedOption))
            );
          }
        }}
        {...otherProps}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={getValue(option, index)}>
            <Checkbox
              checked={
                multiple
                  ? (value as string[])?.includes(getValue(option, index))
                  : value === getValue(option, index)
              }
            />
            <ListItemText primary={getOptionText?.(option) ?? _getOptionText(option)} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
