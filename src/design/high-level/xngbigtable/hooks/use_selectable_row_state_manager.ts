import { useEffect, useState } from "react";
import { KeyedRow, XNGBigTableSelectableRowState, XNGBigTableSelectedRow } from "../types";

export default function useXNGBigTableSelectableRowStateManager<T>(props: {
  keyedRows: KeyedRow<T>[];
}): XNGBigTableSelectableRowState<T> {
  const { keyedRows: keyedRows } = props;

  const { rowSelection, setRowSelection, toggleAll } = useRowSelection<T>({ keyedRows });

  const isAllToggled = rowSelection.filter((sr) => sr.isSelected).length === keyedRows.length;

  function onToggleAll() {
    if (isAllToggled) {
      toggleAll.off();
    } else {
      toggleAll.on();
    }
  }

  const res: XNGBigTableSelectableRowState<T> = {
    onRowToggle: (rowUID: number) => {
      const newSelectionState = [...rowSelection];
      const i = keyedRows.indexOf(keyedRows.find((kr) => kr.uid === rowUID)!);
      const isSelected = newSelectionState[i].isSelected;
      newSelectionState[i].isSelected = !isSelected;
      setRowSelection(newSelectionState);
    },
    rowSelections: rowSelection,
    toggleAll: onToggleAll,
    isAllToggled,
  };

  return res;
}

function useRowSelection<T>(props: { keyedRows: KeyedRow<T>[] }) {
  const { keyedRows } = props;

  function getDefaultRows(): XNGBigTableSelectedRow<T>[] {
    const res: XNGBigTableSelectedRow<T>[] = keyedRows.map((kr) => ({
      isSelected: false,
      rowUID: kr.uid,
      row: kr.row,
    }));

    return res;
  }
  const [rowSelection, setRowSelection] = useState<XNGBigTableSelectedRow<T>[]>([]);

  useEffect(() => {
    setRowSelection(getDefaultRows());
  }, [keyedRows]);

  const toggleAll = {
    on: () => {
      const newRows: XNGBigTableSelectedRow<T>[] = rowSelection.map((r) => {
        const { row, rowUID } = r;
        const newRow: XNGBigTableSelectedRow<T> = { isSelected: true, row, rowUID };
        return newRow;
      });
      setRowSelection(newRows);
    },
    off: () => {
      const newRows: XNGBigTableSelectedRow<T>[] = rowSelection.map((r) => {
        const { row, rowUID } = r;
        const newRow: XNGBigTableSelectedRow<T> = { isSelected: false, row, rowUID };
        return newRow;
      });
      setRowSelection(newRows);
    },
  };

  return { rowSelection, setRowSelection, toggleAll };
}
