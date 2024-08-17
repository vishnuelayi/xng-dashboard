import { XNGStandardTab } from "./xngStandardTab";

export type DropdownSidebarItemProps = {
  icon: JSX.Element;
  label: string;
  route: string;
  tabs: XNGStandardTab[];
};

export type ButtonSidebarItemProps = {
  icon: JSX.Element;
  label: string;
  route: string;
};

export type SidebarItemAnyProps = ButtonSidebarItemProps | DropdownSidebarItemProps;
