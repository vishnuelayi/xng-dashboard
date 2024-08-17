import {
  Autocomplete,
  TextField,
  TextFieldProps,
  SxProps,
  Chip,
  AutocompleteRenderInputParams,
  Tooltip,
  Box,
  AutocompleteProps,
  Divider,
} from "@mui/material";
import { useCallback } from "react";
import { SelectableRow } from "./selectable_row";

// ----------------------------------- CONTRACTS -----------------------------------

type AutocompletePartialProps<T> = Partial<AutocompleteProps<T, boolean, boolean, boolean>>;

export type MSBSearchMultiselectVariant = "default" | "no overflow after 1" | "no overflow";
export type MSBSearchMultiselectRenderOptionVariant = "default" | "checkbox";

/**
 * The props required for `MSBSearchMultiselect`. NOTE: This is ***closed*** for modification.
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
 * Optional props for `MSBSearchMultiselect`. This component is designed to be flexible and open for modifications.
 */
interface OptionalProps<T> {
  label?: string;
  variant?: MSBSearchMultiselectVariant;
  renderOptionVariant?: MSBSearchMultiselectRenderOptionVariant;
  sx?: SxProps;
  textFieldProps?: TextFieldProps;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  getTooltip?: (option: T) => string;
  disabled?: boolean;
  autocompleteProps?: AutocompletePartialProps<T>;
}

