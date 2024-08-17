import { TextFieldProps, FormControl, TextField, FormHelperText } from '@mui/material';
import React from 'react';

type Props = {
    fullWidth?: boolean;
    type: TextFieldProps["type"];
    label?: TextFieldProps["label"];
    value?: TextFieldProps["value"];
    id: TextFieldProps["id"];
    onChange?: TextFieldProps["onChange"]; // assign onChange event
    onBlur?: TextFieldProps["onBlur"]; // assign onBlur event
    name?: TextFieldProps["name"]; // assign name prop
    focused?: TextFieldProps["focused"];
    size?: TextFieldProps["size"];
    useError?: string;
    disabled?: TextFieldProps["disabled"];
    sx?: TextFieldProps["sx"];
    multiline?: TextFieldProps["multiline"];
    rows?: TextFieldProps["minRows"];
    inputProps?: TextFieldProps["inputProps"];
    defaultValue?: TextFieldProps["defaultValue"];
    disbaleBottomMargin?: boolean;
    readOnly?: boolean;
    prefix?: string;
    useAdornment?:{
      start?:React.ReactNode;
      end?:React.ReactNode;
    }
  };

const XNGInput2 = React.forwardRef<HTMLInputElement, Props>(function (
    props: Props,
    ref
  ) {
    const {
      useError,
      fullWidth,
      disbaleBottomMargin,
      useAdornment,
      sx,
      ...other
    } = props;
  

  
    return (
      <FormControl
        fullWidth={fullWidth}
        sx={{
          marginBottom: disbaleBottomMargin ? 0 : "1rem",
          ...sx,
        }}
      >
        <TextField
          {...other}
          ref={ref}
          rows={props.rows}
          // minRows={2}
          // maxRows={5}
          inputProps={props.inputProps}
          InputProps={{
            readOnly:props.readOnly,
            endAdornment: useAdornment?.end || undefined,
            startAdornment: useAdornment?.start || undefined,
          }}
          prefix={props.prefix}
        />
        <FormHelperText error={!!useError} sx={{ marginInline: 0 }}>
          {useError}
        </FormHelperText>
      </FormControl>
    );
  });
  

export default XNGInput2;
