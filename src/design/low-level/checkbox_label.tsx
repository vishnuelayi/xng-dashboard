import { FormControlLabel, Checkbox, FormControlLabelProps, CheckboxProps } from "@mui/material";
import { CSSProperties } from "react";
// import usePalette from "../../hooks/usePalette";

type Props = {
  label: FormControlLabelProps["label"];
  name?: FormControlLabelProps["name"];
  checked?: CheckboxProps["checked"];
  disabled?: CheckboxProps["disabled"];
  onChange?: CheckboxProps["onChange"];
  size?: CheckboxProps["size"];
  whiteSpace?: CSSProperties["whiteSpace"];
  onBlur?: CheckboxProps["onBlur"];
  ["aria-label"]?: string;
};

const XNGCheckboxLabel = (props: Props) => {
  // const palette = usePalette();
  return (
    <FormControlLabel 
    name={props.name}
    slotProps={{
      typography: {
        whiteSpace: props.whiteSpace ?? "nowrap"
      }
    }}
      control={<Checkbox /* sx={{ svg: { color: palette.contrasts[3] },}} */ aria-label={props["aria-label"]} value={props.checked} checked={props.checked} disabled={props.disabled} onChange={props.onChange} onBlur={props.onBlur} size={props.size} />}
      label={props.label}
    />
  );
};

export default XNGCheckboxLabel;
