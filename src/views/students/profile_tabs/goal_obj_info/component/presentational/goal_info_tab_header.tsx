import { Box, Button } from "@mui/material";
import React, { CSSProperties } from "react";
import { XNGICONS } from "../../../../../../design";

type Props = {

  justifify_content?: CSSProperties["justifyContent"];
  use_save_btn?: {
    disabled?: boolean;
    onClick?: () => void;
    label: string;
  };
  use_back_btn?: {
    onClick?: () => void;
  };
};

const GoalInfoTabHeader = (props: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        py: "0.5rem",
        justifyContent: props.justifify_content ? props.justifify_content : "flex-end",
      }}
    >
      {props.use_back_btn && (
        <Button
          variant="text"
          startIcon={<XNGICONS.CaretOutline fontSize={"1rem"} />}
          onClick={props.use_back_btn.onClick}
          sx={{
            color: "primary.main",
            transition: "all 0.2s ease-in-out",
            svg: {
              transform: "rotate(180deg)",
              "*": {
                fill: "#206A7E",
              },
            },
          }}
        >
          Back
        </Button>
      )}
      {props.use_save_btn && (
        <Button
          type="submit"
          disabled={props.use_save_btn.disabled}
          sx={{
            borderRadius: "2px",
          }}
          onClick={props.use_save_btn.onClick}
        >
          {props.use_save_btn.label ?? "Error"}
        </Button>
      )}
    </Box>
  );
};

export default GoalInfoTabHeader;
