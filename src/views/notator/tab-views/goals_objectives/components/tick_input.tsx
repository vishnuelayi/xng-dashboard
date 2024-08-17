import { Box, ButtonBase, TextField, Typography } from "@mui/material";
import { useState } from "react";

/**
 * This is a presentational component that will render an input component with plus and minus increment options
 * at the bottom of it. Its size is currently hardcoded but for any future needs, this can be extended through
 * optional props. Handle with care.
 *
 * It is placed at the `/goal_objectives` level instead of further upstream currently since there is no need for
 * it elsewhere, as of now. But this may change.
 */
export default function XNGTickNumberInput(props: {
  value: number;
  disabled?: boolean;
  onChange: (v: number) => void;
}) {
  const SX_CONSTANTS = {
    borderRadius: ".4rem",
    width: "4rem",
  };

  function handleIncrement(v: number) {
    props.onChange(props.value + v);
  }

  return (
    <Box width={SX_CONSTANTS.width}>
      <TextField
        disabled={props.disabled}
        type="number"
        value={props.value}
        onChange={(e) => props.onChange(parseInt(e.target.value))}
        onBlur={() => props.onChange(props.value)}
        onKeyDown={(e) => e.code === "Enter" && props.onChange(props.value)}
        fullWidth
        sx={{
          ".MuiInputBase-root": {
            borderRadius: `${SX_CONSTANTS.borderRadius} ${SX_CONSTANTS.borderRadius} 0 0`,
            'input[type="number"]::-webkit-inner-spin-button': {
              "-webkit-appearance": "none",
              margin: 0,
            },
            'input[type="number"]::-webkit-outer-spin-button': {
              "-webkit-appearance": "none",
              margin: 0,
            },
          },
          input: {
            textAlign: "center",
          },
        }}
        variant="outlined"
        size="small"
      />
      <Box
        sx={{
          display: "flex",
          ".MuiButtonBase-root": {
            borderRadius: 0,
          },
          borderRadius: `0 0 ${SX_CONSTANTS.borderRadius} ${SX_CONSTANTS.borderRadius}`,
          overflow: "hidden",
          border: "1px solid #0004",
          borderTop: 0,
        }}
      >
        <IncrementButton onClick={() => !props.disabled && handleIncrement(-1)} useBorderRight>
          -
        </IncrementButton>
        <IncrementButton onClick={() => !props.disabled && handleIncrement(1)}>+</IncrementButton>
      </Box>
    </Box>
  );

  function IncrementButton(props: {
    children: React.ReactNode;
    useBorderRight?: boolean;
    onClick: () => void;
  }) {
    return (
      <Box
        sx={{
          height: "2rem",
          width: "50%",
          ...(props.useBorderRight && { borderRight: "1px solid #0004" }),
        }}
      >
        <ButtonBase
          onClick={props.onClick}
          sx={{ height: "inherit", width: "100%", ":active": { bgcolor: "#0001" } }}
        >
          <Typography>{props.children}</Typography>
        </ButtonBase>
      </Box>
    );
  }
}