export type MSBSearchMultiselectProps<T> = RequiredProps<T> & OptionalProps<T>;

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
export default function MSBSearchMultiselect<T>(props: MSBSearchMultiselectProps<T>) {
  const variantProps = useVariantProps(props);
  const renderOptionVariant = useRenderOptionVariant(props);

  return (
    <>
      {props.options && (
        <Autocomplete
          disableCloseOnSelect
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
          renderOption={renderOptionVariant.renderOption}
          size={"small"}
          multiple
          getOptionLabel={(option: string | T) =>
            typeof option === "string" ? option : props.getOptionLabel(option)
          }
          value={props.selectedOptions}
          onChange={(e, value) => props.onChange(value as T[])}
          isOptionEqualToValue={props.isOptionEqualToValue}
          {...variantProps}
          sx={props.sx}
          {...props.autocompleteProps}
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
function useVariantProps<T>(props: MSBSearchMultiselectProps<T>): AutocompletePartialProps<T> {
  const noOverFlowAfter1: AutocompletePartialProps<T> = {
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
            {...(index > 0 && { onDelete: null, sx: { pr: ".25rem" } })}
          />
        )),
  };

  const noOverFlow: AutocompletePartialProps<T> = {
    sx: {
      ".MuiAutocomplete-inputRoot .MuiAutocomplete-input": { minWidth: "1px" },
    },
    renderTags: (value: any, getTagProps: any) => (
      <Chip
        size="small"
        variant="filled"
        label={`${value.length} selected`}
        {...getTagProps(0)}
        onDelete={null}
        sx={{ pr: ".25rem" }}
      />
    ),
  };

  const variant = props.variant ?? "default";
  switch (variant) {
    case "default":
      return {};
    case "no overflow after 1":
      return noOverFlowAfter1;
    case "no overflow":
      return noOverFlow;
    default:
      throw new Error(
        "Fallthrough in switch statement! Has a new MSBSearchMultiselect variant been introduced?",
      );
  }
}

/**
 * Custom hook that returns the variant of rendering options based on the provided props.
 *
 * @template T - The type of the options.
 * @param {MSBSearchMultiselectProps<T>} props - The props for the search multiselect component.
 * @returns {object} - The variant of rendering options based on the selected variant.
 * @throws {Error} - If an unknown variant is selected.
 */
function useRenderOptionVariant<T>(
  props: MSBSearchMultiselectProps<T>,
): AutocompletePartialProps<T> {
  const selectedVariant = props.renderOptionVariant ?? "default";

  const defaultVariant: AutocompletePartialProps<T> = {
    renderOption: (oprops: any, option: T) =>
      props.getTooltip ? (
        <Tooltip title={props.getTooltip(option)} placement="right" arrow>
          <li {...oprops}>{props.getOptionLabel(option)}</li>
        </Tooltip>
      ) : (
        <li {...oprops}>{props.getOptionLabel(option)}</li>
      ),
  };

  const checkboxVariant: AutocompletePartialProps<T> = {
    renderOption: (oprops: any, option: T, state: any) => {
      const isAllSelected = props.selectedOptions.length === props.options.length;
      function handleSelectAllClick() {
        if (isAllSelected) {
          props.onChange([]);
        } else {
          props.onChange(props.options);
        }
      }

      return (
        <>
          {state.index === 0 && (
            <>
              <Box onClick={handleSelectAllClick}>
                <SelectableRow checked={isAllSelected} title={"Select all"} />
              </Box>
              <Divider />
            </>
          )}

          <SelectableRow
            checked={state.selected}
            title={props.getOptionLabel(option)}
            boxProps={oprops}
          />
        </>
      );
    },
  };

  switch (selectedVariant) {
    case "default":
      return defaultVariant;
    case "checkbox":
      return checkboxVariant;
    default:
      throw new Error(
        "Fallthrough in switch statement! Has a new MSBSearchMultiselect options variant been introduced?",
      );
  }
}

interface MSBSearchMultiselectMappedSelection<TOption> {
  options: TOption[];
  selectedOptions: TOption[];
  onChange: (newSelectedOptions: TOption[]) => void;
}
interface UseOptionFieldMapperProps<TOption, TField> {
  options: TOption[];
  selectionState: {
    selectedFields: TField[];
    onChangeAsFields: (selectedFieldValues: TField[]) => void;
  };
  mapToField: (option: TOption) => TField;
}

/**
 * Allows you to effectively back a `MSBSearchMultiselect` with a complex type, while managing the state of
 * selection with a specified field of your complex type. This hook simplifies the process of selecting
 * items from a list of options where each option is a complex object, by focusing on a specific field within
 * those objects to determine the selection state.

 * @type TOption - The type of the options provided to the multiselect.
 * @type TField - The type of the field within the options used for selection.
 * 
 * @example
 * // Usage with a list of service provider references, selecting by their ID:
 * const assistantSelection = useMSBSearchMultiselectMappedSelection<ServiceProviderRef, string>({
 *   options: filterState.assistants,
 *   mapToField: (option) => option.id!,
 *   selectionState: {
 *     selectedFields: filterState.selectedAssistantIDs,
 *     onChangeAsFields: filterState.setSelectedAssistantIDs,
 *   },
 * });
 * 
 * // Then, you can use the `assistantSelection` in your MSBSearchMultiselect component:
 * <MSBSearchMultiselect<ServiceProviderRef>
 *   variant="no overflow after 1"
 *   label="Service Provider"
 *   getOptionLabel={(v) => `${v.firstName} ${v.lastName}`}
 *   options={assistantSelection.options}
 *   selectedOptions={assistantSelection.selectedOptions}
 *   onChange={assistantSelection.onChange}
 * />
 */
export function useMSBSearchMultiselectMappedSelection<TOption, TField>(
  props: UseOptionFieldMapperProps<TOption, TField>,
): MSBSearchMultiselectMappedSelection<TOption> {
  const {
    options,
    selectionState: { selectedFields, onChangeAsFields },
    mapToField,
  } = props;

  const selectedOptions = options.filter((option) => selectedFields.includes(mapToField(option)));

  const onChange = useCallback(
    (newSelectedOptions: TOption[]) => {
      const newSelectedFieldValues = newSelectedOptions.map(mapToField);
      onChangeAsFields(newSelectedFieldValues);
    },
    [onChangeAsFields, mapToField],
  );

  const mapper = { options, selectedOptions, onChange };

  return mapper;
}
