import { Autocomplete, TextField, InputAdornment, SxProps } from "@mui/material";
import { placeholderForFutureLogErrorText } from "../../temp/errorText";
import { useState } from "react";

export interface SearchProps<T> {
  options: T[];
  onSelect: (selectedOption: T) => void;
  getOptionLabel: (option: T) => string;
  label?: string;
  setValues?: boolean;
  startAdornment?: JSX.Element;
  sx?: SxProps;
  placeholder?: string;
}

export function XNGSearch<T>(props: SearchProps<T>) {
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<T>();

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(event.target.value);
  }

  function handleSelectionChange(event: React.ChangeEvent<{}>, selectedOption: T | null) {
    if (!selectedOption) throw new Error(placeholderForFutureLogErrorText);
    if (props.setValues) {
      setSearchValue(props.getOptionLabel(selectedOption));
      setSelectedValue(selectedOption);
    } else {
      setSearchValue("");
    }
    props.onSelect(selectedOption);
  }

  return (
    <Autocomplete
      options={props.options}
      getOptionLabel={props.getOptionLabel}
      fullWidth
      id="auto-comp-id"
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          label={props.label}
          variant="outlined"
          onChange={handleSearchChange}
          fullWidth
          InputProps={
            props.startAdornment
              ? {
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">{props.startAdornment}</InputAdornment>
                  ),
                }
              : { ...params.InputProps }
          }
          placeholder={props.placeholder}
        />
      )}
      value={props.setValues ? selectedValue : null}
      onChange={handleSelectionChange}
      inputValue={searchValue}
      autoSelect
      autoHighlight
      disableClearable={props.setValues}
      sx={props.sx ? { ...props.sx } : {}}
    />
  );
}
