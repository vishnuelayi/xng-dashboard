import { XNGBigTableProps } from "../table";
import { TableRow, TableCell } from "@mui/material";
import { SelectableRowFirstCell } from "./selectables";

export default function Row<T>(props: XNGBigTableProps<T> & { row: T; rowUID: number }) {
  const { row, rowUID } = props;
  const rowToggled =
    props.useSelectableRows?.rowSelections.find((sr) => sr.rowUID === rowUID)?.isSelected ?? false;

  function handleToggleRow() {
    props.useSelectableRows?.onRowToggle(rowUID);
  }

  return (
    <TableRow
      onClick={() => {
        const onRowClick = props.overrideFunctionalities?.onRowClick;
        if (onRowClick) {
          onRowClick(row);
          return;
        }
        if (props.useSelectableRows) {
          handleToggleRow();
        }
      }}
      key={rowUID}
      sx={{
        ...(props.useSelectableRows && { ":hover": { bgcolor: "#0000000C", cursor: "pointer" } }),
      }}
    >
      {props.useSelectableRows && (
        <SelectableRowFirstCell
          onToggle={(e) => {
            e.stopPropagation();
            handleToggleRow();
          }}
          checked={rowToggled}
        />
      )}

      {props.columns.map((col, colIndex) => (
        <TableCell sx={{ pl: ".5rem!important" }} key={colIndex}>
          {row[col.key] as React.ReactNode}
        </TableCell>
      ))}
    </TableRow>
  );
}
