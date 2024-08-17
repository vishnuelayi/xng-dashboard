import { GridColDef } from "@mui/x-data-grid";
import { SessionCountReportDisplayTableRow } from "@xng/reporting";
import dayjs from "dayjs";

type GridRowsColumnDefType = GridColDef<SessionCountReportDisplayTableRow>;

export const usePostedSessionsTableColumnDefinition = () => {
  const columnDefDefaultProps: Partial<GridRowsColumnDefType> = {
    flex: 1,
    minWidth: 120,
    valueGetter(params) {
      return params.value || emptyCellValue;
    },
  };

  const emptyCellValue = "N/A";

  const postedSessionsTablecolumns: GridRowsColumnDefType[] = [
    {
      ...columnDefDefaultProps,
      field: "studentName",
      headerName: "Student Name",
      valueGetter(params) {
        return params.row.studentFirstName + " " + params.row.studentLastName;
      },
    },
    {
      ...columnDefDefaultProps,
      field: "districtOfLiability",
      headerName: "DOL",
    },
    {
      ...columnDefDefaultProps,
      field: "campus",
      headerName: "Campus",
      valueGetter(params) {
        return params.value && String(params.value).toLocaleLowerCase() !== "unknown" ? params.value : emptyCellValue;
      },
    },
    {
      ...columnDefDefaultProps,
      field: "serviceName",
      headerName: "Service",
      minWidth: 200,
    },
    {
      ...columnDefDefaultProps,
      field: "oldestUnpostedSession",
      headerName: "Oldest Unposted",
      sortComparator: (v1, v2) => {
        const diff = Math.round(Math.max(-1, Math.min(1, dayjs(v1).diff(dayjs(v2)))));
        return diff;
      },
    },
    {
      ...columnDefDefaultProps,
      field: "unpostedCount",
      headerName: "Unposted",
      valueGetter(params) {
        return params.value || 0;
      },
    },
    {
      ...columnDefDefaultProps,
      field: "submittedCount",
      headerName: "Submitted",
      valueGetter(params) {
        return params.value || 0;
      },
    },
    {
      ...columnDefDefaultProps,
      field: "postedCount",
      headerName: "Posted",
      valueGetter(params) {
        return params.value || 0;
      },
    },
  ];
  return postedSessionsTablecolumns;
};
