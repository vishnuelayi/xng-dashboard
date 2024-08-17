import { TextField } from "@mui/material";
import { Control, Controller, FieldValues, Path, UseFormRegister } from "react-hook-form";
import Box from "../components-dev/BoxExtended";
import { XNGErrorFeedback } from "./_error";

export type InputType = "Number" | "Default";

export type IXNGFormInput<K, T extends FieldValues> = {
  register: UseFormRegister<T>;
  name: Path<T>;
  label: string;
  value?: K; // future: Constrict this to typeof Path<T>
  onAfterChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  control: Control<T, any>;
  useError?: { message: string | undefined };
  disabled?: boolean;
  placeholder?: string;
  defaultValue?: string | number | undefined;
};

export function XNGFormInput<K, T extends FieldValues>(props: IXNGFormInput<K, T>) {
  const _ = (
    <Controller
      control={props.control}
      name={props.name}
      render={({ field: { onChange, value } }) => {
        return (
          <TextField
            placeholder={props.placeholder}
            {...(props.placeholder ? { InputLabelProps: { shrink: true } } : {})}
            size="small"
            disabled={props.disabled}
            fullWidth
            value={value ? value : props.value ? props.value : ""}
            defaultValue={props.defaultValue ? props.defaultValue : ""}
            type="text"
            label={props.label}
            {...props.register(props.name)}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              onChange(e);
              if (props.onAfterChange) {
                props.onAfterChange(e);
              }
            }}
          />
        );
      }}
    />
  );

  return props.useError ? (
    <Box>
      {_}
      <XNGErrorFeedback error={props.useError.message} />
    </Box>
  ) : (
    _
  );
}
