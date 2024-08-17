import { FormControlLabel, Radio, RadioGroup, SxProps } from "@mui/material";
import { getSizing } from "../../design/sizing";

interface IRadioGroup {
  value: any;
  onChange: ((event: React.ChangeEvent<HTMLInputElement>, value: string) => void) | undefined;
  sx: SxProps;
  radioSx: object;
  options: string[];
  values: string[];
  formLabel: React.ReactNode;
  disabled?: boolean;
}

export default function XNGRadioGroup(props: IRadioGroup) {
  return (
    <>
      {props.formLabel}
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={props.value}
        onChange={props.onChange}
        sx={props.sx}
      >
        {props.options.map((option, index) => (
          <FormControlLabel
            key={index.toString()}
            sx={{ pt: getSizing(1) }}
            value={props.values[index]}
            label={option}
            disabled={props.disabled}
            control={
              <Radio
                sx={[
                  {
                    "& .MuiSvgIcon-root": {
                      fontSize: "16px",
                    },
                  },
                  props.radioSx,
                ]}
              />
            }
          />
        ))}
      </RadioGroup>
    </>
  );
}
