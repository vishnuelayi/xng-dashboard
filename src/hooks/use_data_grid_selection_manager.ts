import { GridRowSelectionModel, GridValidRowModel } from "@mui/x-data-grid";
import { Dispatch, SetStateAction, useState } from "react";

/**
 * Use this hook to manage selection state in MUI DataGrid. It provides an easy-to-use API for selection operations.
 *
 * @template T The type of data represented in each row.
 */
export function useDataGridSelectionManager<T extends GridValidRowModel>(props: {
  rows: readonly GridValidRowModel[];
}): DataGridSelectionManager<T> {
  const { rows } = props;

  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

  const selectedRows = rowSelectionModel
    .map((id) => rows[id as number])
    .filter((row): row is T => row !== undefined);

  return {
    selectedRows,
    rowSelectionModel,
    onRowSelectionModelChange: setRowSelectionModel,
    setRowSelectionModel,
  };
}

export interface DataGridSelectionManager<T> {
  /**
    Calculated result of selected rows as determined by the state of `rowSelectionModel`
   */
  selectedRows: T[];
  rowSelectionModel: GridRowSelectionModel;
  onRowSelectionModelChange: (newModel: GridRowSelectionModel) => void;
  setRowSelectionModel: Dispatch<SetStateAction<GridRowSelectionModel>>;
}
