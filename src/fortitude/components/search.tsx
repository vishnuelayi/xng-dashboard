import { InputAdornment, TextField, TextFieldProps, useTheme } from "@mui/material";
import MSBIconRenderer from "../iconography/icon_renderer";
import MSBICONS from "../iconography/icons";
import MSBClose from "./button_close";

type CustomProps = {
  useClear?: { onClear: () => void };
};

type MSBSearchProps = CustomProps & TextFieldProps;

function MSBSearch(props: MSBSearchProps) {
  const { palette } = useTheme();

  return (
    <TextField
      variant="outlined"
      placeholder="Search..."
      size="small"
      InputProps={{
        sx: { pl: ".5rem" },
        startAdornment: (
          <InputAdornment
            position="start"
            sx={{
              pointerEvents: "none",
            }}
          >
            <MSBIconRenderer i={<MSBICONS.Search />} size="sm" color={palette.text.primary} />
          </InputAdornment>
        ),
        ...(props.useClear && {
          endAdornment: (
            <InputAdornment position="end">
              <MSBClose onClick={() => props.useClear?.onClear()} />
            </InputAdornment>
          ),
        }),
      }}
      {...props}
    />
  );
}

export default MSBSearch;
