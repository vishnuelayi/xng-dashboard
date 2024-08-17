import { TableCell, ButtonBase, Typography, Box } from "@mui/material";
import { FaCaretDown } from "react-icons/fa";
import { XNGBigTableColumn } from "../types";
import { XNGBigTableProps } from "../table";

const PX_REM = ".1rem";

export default function HeaderCell<T>(
  props: XNGBigTableProps<T> & { column: XNGBigTableColumn<T> },
) {
  const columnIsSorting = props.useSort?.sortBy?.key === props.column.key;
  const order = props.useSort?.sortBy?.order;

  function handleHeaderCellClick() {
    if (!props.useSort) return;

    if (!columnIsSorting) {
      props.useSort.onSortChange({ key: props.column.key, order: "ascending" });
      return;
    }

    if (columnIsSorting && props.useSort.sortBy?.order === "ascending") {
      props.useSort.onSortChange({ key: props.column.key, order: "descending" });
    }

    if (columnIsSorting && props.useSort.sortBy?.order === "descending") {
      props.useSort.onSortChange(null);
    }
  }

  return (
    <TableCell
      sx={{
        height: "100%",
      }}
    >
      <ButtonBase
        sx={{
          height: "100%",
          width: "100%",
          padding: ".25rem",
          borderRadius: "4px",
          ":hover": {
            bgcolor: "#0003",
          },
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
        }}
        onClick={handleHeaderCellClick}
      >
        <Typography sx={{ ml: PX_REM, ...(props.useSort && { mr: "1.2rem" }) }}>
          {props.column.label}
        </Typography>
        {columnIsSorting && (
          <Box
            sx={{
              position: "absolute",
              right: PX_REM,
              transform: `rotate(${order === "descending" ? 180 : 0}deg) 
              translateY(${order === "descending" ? "5px" : "4px"})`,
            }}
          >
            <FaCaretDown />
          </Box>
        )}
      </ButtonBase>
    </TableCell>
  );
}
