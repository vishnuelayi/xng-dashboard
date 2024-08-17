import { Box, Table, TableBody, TableHead, TableRow } from "@mui/material";
import {
  TablePaginationProps,
  TableDataProps,
  TableRequestParameters,
  TableSelectableProps,
  TableSortableProps,
  TableStylingProps,
  TableOverrideFunctionalityProps,
} from "./types";
import { SelectableColumnHeaderCell } from "./components/selectables";
import { useEffect } from "react";
import FooterPaginationControls from "./components/footer_pagination_controls";
import { GREY_COLOR } from "./constants/grey_color";
import HeaderCell from "./components/header_cell";
import Row from "./components/row";

export type XNGBigTableProps<T> = TableDataProps<T> &
  TableSelectableProps<T> &
  TableSortableProps<T> &
  TableOverrideFunctionalityProps<T> &
  TablePaginationProps &
  TableStylingProps;

function XNGBigTable<T>(props: XNGBigTableProps<T>) {
  /**
   * Determines whether to leverage client-side or server-side sorting based on the current modules being used.
   */
  async function clientOrServerSort() {
    if (!props.useSort) return;

    function getIsViewingAll() {
      if (!props.usePagination) {
        return true;
      } else {
        return props.usePagination?.isViewingAll;
      }
    }

    const isViewingAll = getIsViewingAll();
    if (!isViewingAll) {
      // we do not have all the data on the front end, so leverage server-side sorting
      if (props.onTableRequestParametersChange) {
        props.onTableRequestParametersChange(getTableParameters());
        return;
      }
    } else {
      // we already have all of the data, so sort on the front end
      props.useSort.onClientSideSort();
    }
  }

  // Helpers

  function getTableParameters(): TableRequestParameters<T> {
    const res: TableRequestParameters<T> = {
      pageIndex: props.usePagination?.pageIndex ?? 0,
      resultsPerPage: props.usePagination?.resultsPerPage ?? 0,
      sortBy: props.useSort?.sortBy ?? null,
    };

    return res;
  }

  // Lifecycle Effects

  useEffect(() => {
    if (props.onTableRequestParametersChange) {
      props.onTableRequestParametersChange(getTableParameters());
    }
  }, [props.usePagination?.pageIndex, props.usePagination?.resultsPerPage]);

  useEffect(() => {
    if (!props.useSort) return;
    clientOrServerSort();
  }, [props.useSort?.sortBy, props.useSort?.originalRows]);

  return (
    <Box>
      <Box
        sx={{
          overflowX: "auto",
          ...(props.styling?.heightRelativeToScreen && {
            height: `calc(100vh - ${props.styling.heightRelativeToScreen}rem)`,
          }),
        }}
      >
        <Table
          sx={{
            borderRadius: "4px",
            ".MuiTableCell-root": {
              p: ".1rem",
            },
          }}
        >
          <Head {...props} />
          <Body {...props} />
        </Table>
      </Box>
      {props.usePagination && <FooterPaginationControls {...props} />}
    </Box>
  );
}

function Head<T>(props: XNGBigTableProps<T>) {
  return (
    <TableHead
      sx={{ bgcolor: GREY_COLOR, position: "sticky", top: 0, zIndex: 99, whiteSpace: "nowrap" }}
    >
      <TableRow>
        {props.useSelectableRows && (
          <SelectableColumnHeaderCell
            value={props.useSelectableRows!.isAllToggled}
            onClick={() => {
              props.useSelectableRows!.toggleAll();
            }}
            numSelected={props.useSelectableRows.rowSelections.filter((rs) => rs.isSelected).length}
          />
        )}

        {props.columns.map((col, i) => (
          <HeaderCell column={col} {...props} key={i} />
        ))}
      </TableRow>
    </TableHead>
  );
}

function Body<T>(props: XNGBigTableProps<T>) {
  return (
    <TableBody>
      {props.useSort?.sortedRows
        ? props.useSort.sortedRows.map((kr, i) => (
            <Row key={i} {...props} row={kr.row} rowUID={kr.uid} />
          ))
        : props.rows?.map((row, i) => <Row key={i} {...props} row={row} rowUID={i} />)}
    </TableBody>
  );
}

export default XNGBigTable;
