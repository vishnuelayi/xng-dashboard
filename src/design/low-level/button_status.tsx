import { Typography, ButtonBase } from "@mui/material";
import { getSizing } from "../../design/sizing";
import Box from "../../design/components-dev/BoxExtended";
import usePalette from "../../hooks/usePalette";
import { BORDER_RADIUSES } from "../../design/borderRadiuses";
import { XNGICONS, XNGIconRenderer } from "../../design/icons";

export type StatusButtonStatus = "Success" | "Default" | "Danger";

export interface IXNGStatusButton {
  status?: StatusButtonStatus;
  label?: string;
  fullWidth?: boolean;
  isHighlighted?: boolean;
  color?: string;
  desc?: string;
  onClick?: () => void;
}
function XNGStatusButton(props: IXNGStatusButton) {
  const palette = usePalette();

  const icon =
    props.status === "Success" ? (
      <XNGIconRenderer i={<XNGICONS.SmallCheck />} size="small" />
    ) : null;
  // console.log(props.label,": ", props.status)
  return (
    <ButtonBase
      sx={{
        ...(props.fullWidth ? { width: "100%" } : {}),
        borderRadius: BORDER_RADIUSES[0],
        overflow: "hidden",
        color: props.color || "initial",
      }}
      {...(props.onClick ? { onClick: props.onClick } : {})}
    >
      <Box
        sx={{
          display: "flex",
          bgcolor: props.isHighlighted ? palette.primary[4] : palette.contrasts[5],
          ...(props.fullWidth ? { width: "100%" } : {}),
          flexDirection: "row",
          alignItems: "center",
          border: "1px solid " + palette.contrasts[3],
          borderRadius: BORDER_RADIUSES[0],
        }}
        className="noselect"
      >
        <Box
          sx={{
            width: getSizing(3),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {icon}
        </Box>
        <Box
          sx={{
            padding: "5px",
            paddingLeft: getSizing(1),
            ...(props.fullWidth ? { width: "100%" } : {}),
            display: "flex",
            flexDirection: "column",
            borderLeft: "1px solid " + palette.contrasts[3],
          }}
        >
          <Typography
            variant="body2"
            sx={{ textAlign: "left", fontWeight: props.isHighlighted ? "700" : "normal" }}
          >
            {props.label}
          </Typography>
          {props.desc && (
            <Typography sx={{ textAlign: "left", fontSize: "8px" }}>{props.desc}</Typography>
          )}
        </Box>
      </Box>
    </ButtonBase>
  );
}

export default XNGStatusButton;
