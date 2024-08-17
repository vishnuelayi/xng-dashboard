import { Box } from "@mui/system";
import { ButtonBase, Typography, useTheme } from "@mui/material";
import MSBIconRenderer from "../iconography/icon_renderer";
import MSBICONS from "../iconography/icons";

type MSBBackBaseProps = {
  onClick: () => void;
};

type MSBBackOptionalProps = {
  color?: string;
};

export type MSBBackProps = MSBBackBaseProps & MSBBackOptionalProps;

const WIDTH_REM = "min-content";

function MSBBack(props: MSBBackProps) {
  const { palette } = useTheme();

  return (
    <ButtonBase sx={{ minWidth: WIDTH_REM, maxWidth: WIDTH_REM, p: ".5rem" }}>
      <Box
        onClick={() => props.onClick()}
        sx={{
          ":hover": { cursor: "pointer" },
        }}
        className="noselect"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: ".5rem",
          }}
        >
          <LeftCaret {...props} />
          <Typography color={props.color ?? palette.primary.main}>Back</Typography>
        </Box>
      </Box>
    </ButtonBase>
  );
}

function LeftCaret(props: MSBBackProps) {
  const { palette } = useTheme();

  return (
    <Box sx={{ width: ".8rem", overflow: "hidden", display: "flex", justifyContent: "center" }}>
      <MSBIconRenderer
        color={props.color ?? palette.primary.main}
        left
        i={<MSBICONS.CaretOutline />}
        size="md"
      />
    </Box>
  );
}

export default MSBBack;
