import usePalette from "../../../hooks/usePalette";

export const SIZE = "sm";

export function useSidebarPalette() {
  const palette = usePalette();
  return {
    selected: palette.contrasts[0],
    deselected: palette.contrasts[0],
    bgcolor: palette.primary[3],
    bgcolorHover: palette.contrasts[5],
  };
}
