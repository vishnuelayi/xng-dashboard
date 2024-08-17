import { MenuItem, Select, SelectProps } from "@mui/material";

export type DisabledPreselectedDropdownProps = Readonly<{
  children?: React.ReactNode;
  selectProps?: SelectProps;
}>;

/**
 * Purely presentational component that does not influence form behavior and only exists
 * as a UX element for preselected items in what is normally a dropdown.
 */
export function DisabledPreselectedDropdown(props: DisabledPreselectedDropdownProps) {
  const { children } = props;

  return (
    <Select
      disabled
      size="small"
      displayEmpty
      inputProps={{ readOnly: true }}
      sx={{ width: "100%", backgroundColor: "white" }}
      {...props.selectProps}
    >
      <MenuItem>{children}</MenuItem>
    </Select>
  );
}
