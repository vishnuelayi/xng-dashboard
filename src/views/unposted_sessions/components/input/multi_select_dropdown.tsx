import {
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
  SelectProps,
} from "@mui/material";

type MultiSelectObjType = { id: string; label: string };

export type MultiSelectValueType = string[] | MultiSelectObjType[];

type Props <T extends MultiSelectValueType>= {
  id: SelectProps["id"];
  defaultValue?: SelectProps<MultiSelectValueType>["defaultValue"];
  items: T;
  label: SelectProps["label"];
  sx?: SelectProps["sx"];
  size?: SelectProps["size"];
  fullWidth?: SelectProps["fullWidth"];
  value?: T;
  onChange?: SelectProps<MultiSelectValueType>["onChange"];
  renderList?: boolean; //Determines whether the dropdown value should render the list of items or the label of the selected items with the count of items selected.
};
const MultiSelectDropdown = <T extends MultiSelectValueType>(props: Props<T>) => {
  // console.log(props.items);



  return (
    <FormControl sx={{  minWidth: "50px", maxWidth: "280px" }} fullWidth={props.fullWidth}>
      <InputLabel
        id={`${props.label}-label`}
        size={props.size === "medium" ? "normal" : props.size}
      >
        {props.label}
      </InputLabel>
      <Select
        labelId={`${props.label}-label`}
        id={props.id}
        multiple
        value={props.value}
        onChange={props.onChange}
        onBlur={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        input={<OutlinedInput label={props.label} />}
        renderValue={(selected) => {
          return props.renderList
            ? selected.map(select => {
                const isStringArray = typeof props.items[0] === 'string';

                if(isStringArray){
                  return (props.items as string[]).find(item => item === select)
                }
                else{
                  return (props.items as MultiSelectObjType[]).find(item => item.id === select)?.label
                }
              // typeof select === "string" ? ((props.items.find(item => (item as MultiSelectObjType).id === select))) : select.label
            }).join(",")
            : `${props.label} (${props.value?.length} selected)`;
        }}
        size={props.size}
        slotProps={{
          input: { size: 120 },
        }}
        sx={props?.sx}
        // MenuProps={MenuProps}
      >
        {props.items.map((item, i) => {
          // console.log(item)
          return (
            <MenuItem key={i} value={typeof item === "string" ? item : item.id}>
              <Checkbox
                checked={!!(() => {
                  const itemIsString = typeof item === "string";
                  const valueIsString = props.value && typeof props.value[0] === "string";

                  if (itemIsString && valueIsString) {
                    return (props.value as string[])?.find((value) => value === item);
                  } else if (!itemIsString && !valueIsString) {
                    return (props.value as MultiSelectObjType[])?.find((value) => value.id === item.id);
                  } else if (itemIsString && !valueIsString) {
                    return (props.value as MultiSelectObjType[])?.find((value) => value.id === item);
                  } else if (!itemIsString && valueIsString) {
                    return (props.value as string[])?.find((value) => value === item.id);
                  }
                  else{
                    return false;
                  }
                })()}
              />
              <ListItemText primary={typeof item === "string" ? item : item.label} />
            </MenuItem>
          );})}
      </Select>
    </FormControl>
  );
};

export default MultiSelectDropdown;
