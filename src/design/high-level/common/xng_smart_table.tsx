import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  Stack,
  Typography,
  Pagination,
  Box,
  Checkbox,
  Skeleton,
  useTheme,
  Collapse,
  IconButton,
  Tooltip,
  TooltipProps,
} from "@mui/material";
import React, { CSSProperties } from "react";
import { XNGIconRenderer, XNGICONS } from "../..";
import XNGDropDown from "../../low-level/dropdown2";
import useXNGPagination from "../../../hooks/use_xng_pagination";
import TableSortDirection from "../../types/table_sort_directions";
import smartTableSortFn from "../../../utils/smart_table_sort_fn";

type Props<T> = {
  rowsConfig: {
    rowHoverColor?: CSSProperties["color"];
    rows: T[] | undefined;
    useSelectableRows?: {
      defaultSelectedRows?: T[];
      compareFunction: (row1: T, row2: T) => boolean; //this is used to compare items in our table to items we have in our selectedRows array
      onRowSelected?: (rows: T[]) => void; //on row selected you get an array of all the roles that have been selected
      useControlled?: {
        value: T[];
        selectAllCheckboxisChecked: boolean; //this is used to compare items in our table to items we have in our selectedRows array
        rowCheckBoxIsChecked: (row: T) => boolean; //this is used to compare items in our table to items we have in our selectedRows array
        onCheckBoxChange: (row: T, checked: boolean) => void; //what happens when a checkbox is checked
        onSelectAllCheckBoxChange: (checked: boolean) => void; //what happens when the select all checkbox is checked
      };
    };
    onClickRow?: (row: T, index: number) => void;
  };
  columnsConfig: {
    columns: {
      key: string; // must be name of property in T OR Object you intend to populate the table with
      headerName: string;
      useOverride?: {
        overrideColumnIndex?: number;
        overrideCell?: (row: T) => React.ReactNode;
        overrideSortComparator?: (a: T, b: T) => 1 | 0 | -1;
        overrideNullPlaceholder?: React.ReactNode;
        useNestedTable?: ( row?: T
        ) => {
          title?: string;
          expandOnCellClick?: boolean;
          columns: {
            key: string; // must be name of property in T OR Object you intend to populate the table with
            headerName: string;
            minWidth?: CSSProperties["minWidth"];
            useOverride?: {
              overrideCell?: (nested_cell_row: any) => any;
              overrideNullPlaceholder?: React.ReactNode;
            };
          }[];
          rows: any[] | undefined | null;
        };
      };
      convertToExpectedType?: (value: T) => any;
      disableSort?: boolean;
      width?: CSSProperties["width"];
      minWidth?: CSSProperties["minWidth"];
      noWrap?: boolean;
      useTooltip?: {
        placement?: TooltipProps["placement"];
        overrideTitle?: <C extends T[keyof T]>(cell: C) => React.ReactNode;
      };
    }[];
  };

  headerConfig?: {
    bgColor?: CSSProperties["backgroundColor"];
    cellTextColor?: CSSProperties["color"];
    cellTextHoverColor?: CSSProperties["color"];
  };
  footerConfig?: {
    bgColor?: CSSProperties["backgroundColor"];
    itemsPerPageOptions?: number[];
  };
  useSort?: {
    onColumnSortChange?: (columnKey: string, direction: TableSortDirection, rows: T[]) => void;
    useControlled?: {
      keyValue: string;
      onChange: (columnKey: string, direction: TableSortDirection) => void;
    };
    iconVariant?: "single" | "double";
    sortAlgorithm?: "default" | "quick_sort";
  };
  usePagination?: {
    useControl?: {
      itemsPerPage: number;
      currentPage: number;
      totalPages: number;
      totalItems: number;
      onSetCurrentPage: (pageNumbers: number) => void;
      onSetItemsPerPage: (itemsPerPage: number) => void;
    };
  };
  width?: CSSProperties["width"];
  maxheight?: CSSProperties["maxHeight"];
  minWidth?: CSSProperties["minWidth"];
  disableInteractivity?: boolean;
  useTableLoading?: {
    isloading: boolean;
    disableInteractivity?: boolean;
    showSkeleton?: boolean;
  };
  emptyTableText?: string;
};

