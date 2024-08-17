import { Box, FormHelperText, IconButton } from "@mui/material";
import { XNGIconRenderer } from "../../design";
import MSBICONS from "../iconography/icons";

type Props = {
  children?: React.ReactNode;
  isError: boolean;
  errorText: string;
  refetch: () => void;
};

const MSBInputErrorWrapper = (props: Props) => {
  return (
    <Box position={"relative"}>
      <Box display={"flex"} alignItems={"center"}>
        {props.children}
        <IconButton
          sx={{ display: props.isError ? "block" : "none" }}
          onClick={() => props.refetch()}
        >
          <XNGIconRenderer size={"xs"} i={<MSBICONS.Refresh />} />
        </IconButton>
      </Box>
      {props.isError && (
        <FormHelperText
          error={props.isError}
          sx={{ position: "absolute", bottom: "0", transform: "translateY(100%)"}}
        >
          {props.errorText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default MSBInputErrorWrapper;
