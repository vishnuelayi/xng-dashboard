import { placeholderForFutureLogErrorText } from "../../temp/errorText";
import { LIGHT } from "./themes/light";
import { XLogsPalette, XNGTheme } from "./types";

export function getPalette(theme: XNGTheme): XLogsPalette {
  switch (theme) {
    case XNGTheme.Light:
      return LIGHT;
    default:
      throw new Error(placeholderForFutureLogErrorText);
  }
}
