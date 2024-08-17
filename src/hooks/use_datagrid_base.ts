import { GridColDef, GridRowsProp } from "@mui/x-data-grid";

export type ColumnHeader<T> = {
  key: keyof T;
  title: string;
  columnProps?: Partial<GridColDef>;
};

export type DataGridBase<T> = { rows: T[]; columns: ColumnHeader<T>[] };

/**
 * This will construct the MUI DataGrid's base props, `rows` and `columns`, using a typed rows pattern for type-safety and consistency.
 */
export function useDataGridBase<T>(props: DataGridBase<T>): {
  rows: GridRowsProp;
  columns: GridColDef[];
} {
  const rows: GridRowsProp = props.rows.map((item, i) => ({
    ...item,
    id: i, // A UID is required by `GridRowsProp` for DataGrid's internal usage
  }));

  const columns: GridColDef[] = mapColumnHeadersToDataGrid(props.columns);

  return { rows, columns };
}

/**
 * Helper function to translate a list of ColumnHeader<T> into GridColumnDef.
 */
export function mapColumnHeadersToDataGrid<T>(columnHeaders: ColumnHeader<T>[]): GridColDef[] {
  return columnHeaders.map((header: ColumnHeader<T>) => ({
    // Default configurations
    field: header.key.toString(),
    headerName: header.title,
    flex: 1,

    // Custom configurations
    ...header.columnProps,
  }));
}
