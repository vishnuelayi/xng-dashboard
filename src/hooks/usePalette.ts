import { selectedTheme } from "../context/slices/displayThemeSlice";
import { useXNGSelector } from "../context/store";
import { getPalette } from "../design/colors/get_palette";
import { XLogsPalette } from "../design/colors/types";

function usePalette(): XLogsPalette {
  const selectedThm = useXNGSelector(selectedTheme);
  const palette = getPalette(selectedThm);
  return palette;
}

export default usePalette;
