import { Button, ButtonProps } from "@mui/material";
import React, { CSSProperties } from "react";

type XNGButtonIconLinkBaseProps = {
  label: string;
};

type XNGButtonIconLinkOptionalProps = {
  startIcon?: ButtonProps["startIcon"];
  endIcon?: ButtonProps["endIcon"];
  sx?: ButtonProps["sx"];
  color?: CSSProperties["color"];
  useHoverStyling?: {
    textDecoration?: CSSProperties["textDecoration"];
    backgroundColor?: CSSProperties["backgroundColor"];
  };
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

export type XNGButtonIconLinkProps = XNGButtonIconLinkBaseProps & XNGButtonIconLinkOptionalProps;

function XNGButtonIconLink(props: XNGButtonIconLinkProps) {
  return (
    <Button
      variant="text"
      disableRipple
      size="small"
      startIcon={props.startIcon}
      endIcon={props.endIcon}
      sx={{
        color: props.color ?? "palette.primary.main",
        ":hover": {
          textDecoration: props.useHoverStyling?.textDecoration ?? "underline",
          backgroundColor: props.useHoverStyling?.backgroundColor ?? "initial",
        },
        ...props.sx,
      }}
      onClick={props.onClick}
    >
      {props.label}
    </Button>
  );
}

export default XNGButtonIconLink;
