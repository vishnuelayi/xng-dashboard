import { Box, Stack, Typography } from "@mui/material";
import XNGSimpleSearchBar, {
  SimpleSearchBarProps,
} from "../../../../design/low-level/simple_searchbar";

const SearchBarLabel = (props: { useSimpleSearchBar: SimpleSearchBarProps; label: string }) => {
  return (
    <Stack
      direction={"row"}
      width={"100%"}
      sx={{
        flexDirection: {
          flexDirection: "column",
          sm: "row",
        },
      }}
    >
      <Box
        sx={{
          flexBasis: {
            flexBasis: "initial",
            sm: "200px",
          },
          display: "flex",
          alignItems: "center",
        }}
        mb={0.25}
      >
        <Typography>{props.label}</Typography>
      </Box>
      <Box
        sx={{
          width: {
            width: "100%",
            sm: 300,
          },
        }}
      >
        {/* <XNGInput placeholder="Primary ICD 10 Codes" type="number" size="large" /> */}
        <XNGSimpleSearchBar
          id={props.useSimpleSearchBar.id}
          options={props.useSimpleSearchBar.options}
          size={props.useSimpleSearchBar.size}
          value={props.useSimpleSearchBar.value}
          onChange={props.useSimpleSearchBar.onChange}
          inputValue={props.useSimpleSearchBar.inputValue}
          onInputChange={props.useSimpleSearchBar.onInputChange}
          useFilterOptions={props.useSimpleSearchBar.useFilterOptions}
          useInputField={props.useSimpleSearchBar.useInputField}
        />
      </Box>
    </Stack>
  );
};

export default SearchBarLabel;
