import { Radio, Table, TableBody, TableCell, TableHead, TableRow, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";

export interface MSBRadioTableProps<T> {
  rows: T[];
  columns: { key: keyof T; title: string }[];
  onChange: (v: T | null) => void;
}

/**
 * Assume Open/Closed Principle: Do not modify integral functionality, but extending styling is okay.
 */
function MSBRadioTable<T>(props: Readonly<MSBRadioTableProps<T>>) {
  const { rows, columns, onChange } = props;
  const { palette } = useTheme();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    onChange(selectedIndex !== null ? rows[selectedIndex] : null);
  }, [selectedIndex]);

  return (
    <Table sx={{ minWidth: 650 }}>
      <TableHead>
        <TableRow className="noselect">
          <TableCell></TableCell>
          {props.columns.map((c) => (
            <TableCell key={c.key.toString()}>{c.title}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, i) => (
          <TableRow
            className="noselect"
            key={i}
            sx={{
              ":hover": {
                cursor: "pointer",
                bgcolor: palette.grey[100],
              },
            }}
            onClick={() => setSelectedIndex(i)}
          >
            <TableCell>
              <Radio size="small" checked={selectedIndex === i} />
            </TableCell>
            {columns.map((col) => (
              <TableCell key={col.key.toString()}>{row[col.key] as React.ReactNode}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default MSBRadioTable;
