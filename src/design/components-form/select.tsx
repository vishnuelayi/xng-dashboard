import {
  Controller,
  FieldValues,
  UseFormWatch,
  UseFormSetValue,
  Path,
  PathValue,
} from "react-hook-form";
import { TextField, MenuItem, FormControl, Menu } from "@mui/material";
import { XNGErrorFeedback } from "./_error";
import Box from "../components-dev/BoxExtended";
import { useEffect, useState } from "react";

export type IXNGFormSelect<T extends FieldValues, V> = {
  control: any;
  name: Path<T>;
  items: V[];
  label: string;
  defaultValue?: V;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  useError?: { message: string | undefined };
  getOptionLabel: (option: V) => string;
  getOptionCallback?: (option: V) => void;
};

export function XNGFormSelect<T extends FieldValues, V>(props: IXNGFormSelect<T, V>) {
  // Basic handlers
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  // ------------ NEW SYSTEM 7/3/23 ------------
  // Everything is controlled by one data point, the "mainValue" field.
  // "mainValue" controls both the RHF value and the UI value
  // "mainValue" controls RHF through a useEffect change listener, while the UI label is always derived

  const [mainValue, setMainValue] = useState<V>(props.defaultValue ?? props.items[0]);

  // mainValue change listener
  useEffect(() => {
    props.setValue(props.name as Path<T>, mainValue as PathValue<T, Path<T>>);
  }, [mainValue]);

  // UI Value get handlers
  function getDefaultUIValue() {
    if (props.defaultValue) {
      return props.getOptionLabel(props.defaultValue);
    } else {
      return props.getOptionLabel(props.items[0]);
    }
  }
  function getUIValue() {
    return props.getOptionLabel(mainValue);
  }

  const mainContent = (
    <Controller
      control={props.control}
      name={props.name}
      render={() => (
        <FormControl fullWidth>
          <Box
            onClick={(event: React.MouseEvent<HTMLDivElement>) => {
              setAnchorEl(event.currentTarget);
            }}
            sx={{ cursor: "pointer" }}
          >
            <TextField
              fullWidth
              size="small"
              select
              sx={{ pointerEvents: "none" }}
              label={props.label}
              defaultValue={getDefaultUIValue()}
              value={getUIValue()}
            >
              {/* This is NOT for display, it's here to provide values to the MUI TextField since they don't provide an intuitive way to do so like an attribute. Sorry for the lack of clarity here. */}
              {/* These ARE the values used for the closed-select's input display, however. */}
              {props.items.map((item, i) => {
                // assign value as indexer
                return (
                  <MenuItem key={i} value={props.getOptionLabel(item)}>
                    {props.getOptionLabel(item)}
                  </MenuItem>
                );
              })}
            </TextField>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={anchorEl !== null}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            {props.items.map((item, i) => {
              return (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    setMainValue(item);
                    if (props.getOptionCallback) {
                      props.getOptionCallback(item);
                    }
                  }}
                  key={i}
                  value={i}
                >
                  {props.getOptionLabel(item)}
                </MenuItem>
              );
            })}
          </Menu>
        </FormControl>
      )}
    />
  );

  return props.useError ? (
    <Box sx={{ width: "100%" }}>
      {mainContent}
      <Box>
        <XNGErrorFeedback error={props.useError.message} />
      </Box>
    </Box>
  ) : (
    mainContent
  );
}
