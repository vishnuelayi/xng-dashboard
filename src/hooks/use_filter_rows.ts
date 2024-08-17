import { useEffect, useState } from "react";

export type FilterProps<T> = { rows: T[]; condition: (row: T) => boolean; isEnabled: boolean };

/**
 * Optimizes filtering a set of rows only when its toggle,
 * `isEnabled`, or the backing `rows` data changes.
 */
export function useFilterRows<T>(props: FilterProps<T>): T[] {
  const { rows, condition, isEnabled } = props;

  const [filteredRows, setFilteredRows] = useState<T[]>([]);

  useEffect(() => {
    if (isEnabled) {
      setFilteredRows(rows.filter(condition));
    } else {
      setFilteredRows(rows);
    }
  }, [isEnabled, rows]);

  return filteredRows;
}
