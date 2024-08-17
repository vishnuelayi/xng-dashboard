import usePalette from "../../../../hooks/usePalette";
import Box from "../../../components-dev/BoxExtended";
import { getSizing } from "../../../sizing";
import { TypographyProps, Typography, ButtonBase } from "@mui/material";

const MENU_PADDING = getSizing(2.5);

export const MainMenuV1 = {
  Wrapper: (props: { children: React.ReactNode }) => {
    return <Box sx={{}}>{props.children}</Box>;
  },
  HeaderTypography: (props: TypographyProps) => {
    return (
      <Typography
        className="noselect"
        py={getSizing(1)}
        px={MENU_PADDING}
        variant="h6"
        {...props}
      />
    );
  },
  IconButton: (props: {
    children: React.ReactNode;
    i: React.ReactNode;
    overline: string;
    onClick?: () => void;
    href?: string;
  }) => {
    const palette = usePalette();

    return (
      <>
        <Typography ml={MENU_PADDING} variant="overline">
          {props.overline}
        </Typography>
        <ButtonBase
          href={props.href ?? ""}
          onClick={() => props.onClick?.call(null)}
          sx={{
            justifyContent: "flex-start",
            gap: getSizing(2),
            py: getSizing(2),
            px: MENU_PADDING,
            textAlign: "left",
            ":hover": { bgcolor: palette.contrasts[4] },
          }}
        >
          <Box>{props.i}</Box>
          <Box>{props.children}</Box>
        </ButtonBase>
      </>
    );
  },
};
