import { Path, Control, FieldValues, Controller } from "react-hook-form";
import { Checkbox, FormControlLabel } from "@mui/material";
import Box from "../components-dev/BoxExtended";
import { XNGErrorFeedback } from "./_error";

export function XNGFormCheckbox<T extends FieldValues>(props: {
  name: Path<T>;
  control: Control<T, any>;
  label: string;
  useError?: { message: string | undefined };
  readonly?: boolean;
  disabled?: boolean;
}) {
  function getDefaultValue<T>(): T {
    return false as T;
  }

  const checkbox = (
    <Controller
      control={props.control}
      name={props.name}
      defaultValue={getDefaultValue()}
      render={({ field: { value, onChange } }) => (
        <FormControlLabel
          className="noselect"
          control={
            <Checkbox
              disabled={props.disabled}
              color="primary"
              checked={value}
              onChange={onChange} // ?
              readOnly={props.readonly}
              {...(props.readonly && { onClick: (e) => e.preventDefault() })}
            />
          }
          label={props.label}
        />
      )}
    />
  );

  return props.useError ? (
    <Box>
      {checkbox}
      <XNGErrorFeedback error={props.useError.message} />
    </Box>
  ) : (
    checkbox
  );
}
