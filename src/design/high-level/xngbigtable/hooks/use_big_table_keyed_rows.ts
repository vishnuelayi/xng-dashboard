import { useEffect, useState } from "react";
import { KeyedRow } from "../types";

function keyRows<T>(rows: T[]): KeyedRow<T>[] {
  return rows.map((row, i) => ({ row, uid: i }));
}

export default function useXNGBigTableKeyedRows<T>(props: { defaultRows: T[] }) {
  const { defaultRows } = props;

  const [bigTableRows, setBigTableRows] = useState<KeyedRow<T>[]>([]);
  useEffect(() => {
    setBigTableRows(keyRows(defaultRows));
  }, [defaultRows]);

  return bigTableRows;
}
