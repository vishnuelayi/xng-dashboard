import Box from "../components-dev/BoxExtended";
import usePalette from "../../hooks/usePalette";
import { Typography, ButtonBase } from "@mui/material";
import { getSizing } from "../sizing";
import { checkDecorationSVG } from "../svgs/checkDecorationSVG";

export type XNGAvatarStatus = "default";

export type XNGAvatarSize = "lg" | "md" | "sm" | "tiny";

type XNGAvatarVariant = "outline" | "default" | "light";

// As per design system https://www.figma.com/file/N4Q1wTbZ9iKZWMUh2pgbrD/Fortitude?type=design&node-id=563-104&mode=design&t=PcGOQoxTFWt7qpXZ-0
const SIZES = {
  tiny: 3.125,
  sm: 4,
  md: 4.59375,
  lg: 9.375,
};

interface IXNGAvatar {
  text?: string;
  size?: XNGAvatarSize;
  variant?: XNGAvatarVariant;
  useCheckDecoration?: boolean;
}
function XNGAvatar(props: IXNGAvatar) {
  const palette = usePalette();
  const SIZE: XNGAvatarSize = props.size ?? "md";
  const VARIANT: XNGAvatarVariant = props.variant ?? "default";

  return (
    <ButtonBase
      className="noselect"
      sx={{
        borderRadius: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",

        // Size styles
        ...(SIZE === "tiny" && {
          minWidth: getSizing(SIZES.tiny),
          minHeight: getSizing(SIZES.tiny),
          maxWidth: getSizing(SIZES.tiny),
          maxHeight: getSizing(SIZES.tiny),
        }),
        ...(SIZE === "sm" && {
          minWidth: getSizing(SIZES.sm),
          minHeight: getSizing(SIZES.sm),
          maxWidth: getSizing(SIZES.sm),
          maxHeight: getSizing(SIZES.sm),
        }),
        ...(SIZE === "md" && {
          minWidth: getSizing(SIZES.md),
          minHeight: getSizing(SIZES.md),
          maxWidth: getSizing(SIZES.md),
          maxHeight: getSizing(SIZES.md),
        }),
        ...(SIZE === "lg" && {
          minWidth: getSizing(SIZES.lg),
          minHeight: getSizing(SIZES.lg),
          maxWidth: getSizing(SIZES.lg),
          maxHeight: getSizing(SIZES.lg),
        }),

        // Variant styles
        ...(VARIANT === "default" && {
          backgroundColor: palette.primary[2],
          border: `1px ${palette.contrasts[5]} solid`,
          color: palette.contrasts[5],
        }),
        ...(VARIANT === "outline" && {
          backgroundColor: `${palette.contrasts[5]}`,
          border: `1px ${palette.contrasts[3]} solid`,
          color: `1px ${palette.contrasts[0]} solid`,
        }),
        ...(VARIANT === "light" && {
          backgroundColor: palette.primary[3],
          border: `1px ${palette.contrasts[5]} solid`,
          color: palette.contrasts[5],
        }),
      }}
    >
      {props.useCheckDecoration && (
        <Box sx={{ position: "absolute", top: -6, right: -8 }}>{checkDecorationSVG}</Box>
      )}
      <Typography
        {...(SIZE === "tiny" && { variant: "body1" })}
        {...(SIZE === "sm" && { variant: "body1" })}
        {...(SIZE === "md" && { variant: "body1" })}
        {...(SIZE === "lg" && { variant: "h6" })}
        sx={{ textTransform: "uppercase" }}
      >
        {props.text}
      </Typography>
    </ButtonBase>
  );
}

export default XNGAvatar;
