import { Box } from "@mui/material";
import ReportsHeader from "./reports_header";
import { REPORTS_BALANCE_REM } from "./constants/reports_gap_rem";
import React from "react";

type ReportsLayoutBaseProps = { children: React.ReactNode; title: string };

type ReportsLayoutOptionalProps = { gutterTop?: boolean; content?: React.ReactNode };

export type ReportsLayoutProps = ReportsLayoutBaseProps & ReportsLayoutOptionalProps;

function ReportsLayout(props: ReportsLayoutProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box>
        <ReportsHeader headerTitle={props.title} content={props.content} />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            pl: REPORTS_BALANCE_REM + "rem",
            pr: "1rem",
            ...(props.gutterTop && { pt: REPORTS_BALANCE_REM + "rem" }),
          }}
        >
          {props.children}
        </Box>
      </Box>
    </Box>
  );
}

export default ReportsLayout;
