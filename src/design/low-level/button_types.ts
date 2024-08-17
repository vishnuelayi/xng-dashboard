export type XNGButtonSize = "large" | "default" | "small" | "tiny";

export function getButtonHeight(size: XNGButtonSize) {
  switch (size) {
    case "large":
      return "33px";
    case "default":
      return "28px";
    case "small":
      return "24px";
    case "tiny":
      return "22px";
  }
}
