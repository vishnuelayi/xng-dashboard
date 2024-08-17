import { createTheme } from "@mui/material/styles";

export const THEME = createTheme({
  palette: {
    primary: {
      main: "#206A7E",
      1: "#D5E2E6",
      2: "#96B7C0",
      3: "#075970",
      4: "#053E4E",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#592789",
      1: "#CDBEDC",
      2: "#8B68AC",
      3: "#43166E",
      4: "#2D0653",
    },
    success: {
      main: "#3FA65E",
      1: "#B2DBBF",
      2: "#68C183",
      3: "#117930",
      4: "#005B1C",
    },
    warning: {
      main: "#E1B755",
      1: "#FFF7E1",
      2: "#EACD88",
      3: "#CBA54D",
      4: "#9E803B",
    },
    error: {
      main: "#CB402E",
      1: "#FFCBC4",
      2: "#E16555",
      3: "#A42717",
      4: "#7C0E00",
    },
    menu: {
      main: "#2B303B",
      1: "#929AAC",
      2: "#797c82",
      3: "#21252D",
    },
    contrasts: {
      main: "#FFFFFF",
      1: "#F4F4F4",
      2: "#E0E0E0",
      3: "#757575",
      4: "#4B4B4B",
      5: "#212121",
    },
    text: {
      primary: "#4b4b4b",
      disabled: "#B6B6B6",
    },
    divider: "#e0e0e0",
  },
  typography: {
    h1: {
      fontFamily: "Lexend",
      fontSize: "96px",
    },
    h2: {
      fontFamily: "Lexend",
      fontSize: "64px",
    },
    h3: {
      fontFamily: "Lexend",
      fontSize: "48px",
    },
    h4: {
      fontFamily: "Lexend",
      fontSize: "36px",
    },
    h5: {
      fontFamily: "Lexend",
      fontSize: "24px",
    },
    h6: {
      fontFamily: "Inter",
      fontSize: "18px",
    },
    body1: {
      fontFamily: "Inter",
      fontSize: "14px",
      fontWeight: "500",
      letterSpacing: "0.08px",
    },
    body2: {
      fontFamily: "Inter",
      fontSize: "12px",
      fontWeight: "500",
    },
    subtitle1: { fontFamily: "Inter", fontSize: "10px", fontWeight: "500" },
    subtitle2: undefined,
    overline: {
      fontWeight: 400,
      fontFamily: "Inter",
      fontSize: "12px",
      lineHeight: "24px",
      letterSpacing: "0.66px",
      textTransform: "uppercase",
      userSelect: "none",
    },
  },

  components: {
    MuiTooltip: {
      styleOverrides: { tooltipPlacementBottom: { margin: "0!important" } },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          boxShadow: "none",
          fontFamily: "Inter",
          "&.MuiButton-sizeSmall": {
            height: "35px",
          },
          "&.MuiButton-sizeMedium": {
            height: "28px",
          },
          "&.MuiButton-sizeLarge": {
            height: "24px",
          },
        },
      },
    },
  },
});
