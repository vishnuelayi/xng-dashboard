import {
  Autocomplete,
  AutocompleteProps,
  TextField,
  TextFieldProps,
  InputAdornment,
  createFilterOptions,
  Divider,
  Stack,
  Box,
} from "@mui/material";
import { XNGICONS, XNGIconRenderer } from "../icons";
import usePalette from "../../hooks/usePalette";


type AutoCompletePropsGenerics = AutocompleteProps<
  string | string[] | unknown,
  boolean,
  boolean,
  boolean
>;

type Props = {
  id: AutoCompletePropsGenerics["id"];
  options: AutoCompletePropsGenerics["options"];
  size: AutoCompletePropsGenerics["size"];
  value?: AutoCompletePropsGenerics["value"];
  onChange?: AutoCompletePropsGenerics["onChange"];
  inputValue?: AutoCompletePropsGenerics["inputValue"];
  onInputChange?: AutoCompletePropsGenerics["onInputChange"];
  isOptionEqualToValue?: AutoCompletePropsGenerics["isOptionEqualToValue"];
  useInputField: {
    label: TextFieldProps["label"];
    placeholder?: TextFieldProps["placeholder"];
  };
  useFilterOptions?: {
    limit: number;
  };
  useStartAdornment?: Boolean;
  disableDropdown?: Boolean;
  disabled?:AutoCompletePropsGenerics["disabled"];
};

const XNGSimpleSearchBar = (props: Props) => {
  const palette = usePalette();
  const filterOptions = createFilterOptions({
    limit: props?.useFilterOptions?.limit || 500,
  });
  return (
    <Autocomplete
      disablePortal
      disabled={props.disabled}
      id={props.id}
      options={props.options}
      size={props.size}
      filterOptions={filterOptions}
      value={props.value}
      onChange={props.onChange}
      inputValue={props.inputValue}
      onInputChange={props.onInputChange}
      freeSolo={!!props.disableDropdown}
      isOptionEqualToValue={props.isOptionEqualToValue}
      sx={{
        minWidth: "100px",
        "& .MuiInputBase-root .MuiAutocomplete-input":{
          minWidth:"0px"
        },        
          '& div[data-lastpass-icon-root="true"]':{
            display:"none"
          },
          '& div[data-lastpass-infield="true"]':{
            display:"none"
          }
        
      }}
      renderOption={(props, option, index) => {
        const key = `listItem-${index.index}`;
        return (
          <Box component={"li"} {...props} key={key}>
            {(option as string)}
          </Box>
        );
      }}
      renderInput={(params) => <TextField
        {...params}
        placeholder={props.useInputField.placeholder || ""}
        InputProps={{
          ...params.InputProps,
          startAdornment: props.useStartAdornment && (
            <>
              <InputAdornment position="start">
                <Stack direction={"row"} gap={1}>
                  <XNGIconRenderer i={<XNGICONS.Search />} size="md" color={palette.contrasts[2]} disableRenderer />
                  <Divider orientation="vertical" variant="fullWidth" flexItem />
                </Stack>
              </InputAdornment>
              {params.InputProps.startAdornment}
            </>
          )
        }}
        label={props.useInputField.label}
      />}
    />
  );
};

export type SimpleSearchBarProps = Props; // could come up with a better approach, seems to be the most sensible and ideal for now
export default XNGSimpleSearchBar;
