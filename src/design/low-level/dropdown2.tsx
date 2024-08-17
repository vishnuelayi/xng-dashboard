import {
  Box,
  Checkbox,
  Chip,
  ChipProps,
  FormHelperText,
  ListItemText,
  Radio,
  alpha,
  useTheme,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem, { MenuItemProps } from "@mui/material/MenuItem";
import Select, { SelectProps } from "@mui/material/Select";
import React from "react";

type Props<T extends {}> = {
  id: SelectProps["id"];
  defaultValue?: SelectProps<any | undefined>["defaultValue"];
  items?: any[];
  label: SelectProps["label"];
  disabled?: SelectProps["disabled"];
  sx?: SelectProps["sx"];
  fullWidth?: boolean;
  useError?: string;
  renderValueVariant?: "string" | "chip";
  renderOptionsVariant?: "string" | "radio";
  onChipDelete?: (value: any, deleteAll?: boolean) => void | undefined;
  useTypedDropDown?: {
    defaultValue?: SelectProps<T | undefined>["defaultValue"];
    value?: SelectProps<T | undefined>["value"];
    items: T[];
    getRenderedValue: (item: T | undefined, index?:number) => React.ReactNode;
    getRenderedValueKey?: (item: T | undefined) => string; //necessary if we're using typed select
    onChange?: (item: T) => void | undefined;
  };
  useMultipleSelect?: {
    defaultValue?: SelectProps<any | undefined>["defaultValue"];
    value?: SelectProps<any[] | undefined>["value"];
    items: any[];
    useSelectAll?: boolean; 
    getRenderedValue: (item: any | undefined) => string;
    getRenderedValueKey?: (item: any | undefined) => string; //necessary if we're using typed select
    renderOptionsVariant?: "string" | "checkbox";
    overrideSelectedComparison?: (item: any, selected: any[]) => boolean;
    onChange?: (item: any[]) => void | undefined;
    onChipDelete?: (item: any, deleteAll?: boolean) => void | undefined;
    useTypedSelect?: boolean;
  };
  enableButtomMargin?: boolean;
  maxwidth?: string;
  variant?: "standard" | "onPrimary";
  size?: SelectProps["size"];
  value?: SelectProps<any | undefined>["value"];
  onChange?: SelectProps<any>["onChange"];
  onBlur?: SelectProps["onBlur"]; // assign onBlur event
  name?: SelectProps["name"]; // assign name prop
  readonly?: boolean;
};

const XNGDropDown = <T extends {}>(props: Props<T>, ref?: React.Ref<HTMLDivElement>) => {
  //#region  React Hooks
  // strictly for multi select
  const [isAllChecked, setIsAllChecked] = React.useState(
    props?.useMultipleSelect?.value?.length === props?.useMultipleSelect?.items.length,
  );
  const isAllSelected = React.useMemo(() => {
    return (
      isAllChecked &&
      props.useMultipleSelect &&
      props.useMultipleSelect.value?.length === props.useMultipleSelect.items.length
    );
  }, [isAllChecked, props.useMultipleSelect]);

  const primary_color = useTheme().palette.primary.main;
  //#endregion

  //#region custom components
  const MultiSelectMenuItem = React.forwardRef(
    (ms_props: { item: any; isAll?: boolean } & MenuItemProps, ref: any) => {
      const { item, value, isAll, ...other } = ms_props;
      // console.log(item)
      return (
        <MenuItem
          ref={ref}
          value={isAll ? "All" : props.useMultipleSelect?.getRenderedValue(item)}
          sx={{ bgcolor: isAllSelected ? alpha(primary_color, 0.08) : "unset" }}
          onMouseDownCapture={(e) => {
            // console.log("mouse down capture");
            if (isAll) {
              if (isAllSelected) {
                props.useMultipleSelect?.onChipDelete?.("All", true);
                props.useMultipleSelect?.onChange?.([]);
                setIsAllChecked(false);
              } else {
                props.useMultipleSelect?.onChange?.(props.useMultipleSelect?.items);
                setIsAllChecked(true);
              }
            }
          }}
          {...(isAll ? {} : other)}
        >
          {props.useMultipleSelect?.renderOptionsVariant &&
          props.useMultipleSelect.renderOptionsVariant === "checkbox" ? (
            <Checkbox
              size="small"
              onMouseDown={(e) => e.stopPropagation()}
              checked={
                isAll
                  ? isAllSelected /* (props.useMultipleSelect.value as any[]).indexOf("All") > -1 */
                  : props.useMultipleSelect.overrideSelectedComparison
                  ? props.useMultipleSelect.overrideSelectedComparison(
                      item,
                      props.useMultipleSelect?.value || [],
                    )
                  : props.useMultipleSelect.useTypedSelect
                  ? (props.useMultipleSelect.value as any[]).find(
                      (val) =>
                        props.useMultipleSelect?.getRenderedValueKey?.(val) ===
                        props.useMultipleSelect?.getRenderedValueKey?.(item),
                    )
                  : (props.useMultipleSelect.value as any[]).indexOf(item) > -1
              }
            />
          ) : null}
          <ListItemText primary={isAll ? "All" : props.useMultipleSelect?.getRenderedValue(item)} />
        </MenuItem>
      );
    },
  );

  const ChipRenderValueItem = React.forwardRef((ms_props: ChipProps, ref: any) => {
    return (
      <Chip
        size="small"
        sx={{
          height: "auto",
          minWidth: "50px",
          maxWidth: "100px",
          justifyContent: "space-between",
          zIndex: 1000,
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onDelete={ms_props.onDelete}
        {...ms_props}
      />
    );
  });
  //#endregion

  //#region helper methods
  const getMultiSelectParsedValueIfTyped = (value: any[]) => {
    return props.useMultipleSelect?.useTypedSelect ? value?.map((item) => JSON.parse(item)) : value;
  };
  //#endregion

  if (props.useMultipleSelect?.useTypedSelect && !props.useMultipleSelect.getRenderedValueKey) {
    console.error("useTypedSelect prop requires getRenderedValueKey prop to be defined");
    return null;
  }

  return (
    <FormControl
      fullWidth={props.fullWidth}
      sx={{
        minWidth: "50px",
        maxWidth: props.maxwidth ?? "280px",
        mb: props.enableButtomMargin ? "1rem" : "0",
        ...props.sx,
      }}
      disabled={props.disabled}
      // onBlur={props.onBlur}
    >
      <InputLabel
        id={props.id}
        size={props.size === "medium" ? "normal" : props.size}
        disabled={props.disabled}
      >
        {props.label}
      </InputLabel>
      <Select
        slotProps={{ input: { readOnly: props.readonly } }}
        value={
          props.useTypedDropDown
            ? JSON.stringify(props.useTypedDropDown.value)
            : props.useMultipleSelect
            ? (props.useMultipleSelect.value as any[])?.map((item, i) =>
                {
                  // console.log("BOOM", !props.useMultipleSelect?.useTypedSelect
                  //   ? props.useMultipleSelect?.getRenderedValue(item)
                  //   : JSON.stringify(item))
                  return !props.useMultipleSelect?.useTypedSelect
                  ? props.useMultipleSelect?.getRenderedValue(item)
                  : JSON.stringify(item)},
              )
            : props?.value
        }
        defaultValue={
          props.useTypedDropDown
            ? JSON.stringify(props.useTypedDropDown.defaultValue)
            : props.useMultipleSelect
            ? (props.useMultipleSelect.defaultValue as any[])?.map((item) =>
                !props.useMultipleSelect?.useTypedSelect
                  ? props.useMultipleSelect?.getRenderedValue(item)
                  : JSON.stringify(props.useMultipleSelect?.getRenderedValue(item)),
              )
            : props.defaultValue
        }
        id={props.id}
        name={props.name}
        label={props.label}
        disabled={props.disabled}
        multiple={props.useMultipleSelect ? true : false}
        renderValue={(value) =>
          props.useTypedDropDown
            ? props.useTypedDropDown?.getRenderedValue(JSON.parse(value as string) as T)
            : props.useMultipleSelect
            ? (() => {
                switch (props.renderValueVariant) {
                  case "string":
                    return isAllSelected
                      ? "All"
                      : getMultiSelectParsedValueIfTyped(value)
                          .map((item) => props.useMultipleSelect?.getRenderedValue(item))
                          .join(", ");
                  case "chip":
                    return (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {isAllSelected ? (
                          <ChipRenderValueItem
                            key={"All"}
                            label={"All"}
                            onDelete={() => {
                              setIsAllChecked(false);
                              props.useMultipleSelect?.onChange?.([]);
                              props.useMultipleSelect?.onChipDelete?.("All", true);
                            }}
                          />
                        ) : (
                          getMultiSelectParsedValueIfTyped(value).map((item, i) => (
                            <ChipRenderValueItem
                              key={props.useMultipleSelect?.getRenderedValueKey?.(item) || i}
                              label={props.useMultipleSelect?.getRenderedValue(item)}
                              onDelete={() => {
                                props.useMultipleSelect?.onChipDelete?.(item);
                              }}
                            />
                          ))
                        )}
                      </Box>
                    );
                  default:
                    return isAllSelected
                      ? "All"
                      : getMultiSelectParsedValueIfTyped(value)
                          .map((item) => props.useMultipleSelect?.getRenderedValue(item))
                          .join(", ");
                }
              })()
            : props.renderValueVariant === "chip" ? <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {isAllSelected ? (
              <ChipRenderValueItem
                label={"All"}
                onDelete={() => {
                  setIsAllChecked(false);
                  props.useMultipleSelect?.onChange?.([]);
                  props?.onChipDelete?.("All", true);
                }}
              />
            ) : (
              <ChipRenderValueItem
                  label={value}
                  onDelete={() => {
                    props?.onChipDelete?.(value);
                  }}
                />
            )}
          </Box> : (value as string)
        }
        onChange={
          props.useTypedDropDown
            ? (e) => {
                const selected = JSON.parse(e.target.value as string) as T;
                props.useTypedDropDown?.onChange && props.useTypedDropDown?.onChange(selected);
              }
            : props.useMultipleSelect
            ? (e) => {
                const selected = e.target.value as any[];

                // console.log("selected: ", selected);
                if(props.useMultipleSelect && selected.length >= props?.useMultipleSelect?.items.length) setIsAllChecked(true);

                props.useMultipleSelect?.onChange &&
                  props.useMultipleSelect?.onChange(
                    props.useMultipleSelect.useTypedSelect
                      ? selected?.map((item) => JSON.parse(item))
                      : selected,
                  );
              }
            : props?.onChange
        }
        sx={{
          backgroundColor: props.variant === "onPrimary" ? "white" : undefined,
          "& .MuiSelect-multiple": {
            // backgroundColor:"secondary.main",
            maxHeight: "65px",
          },
          ...props.sx,
        }}
        size={props.size}
        onBlur={props.onBlur}
        // onClick={(e) => {
        //   e.stopPropagation();
        // }}
      >

        {(props.useTypedDropDown ? props.useTypedDropDown.items : props.items || []).map(
          (item, i) => {
            const valueBasedOnType = props.useTypedDropDown
            ? JSON.stringify(item) /* props.useTypedDropDown.getRenderedValue(item as T) */
            : (item as string);
            const radioChecked = props.useTypedDropDown ? /* props.useTypedDropDown.getRenderedValue(props.useTypedDropDown.value as T) */ props.useTypedDropDown.value === JSON.stringify(item) : props.value === item;
            return (
            <MenuItem
              key={(item as any)?.id || i}
              value={valueBasedOnType}
            >
              {props.renderOptionsVariant === "radio" && <Radio size="small" value={props.useTypedDropDown ? props.useTypedDropDown?.getRenderedValue(item, i) : valueBasedOnType} checked={radioChecked}/>}
              {props.useTypedDropDown ? props.useTypedDropDown?.getRenderedValue(item, i) : valueBasedOnType}
            </MenuItem>
          )},
        )}
        {props?.useMultipleSelect?.useSelectAll && (
          <MultiSelectMenuItem item={"all"} value={"All"} isAll />
          // <MenuItem value={"all"}>All</MenuItem>
        )}

        {props.useMultipleSelect?.items.map((item, i) => (
          <MultiSelectMenuItem
            key={props.useMultipleSelect?.getRenderedValueKey?.(item) || i}
            // value={props.useMultipleSelect?.getRenderedValue(item)}
            value={props.useMultipleSelect?.useTypedSelect ? JSON.stringify(item) : item}
            item={item}
          />
        ))}
      </Select>
      <FormHelperText error={!!props.useError} sx={{ marginInline: 0 }}>
        {props.useError}
      </FormHelperText>
    </FormControl>
  );
};

export default React.forwardRef(XNGDropDown) as <T extends {}>(
  props: Props<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;
