import { useTheme } from "@mui/material";
import { MSBIconRenderer } from "../../../../fortitude";
import { FaArrowRight } from "react-icons/fa";
import XNGButtonIconLink from "../../../../design/low-level/button_icon_link";

export function StaticReportsButton(
  props: Readonly<{
    label: string;
    startIcon: JSX.Element;
    onClick: () => void;
  }>,
) {
  const { palette } = useTheme();

  const iconColor = palette.getContrastText(palette.background.default);

  return (
    // TODO: Have this use MUI basic component(s) instead of original Fortitude component XNGButtonIconLink
    <XNGButtonIconLink
      label={props.label}
      startIcon={<MSBIconRenderer color={iconColor} size="small" i={props.startIcon} />}
      endIcon={<MSBIconRenderer color={palette.primary.main} size="xs" i={<FaArrowRight />} />}
      sx={{
        fontWeight: 700,
        color: iconColor,
      }}
      onClick={props.onClick}
    />
  );
}
