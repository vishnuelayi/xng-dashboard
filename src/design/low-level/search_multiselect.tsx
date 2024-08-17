import {
  Autocomplete,
  TextField,
  TextFieldProps,
  SxProps,
  Chip,
  AutocompleteRenderInputParams,
  Tooltip,
  createFilterOptions,
} from "@mui/material";

// ----------------------------------- CONTRACTS -----------------------------------

type XNGSearchMultiselectVariant = "no overflow after 1";

/**
 * The props required for `XNGSearchMultiselect`. NOTE: This is ***closed*** for modification.
 * If the situation arises that the properties to be modified, please create a separate
 * Fortitude component, and title it with either a new name or the same name with a "V2"
 * suffix.
 */
interface RequiredProps<T> {
  options: T[];
  selectedOptions: T[];
  getOptionLabel: (option: T) => string;
  onChange: (v: T[]) => void;
}

/**
 * Optional props for `XNGSearchMultiselect`. This component is designed to be flexible and open for modifications.
 */
interface OptionalProps<T> {
  label?: string;
  variant?: XNGSearchMultiselectVariant;
  sx?: SxProps;
  textFieldProps?: TextFieldProps;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  getTooltip?: (option: T) => string;
  disabled?: boolean;
  useFilterOptions?: {
    limit: number;
  };
}

export type XNGSearchMultiselectProps<T> = RequiredProps<T> & OptionalProps<T>;

// ---------------------------------------------------------------------------------

/**
 * Will boilerplate an MUI multi-selectable `Autocomplete` with programmable variants
 *
 * @param options All possible values to select from
 * @param selectedOptions Should accept React state that represents user-selected options
 * @param onChange Will return updated selectedOptions to use to update your user-selected options state
 * @param getOptionLabel Tells the component what text to render for each option value
 * @param variant _(Optional)_ Allows us to reuse predefined `Autocomplete` props for different scenarios
 */
export function XNGSearchMultiselect<T>(props: XNGSearchMultiselectProps<T>) {
  const variantProps = useVariantProps(props);

  const filterOptions = createFilterOptions<T>({
    limit: props?.useFilterOptions?.limit || 500,
  });

  return (
    <>
      {props.options && (
        <Autocomplete
          disabled={props.disabled}
          options={props.options}
          renderInput={(params: AutocompleteRenderInputParams) => (
            <TextField
              {...params}
              variant="outlined"
              label={props.label ?? "Type to search..."}
              {...props.textFieldProps}
            />
          )}
          filterOptions={filterOptions}
          renderOption={(oprops, option) =>
            props.getTooltip ? (
              <Tooltip title={props.getTooltip(option)} placement="right" arrow>
                <li {...oprops}>{props.getOptionLabel(option)}</li>
              </Tooltip>
            ) : (
              <li {...oprops}>{props.getOptionLabel(option)}</li>
            )
          }
          size="small"
          multiple
          getOptionLabel={props.getOptionLabel}
          value={props.selectedOptions}
          onChange={(e, v: T[]) => props.onChange(v)}
          {...variantProps}
          sx={props.sx}
          isOptionEqualToValue={props.isOptionEqualToValue}
        />
      )}
    </>
  );
}

/**
 * This will return props we can use to effectively program our Autocomplete with predefined,
 * reusable functionality.
 *
 * NOTE: ***Existing variants are closed for modification***. If existing variants need to
 * be modified to accomplish a goal, please create a new variant instead.
 */
function useVariantProps<T>(props: XNGSearchMultiselectProps<T>) {
  const noOverFlowAfter1 = {
    sx: {
      ".MuiAutocomplete-inputRoot .MuiAutocomplete-input": { minWidth: "1px" },
    },
    renderTags: (value: any, getTagProps: any) =>
      value
        .slice(0, 2)
        .map((option: T, index: number) => (
          <Chip
            size="small"
            variant="filled"
            label={
              index < 1
                ? props.getOptionLabel(option)
                : value.length > 1
                ? `+${value.length - 1} more`
                : props.getOptionLabel(option)
            }
            {...getTagProps({ index })}
          />
        )),
  };

  switch (props.variant) {
    case "no overflow after 1":
      return noOverFlowAfter1;
    default:
      return null;
  }
}