const XNGSmartTable = <T extends {}>(props: Props<T>) => {
  const xng_theme_palette = useTheme().palette;

  /**
   * Remaps the header columns based on the columns configuration.
   * This basically checks if we re oganized the columns using the useOverride.overrideColumnIndex property
   *
   * @returns {Array} The remapped header columns.
   */
  const column_definition = React.useMemo(() => {
    const header_columns_array = props.columnsConfig.columns.map((h_col) => ({
      ...h_col,
    }));

    props.columnsConfig.columns.forEach((col, prev_index) => {
      if (col.useOverride && col.useOverride.overrideColumnIndex) {
        [
          header_columns_array[col.useOverride.overrideColumnIndex],
          header_columns_array[prev_index],
        ] = [
          header_columns_array[prev_index],
          header_columns_array[col.useOverride.overrideColumnIndex],
        ];
      }
    });

    return header_columns_array;
  }, [props.columnsConfig.columns]);

  //#region Sorting
  /**
   * Represents the state of the selected uncontrolled column sort.
   * @typedef {Object} SelectedUncontrolledColumnSort
   * @property {string} columnKey - The key of the selected column.
   * @property {TableSortDirection} direction - The sort direction of the selected column.
   */
  const [selectedUncontrolledColumnSort, setSelectedUncontrolledColumnSort] = React.useState<
    | {
        columnKey: string;
        direction: TableSortDirection;
      }
    | undefined
  >(
    props.useSort?.useControlled
      ? undefined
      : {
          columnKey: column_definition[0].key,
          direction: "asc",
        },
  );

  /**
   * Returns the sorted items for the XNG Smart Table component.
   * If the `useSort` prop is enabled and not controlled, it applies sorting based on the selected column and direction.
   * If the selected column has `disableSort` set to `true`, it returns an empty array.
   * Otherwise, it applies sorting using the provided sort algorithm and column configuration.
   * If the `useSort` prop is not enabled or controlled, it returns the rows from the `rowsConfig` prop.
   *
   * @returns The sorted items for the XNG Smart Table.
   */
  const sortedItemsUncontrolled = React.useMemo(() => {
    if (props.useSort && !props.useSort.useControlled) {
      const column = column_definition.find(
        (col) => col.key === selectedUncontrolledColumnSort?.columnKey,
      );
      if (column?.disableSort) {
        return [];
      }

      return smartTableSortFn(
        props.rowsConfig.rows || [],
        selectedUncontrolledColumnSort?.direction || "asc",
        props.useSort.sortAlgorithm || "default",
        {
          columnKey: column?.key,
          convertToExpectedType: column?.convertToExpectedType,
          overrideSortComparator: column?.useOverride?.overrideSortComparator,
        },
      );
    } else {
      return props.rowsConfig?.rows || [];
    }
  }, [
    props.useSort,
    column_definition,
    props.rowsConfig.rows,
    selectedUncontrolledColumnSort?.direction,
    selectedUncontrolledColumnSort?.columnKey,
  ]);

  /**
   * The current sort direction of the table.
   */
  const currentSortDirection = React.useRef<TableSortDirection>("asc");
  //#endregion

  //#region filtering
  /**
   * The state for items per page select filter.
   *
   * @component
   * @param {object} props - The component props.
   * @param {object} props.footerConfig - The configuration for the table footer.
   * @param {number[]} props.footerConfig.itemsPerPageOptions - The options for the number of items per page.
   * @returns {JSX.Element} The rendered smart table component.
   */
  const [itemsPerPage, setItemsPerPage] = React.useState(
    props.footerConfig?.itemsPerPageOptions && props.footerConfig?.itemsPerPageOptions.length > 0
      ? props.footerConfig?.itemsPerPageOptions?.[0]
      : 10,
  );

  //#endregion

  //#region Pagination
  /**
   * Calculates the pagination for the XNG smart table.
   *
   * @param {Array<any>} rows - The array of rows to paginate.
   * @param {number} itemsPerPage - The number of items to display per page.
   * @returns {Pagination} The pagination object containing the necessary information for pagination.
   */
  const pagination = useXNGPagination(
    !props?.usePagination || props?.usePagination?.useControl
      ? []
      : !props.useSort?.useControlled
      ? props.rowsConfig.rows
      : sortedItemsUncontrolled,
    itemsPerPage,
  );

  //#endregion

  //#region selection
  const [unControlledselectedRows, setUncontrolledSelectedRows] = React.useState<T[]>(
    props.rowsConfig.useSelectableRows?.useControlled
      ? []
      : props.rowsConfig.useSelectableRows?.defaultSelectedRows ?? [],
  );

  const selectedRows = React.useMemo(() => {
    return props.rowsConfig.useSelectableRows?.useControlled
      ? props.rowsConfig.useSelectableRows?.useControlled.value
      : unControlledselectedRows;
  }, [props.rowsConfig.useSelectableRows?.useControlled, unControlledselectedRows]);

  const allRowsAreSelected = !!(
    props.rowsConfig.useSelectableRows && selectedRows.length === props.rowsConfig.rows?.length
  );
  //#endregion

  //#region side effects
  //strictly for calling the onSelectedRowsChange callback when selectedRows changes
  // React.useEffect(() => {
  //   console.log("selectedRows: ", selectedRows )
  //   if (props.rowsConfig.useSelectableRows?.onRowSelected) {
  //     props.rowsConfig.useSelectableRows?.onRowSelected(selectedRows);
  //   }
  // }, [selectedRows, props.rowsConfig.useSelectableRows]);

  // strictly for resetting the selected rows when the defaultSelectedRows changes
  React.useEffect(() => {
    setUncontrolledSelectedRows(props.rowsConfig.useSelectableRows?.defaultSelectedRows ?? []);
  }, [props.rowsConfig.useSelectableRows?.defaultSelectedRows]);

  //strictly for calling the onColumnSortChange callback when columnSort changes
  React.useEffect(() => {
    if (props.useSort?.onColumnSortChange) {
      props.useSort.onColumnSortChange(
        selectedUncontrolledColumnSort?.columnKey || "",
        selectedUncontrolledColumnSort?.direction || "asc",
        sortedItemsUncontrolled,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUncontrolledColumnSort]);
  //#endregion

  //#region derived state

  const rows =
    props.usePagination?.useControl ||
    (!props.usePagination && !props.useSort) ||
    (!props.usePagination && props.useSort?.useControlled)
      ? props.rowsConfig.rows
      : !props.usePagination && props.useSort
      ? sortedItemsUncontrolled
      : pagination.paginatedItems;

  // const rows =
  // props?.usePagination?.useControl && props.useSort?.useControlled
  //   ? props.rowsConfig.rows
  //   : !props?.usePagination?.useControl && !props.useSort?.useControlled
  //   ? sortedItemsUncontrolled
  //   : pagination.paginatedItems;
  //#endregion
  //#region components

  const TableHeaderCell = (tableHeaderProps: {
    index: number;
    columnKey: string;
    headerName: string;
    isSelector?: boolean;
    width?: CSSProperties["width"];
    disableSort?: boolean;
  }) => {
    const { columnKey, headerName, isSelector, width, disableSort, index } = tableHeaderProps;
    const canSortColumn = !disableSort;

    const isColumnSelected = (sortDirection: TableSortDirection) => {
      return (
        (props.useSort?.useControlled?.keyValue === columnKey ||
          selectedUncontrolledColumnSort?.columnKey === columnKey) &&
        currentSortDirection.current === sortDirection
      );
    };
    // console.log("cansortcolumn: ", disableSort)
    return (
      <TableCell
        width={width}
        sx={{
          bgcolor: props?.headerConfig?.bgColor ?? "contrasts.1",
          color:
            canSortColumn && (isColumnSelected("asc") || isColumnSelected("desc"))
              ? "primary.main"
              : "black",
          // props.columnsConfig.useColumnSort &&
          // props.columnsConfig.useColumnSort.useControlled?.keyValue === columnKey
          //   ? props.headerConfig.cellTextHoverColor
          //     ? props.headerConfig.cellTextHoverColor
          //     : "primary.1"
          //   : "black",
          fontWeight: "bold",
          p: 2,
          whiteSpace: "nowrap",
          ":hover": {
            color:
              !!props.useSort && canSortColumn
                ? props?.headerConfig?.cellTextHoverColor
                  ? props?.headerConfig?.cellTextHoverColor
                  : "primary.3"
                : "initial",
          },
        }}
      >
        <Box
          component={"span"}
          display={"flex"}
          alignItems={"center"}
          gap={"4px"}
          sx={{
            cursor: !!props.useSort && canSortColumn ? "pointer" : "initial",
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (
              props?.disableInteractivity ||
              (props?.useTableLoading?.isloading && props?.useTableLoading?.disableInteractivity)
            )
              return;
            if (props.useSort?.useControlled && !isSelector && canSortColumn) {
              currentSortDirection.current =
                props.useSort.useControlled?.keyValue === columnKey &&
                currentSortDirection.current === "asc"
                  ? "desc"
                  : "asc";
              props.useSort &&
                props.useSort.useControlled?.onChange(columnKey, currentSortDirection.current);
            } else if (!!props.useSort && !isSelector && canSortColumn) {
              currentSortDirection.current =
                selectedUncontrolledColumnSort?.columnKey === columnKey &&
                currentSortDirection.current === "asc"
                  ? "desc"
                  : "asc";
              setSelectedUncontrolledColumnSort({
                columnKey: columnKey,
                direction: currentSortDirection.current,
              });
            }
          }}
        >
          {!isSelector && headerName}
          {isSelector ? (
            <Checkbox
              size="small"
              checked={allRowsAreSelected}
              onChange={(e) => {
                e.stopPropagation();
                if (props.rowsConfig.useSelectableRows?.useControlled) {
                  props.rowsConfig.useSelectableRows?.useControlled.onSelectAllCheckBoxChange(
                    e.target.checked,
                  );
                } else {
                  if (e.target.checked) {
                    setUncontrolledSelectedRows([...(props.rowsConfig?.rows || [])]);
                    props.rowsConfig.useSelectableRows?.onRowSelected?.(
                      props.rowsConfig?.rows || [],
                    );
                  } else {
                    props.rowsConfig.useSelectableRows?.onRowSelected?.([]);
                    setUncontrolledSelectedRows([]);
                  }
                }
              }}
            />
          ) : (
            !!props.useSort &&
            !column_definition[index]?.disableSort && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {(props.useSort.iconVariant === "double" || isColumnSelected("asc")) && (
                  <XNGIconRenderer
                    i={<XNGICONS.Caret />}
                    up
                    size={isColumnSelected("asc") ? "7.5px" : "6px"}
                    color={
                      isColumnSelected("asc")
                        ? props?.headerConfig?.cellTextHoverColor
                          ? props.headerConfig.cellTextHoverColor
                          : xng_theme_palette.primary.main
                        : xng_theme_palette.contrasts?.[4]
                    }
                  />
                )}
                {(props.useSort.iconVariant === "double" || !isColumnSelected("asc")) && (
                  <XNGIconRenderer
                    i={<XNGICONS.Caret />}
                    down
                    size={isColumnSelected("desc") ? "7.5px" : "6px"}
                    color={
                      isColumnSelected("desc")
                        ? props?.headerConfig?.cellTextHoverColor
                          ? props.headerConfig.cellTextHoverColor
                          : xng_theme_palette.primary.main
                        : xng_theme_palette.contrasts?.[4]
                    }
                  />
                )}
              </Box>
            )
          )}
        </Box>
      </TableCell>
    );
  };

  const tableHeader = (
    <TableHead>
      <TableRow>
        {props.rowsConfig.useSelectableRows && (
          <TableHeaderCell
            index={-1}
            columnKey={"all"}
            headerName={"All"}
            isSelector
            disableSort={true}
          />
        )}
        {(() => {
          return column_definition.map((column, i) => (
            <TableHeaderCell
              index={i}
              key={column.key}
              columnKey={column.key}
              headerName={column.headerName}
              width={column?.width}
              // Need to revisit this as this is responsible for overriding the default can sort flag
              disableSort={
                column.disableSort === undefined && !!!props.useSort ? true : column.disableSort
              }
            />
          ));
        })()}
      </TableRow>
    </TableHead>
  );

  const XNGTableBody = () => {
    return (
      <TableBody>
        {props?.useTableLoading?.isloading && props?.useTableLoading?.showSkeleton ? (
          <SkeletonRows />
        ) : (
          (rows?.length === 0 ? (
            <></>
          ) : (
            rows?.map((row, row_index) => {
              // const { id, ...rowProps } = row;
              return (
                <React.Fragment key={row_index}>
                  <XNGRowColumns key={row_index} row={row} row_index={row_index} />
                </React.Fragment>
              );
            })
          )) || <SkeletonRows />
        )}
      </TableBody>
    );
  };

  const XNGRowColumns = (row_col_props: { row: T; row_index: number }) => {
    const { row, row_index } = row_col_props;
    const [expanded_cell, set_expanded_cell] = React.useState<boolean[]>(
      Object.keys(row).map((_) => false) || [],
    );
    // console.log("expanded_cell: ", expanded_cell);
    return (
      <>
        <TableRow
          key={(row as any)?.id || row_index}
          sx={{
            ":hover": {
              bgcolor: props.rowsConfig.rowHoverColor ?? "primary.1",
            },
            cursor: "pointer",
          }}
        >
          {props.rowsConfig.useSelectableRows && (
            <TableCell
              sx={{
                p: 2,
              }}
            >
              <Checkbox
                size="small"
                checked={(() => {
                  if (props.rowsConfig.useSelectableRows?.useControlled) {
                    return props.rowsConfig.useSelectableRows?.useControlled.rowCheckBoxIsChecked(
                      row,
                    );
                  } else {
                    return (
                      allRowsAreSelected ||
                      !!selectedRows.find(
                        (selected) =>
                          props.rowsConfig.useSelectableRows &&
                          props.rowsConfig.useSelectableRows?.compareFunction(selected, row),
                      )
                    );
                  }
                })()}
                onChange={(e) => {
                  e.stopPropagation();
                  if (props.rowsConfig.useSelectableRows?.useControlled) {
                    props.rowsConfig.useSelectableRows?.useControlled.onCheckBoxChange(
                      row,
                      e.target.checked,
                    );
                  } else {
                    if (e.target.checked) {
                      setUncontrolledSelectedRows((prev) => {
                        const new_selected_rows = [...prev, row];
                        props.rowsConfig.useSelectableRows?.onRowSelected?.(new_selected_rows);
                        return new_selected_rows;
                      });
                    } else {
                      setUncontrolledSelectedRows((prev) => {
                        const new_rows = prev.filter(
                          (selected) =>
                            !props.rowsConfig.useSelectableRows ||
                            !props.rowsConfig.useSelectableRows?.compareFunction(selected, row),
                        );
                        props.rowsConfig.useSelectableRows?.onRowSelected?.(new_rows);
                        return new_rows;
                      });
                    }
                  }
                }}
              />
            </TableCell>
          )}
          {/* <XNGRowColumns row={row} row_index={row_index}/>  */}
          {column_definition.map((cell, cell_index) => {
            return (
              <XNGTableCell
                key={cell_index} // Add a unique key prop here
                cell_definition={cell}
                row={row}
                expanded={expanded_cell[cell_index]}
                onClick={() => {
                  props.rowsConfig.onClickRow && props.rowsConfig.onClickRow(row, row_index);
                }}
                onClickExpandBtn={() => {
                  set_expanded_cell((prev) => {
                    const new_expanded_cell = prev.map(() => false);
                    new_expanded_cell[cell_index] = !prev[cell_index];
                    return new_expanded_cell;
                  });
                }}
                emptyCellValue={column_definition[cell_index].useOverride?.overrideNullPlaceholder}
              />
            );
          })}
        </TableRow>

        {column_definition.map((column, column_index) => {
          const nested_table_config = column.useOverride?.useNestedTable?.(
            row
          );

          return nested_table_config ? (
            <TableRow
              key={`${column_index}-nested-table`}
              sx={{
                paddingBottom: 0,
                paddingTop: 0,
                transform: `scale(${expanded_cell[column_index] ? 1 : 0})`,
              }}
            >
              {props.rowsConfig.useSelectableRows && <TableCell />}
              {column_definition.map((_, i) => {

                return expanded_cell[column_index] && i === column_index ? <TableCell style={{ paddingBottom: 0, paddingTop: 0 }}>
                <Collapse in={expanded_cell[column_index]} timeout="auto" unmountOnExit>
                  <Typography
                    gutterBottom
                    component="div"
                    sx={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      pl: 2,
                      pt: 1,
                      textTransform: "capitalize",
                    }}
                  >
                    {nested_table_config.title ?? column_definition[column_index].useOverride?.overrideCell?.(row)}
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{backgroundColor:"contrasts.1"}}>
                        {nested_table_config?.columns.map((c) => {
                          return (
                            <TableCell
                              key={c.key}
                              sx={{
                                fontWeight: 700,
                                borderBottom: `1px solid ${xng_theme_palette.contrasts?.[1]}`,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {c.headerName}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {nested_table_config?.rows?.map((r, i) => {
                        // console.log()
                        return (
                          <TableRow key={i}>
                            {nested_table_config.columns.map((c) => {
                              return (
                                <TableCell
                                  key={c.key}
                                  sx={{
                                    borderBottom: `1px solid ${xng_theme_palette.contrasts?.[1]}`,
                                    minWidth: c.minWidth,
                                  }}
                                >
                                  {c.useOverride?.overrideCell?.(r) ??
                                    r[c.key] ??
                                    c.useOverride?.overrideNullPlaceholder ??
                                    "N/A"}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Collapse>
              </TableCell> : <TableCell />
              })}
            </TableRow>
          ) : undefined;
        })}
      </>
    );
  };

  const XNGTableCell = (cell_props: {
    cell_definition: (typeof column_definition)[0];
    row: T;
    expanded: boolean;
    emptyCellValue?: React.ReactNode;
    onClick?: () => void;
    onClickExpandBtn: () => void;
  }) => {
    const { cell_definition, row, onClick, emptyCellValue, onClickExpandBtn } = cell_props;
    const [mouse_hovering, setMouseHovering] = React.useState(false); //hover over cell state - typically useful for controlling tooltip visibility
    const table_cell_ref = React.useRef<HTMLTableCellElement | null>(null);
    const expand_btn = cell_definition?.useOverride?.useNestedTable && (
      <IconButton
        size="small"
        sx={{
          ml: 0.5,
          svg: {
            transform: `rotate(${cell_props.expanded ? -90 : 90}deg) scale(0.75)`,
            "*": {
              fill: cell_props.expanded
                ? xng_theme_palette.primary.main
                : xng_theme_palette.contrasts?.[3], // Change the color to your desired value
            },
          },
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClickExpandBtn()
        }}
      >
        <XNGICONS.Caret />
      </IconButton>
    );
    const cell_data = cell_definition.useOverride?.overrideCell
      ? cell_definition.useOverride.overrideCell(row)
      : String(row[cell_definition.key as keyof typeof row] as React.ReactNode);

    return (
      <TableCell
        ref={table_cell_ref}
        key={cell_definition.key}
        onMouseEnter={() => {
          // console.log("hovering")
          if (cell_definition.useTooltip) setMouseHovering(true);
        }}
        onMouseLeave={() => setMouseHovering(false)}
        // width={cell.width}
        sx={{
          p: 2,
          maxWidth: cell_definition.width,
          minWidth: cell_definition.minWidth,
        }}
        onClick={cell_definition.useOverride?.useNestedTable?.(row).expandOnCellClick ? onClickExpandBtn : onClick}
      >
        <Tooltip
          open={mouse_hovering}
          title={
            cell_definition.useTooltip?.overrideTitle?.(
              row[cell_definition.key as keyof typeof row],
            ) || cell_data
          }
          placement={cell_definition.useTooltip?.placement || "top"}
          arrow
          slotProps={{
            tooltip: {
              sx: {
                backgroundColor: "primary.2",
              },
            },
            arrow: {
              sx: {
                "::before": {
                  bgcolor: "primary.2",
                },
              },
            },
          }}
        >
          <Box
            sx={{
              textOverflow: cell_definition.noWrap ? "ellipsis" : "unset",
              whiteSpace: cell_definition.noWrap ? "nowrap" : "unset",
              overflowX: cell_definition.noWrap ? "hidden" : "unset",
              fontWeight: cell_props.expanded
                ? 700
                : cell_definition.useTooltip && mouse_hovering
                ? 600
                : "initial",
              wordBreak: "break-word",
              color: cell_props.expanded
                ? xng_theme_palette.primary.main
                : cell_definition.useTooltip && mouse_hovering
                ? "info.3"
                : "initial" /* xng_theme_palette.contrasts?.[3] */, // Change the color to your desired value
            }}
          >
            {cell_data ? (
              <>
                {cell_data}
                {expand_btn}
              </>
            ) : (
              emptyCellValue ?? "N/A"
            )}
          </Box>
        </Tooltip>
      </TableCell>
    );
  };

  const SkeletonRows = () => {
    return (
      <>
        {Array.from({ length: 10 }).map((_, i) => {
          return (
            <TableRow key={i}>
              {column_definition.map((c) => {
                return (
                  <TableCell sx={{ p: 2 }} key={c.key}>
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "1rem", animationDuration: "0.75s" }}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </>
    );
  };

  const emptyTable = Array.from({ length: 3 }).map((_, i) => {
    return (
      <TableRow
        key={i}
        sx={{
          position: "sticky",
          bottom: -1,
        }}
      >
        <TableCell colSpan={1000} sx={{ textAlign: "center", p: 2, borderBottom: 0 }}>
          <Typography variant="body1" color="initial">
            {i === 1 && (props?.emptyTableText ?? "No data to display")}
          </Typography>
        </TableCell>
      </TableRow>
    );
  });

  const tableFooter = (
    <TableFooter>
      <TableRow
        sx={{
          backgroundColor: props.footerConfig?.bgColor ?? "contrasts.1",

          position: "sticky",
          bottom: -1,
        }}
      >
        <TableCell colSpan={1000} sx={{ py: !props?.usePagination ? "32px" : "16px" }}>
          {props?.usePagination && (
            <Stack
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: {
                  xs: "column",
                  md: "row",
                },
              }}
            >
              <Stack direction={"row"} alignItems={"center"} justifyContent={"flex-start"} gap={2}>
                <Typography variant="body1" color="initial">
                  Show
                </Typography>
                <XNGDropDown
                  disabled={
                    props?.disableInteractivity ||
                    (props?.useTableLoading?.isloading &&
                      props?.useTableLoading?.disableInteractivity)
                  }
                  id={"count-id"}
                  items={
                    props.footerConfig?.itemsPerPageOptions?.map((item) => item.toString()) || [
                      "10",
                      "20",
                      "50",
                      "100",
                    ]
                  }
                  value={
                    props?.usePagination.useControl
                      ? props?.usePagination.useControl.itemsPerPage.toString()
                      : itemsPerPage.toString()
                  }
                  onChange={(e) =>
                    props?.usePagination?.useControl
                      ? props?.usePagination.useControl.onSetItemsPerPage(
                          Number.parseInt(e.target.value),
                        )
                      : setItemsPerPage(Number.parseInt(e.target.value))
                  }
                  label={undefined}
                  size="small"
                />
              </Stack>
              {props?.usePagination.useControl ? (
                <Box flexGrow={1} textAlign={"center"}>
                  Showing{" "}
                  {(props?.usePagination.useControl.currentPage - 1) *
                    props?.usePagination.useControl.itemsPerPage +
                    1}{" "}
                  to{" "}
                  {Math.min(
                    props?.usePagination.useControl.currentPage *
                      props?.usePagination.useControl.itemsPerPage,
                    props?.usePagination.useControl.totalItems || 0,
                  )}{" "}
                  of {props?.usePagination.useControl.totalItems} results
                </Box>
              ) : (
                <Box flexGrow={1} textAlign={"center"}>
                  Showing {(pagination.currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(
                    pagination.currentPage * itemsPerPage,
                    props.rowsConfig.rows?.length || 0,
                  )}{" "}
                  of {props.rowsConfig.rows?.length} results
                </Box>
              )}
              <Box>
                <Pagination
                  disabled={
                    props?.disableInteractivity ||
                    (props?.useTableLoading?.isloading &&
                      props?.useTableLoading?.disableInteractivity)
                  }
                  sx={{ ".MuiPagination-ul": { justifyContent: "flex-end" } }}
                  shape="rounded"
                  color="primary"
                  count={
                    props?.usePagination.useControl
                      ? props?.usePagination.useControl.totalPages
                      : pagination.totalPages
                  }
                  page={
                    props?.usePagination.useControl
                      ? props?.usePagination.useControl.currentPage
                      : pagination.currentPage
                  }
                  onChange={(_, v) =>
                    props?.usePagination?.useControl
                      ? props?.usePagination.useControl.onSetCurrentPage(v)
                      : pagination.setCurrentPage(v)
                  }
                />
              </Box>
            </Stack>
          )}
        </TableCell>
      </TableRow>
    </TableFooter>
  );

  //#endregion

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: props?.maxheight ?? "600px",
        overflowY: "auto",
        borderRadius: 0,
        boxShadow: 0,
        opacity: props?.disableInteractivity || props?.useTableLoading?.isloading ? 0.5 : 0.9,
        width: props?.width ?? "100%",
        position: "relative",
      }}
    >
      <Table
        sx={{ minWidth: props?.minWidth ?? `calc(${props.width} - 20px)` ?? "960px", width: "99%" }}
        stickyHeader
      >
        {tableHeader}
        {<XNGTableBody />}
      </Table>
      {rows?.length === 0 && (
        <Table
          sx={{
            position: "sticky",
            bottom: 0,
            left: 0,
          }}
        >
          {emptyTable}
        </Table>
      )}
      <Table
        sx={{
          position: "sticky",
          bottom: 0,
          left: 0,
        }}
      >
        {(props.footerConfig || props.usePagination) && tableFooter}
      </Table>
    </TableContainer>
  );
};

export default XNGSmartTable;
