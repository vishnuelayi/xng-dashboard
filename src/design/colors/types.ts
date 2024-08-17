type FourHexVariants = { 0: string; 1: string; 2: string; 3: string };
type FiveHexVariants = { 0: string; 1: string; 2: string; 3: string; 4: string };

export type XLogsPalette = {
  primary: FiveHexVariants;
  secondary: FiveHexVariants;
  success: FiveHexVariants;
  warning: FiveHexVariants;
  danger: FiveHexVariants;
  info: FiveHexVariants;
  menu: FourHexVariants;
  disabled: string;
  contrasts: { 0: string; 1: string; 2: string; 3: string; 4: string; 5: string };
};

export enum XNGTheme {
  Light,
}
