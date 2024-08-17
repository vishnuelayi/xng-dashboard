import { Breakpoint, useTheme, useMediaQuery } from "@mui/material";

/**
 * Helper module that provides additional utilities for working with MUI's breakpoint system.
 *
 * @returns `isMobile` - A reactive boolean indicating if the user is on a mobile-sized screen.
 * @returns `isGreaterThanEqualTo` - A mobile-first media query function that returns a boolean based on the given breakpoint.
 * @returns `currentScreenSize` - A reactive value indicating the current screen size.
 */
function useBreakpointHelper(): BreakpointerHelper {
  const thm = useTheme();

  const isMobile = useMediaQuery(thm.breakpoints.between("xs", "sm"));

  function isGreaterThanEqualTo(breakpoint: number | Breakpoint): boolean {
    // Create a width string as a CSS pixel value using the supplied parameter.
    const widthPx =
      typeof breakpoint === "number" ? `${breakpoint}px` : thm.breakpoints.values[breakpoint];
    // Construct a media query with the width string.
    const mediaQuery = `(min-width:${widthPx}px)`;
    // Use window.matchMedia to programmatically check if the media query is greater or equal to the supplied parameter.
    return window.matchMedia(mediaQuery).matches;
  }

  const isXl = useMediaQuery(thm.breakpoints.up("xl"));
  const isLg = useMediaQuery(thm.breakpoints.up("lg"));
  const isMd = useMediaQuery(thm.breakpoints.up("md"));
  const isSm = useMediaQuery(thm.breakpoints.up("sm"));

  const currentScreenSize = isXl ? "xl" : isLg ? "lg" : isMd ? "md" : isSm ? "sm" : "xs"; //NOSONAR

  return {
    isMobile,
    isGreaterThanEqualTo,
    currentScreenSize,
  };
}

interface BreakpointerHelper {
  isMobile: boolean;
  isGreaterThanEqualTo: (breakpoint: number | Breakpoint) => boolean;
  currentScreenSize: Breakpoint;
}

export default useBreakpointHelper;
