import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getSizing } from "../sizing";
import { Typography } from "@mui/material";

export default function XNGTable(props: any) {
  console.log(Object.keys(props.json[0]));
  const keys = Object.keys(props.json[0]);
  const thData = () => {
    return keys.map((data) => {
      return (
        <TableCell
          key={data}
          style={{
            borderTop: "1px solid rgba(0, 0, 0, 0.16)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.16)",
            textAlign: "left",
            paddingTop: getSizing(1),
            paddingBottom: getSizing(1),
            paddingRight: getSizing(2),
            position: "sticky",
            top: 0,
            background: "white",
          }}
        >
          {<Typography variant="body1">{data}</Typography>}
        </TableCell>
      );
    });
  };

  const tdData = () => {
    let n = props.json.length;
    return [...Array(n)].map((data: any, x: number) => {
      return (
        <TableRow
          key={x}
          style={{ borderBottom: "1px solid rgba(0,0,0,0.16)", padding: getSizing(1) }}
        >
          {Object.keys(props.json[x]).map((v: any, y: number) => {
            return <TableCell key={y}>{props.json[x][v]}</TableCell>;
          })}
        </TableRow>
      );
    });
  };
  return (
    <TableContainer component={Paper} sx={{ maxHeight: getSizing(28), overflowX: "hidden" }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>{thData()}</TableRow>
        </TableHead>
        <TableBody>{tdData()}</TableBody>
      </Table>
    </TableContainer>
  );
}
