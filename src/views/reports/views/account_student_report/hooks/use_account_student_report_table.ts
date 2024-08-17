import { mapColumnHeadersToDataGrid } from "../../../../../hooks/use_datagrid_base";
import { API_ACCOUNT_STUDENTS } from "../../../../../api/api";
import { NhReportRecordUI, PageParameters, TxReportRecordUI } from "@xng/reporting";
import { useEffect, useMemo, useState } from "react";
import { useXNGSelector } from "../../../../../context/store";
import { selectClientID } from "../../../../../context/slices/loggedInClientSlice";
import { placeholderForFutureLogErrorText } from "../../../../../temp/errorText";
import useEffectSkipMount from "../../../../../hooks/use_effect_after_mount";
import { selectStateInUS } from "../../../../../context/slices/stateInUsSlice";
import { GridColDef } from "@mui/x-data-grid";
import { ACCOUNT_STUDENT_REPORT_STATEINUS_FALLTHROUGH } from "../account_student_report";
import { usePollRequestByState } from "./use_poll_request_by_state";
import { ReportRunDateAndID } from "../report_run_date_and_id";
import { generateTxColumns } from "../funcs/generate_tx_columns";
import { generateNhColumns } from "../funcs/generate_nh_columns";

/**
 * Note for when software expands to other states: remove the column type-safety altogether to accommodate
 * any report shape, and thus grant maximum flexibility.
 */
interface AccountStudentReportTable {
  rows: TxReportRecordUI[] | NhReportRecordUI[];
  columns: GridColDef[];
}

type UseAccountStudentReportTableProps = { table: AccountStudentReportTable; totalRecords: number };

export function useAccountStudentReportTable(props: {
  includeInactive: boolean;
  pageParameters: PageParameters;
  reportRunDateAndID: ReportRunDateAndID | null;
}): UseAccountStudentReportTableProps {
  const { includeInactive, pageParameters, reportRunDateAndID } = props;
  const stateInUS = useXNGSelector(selectStateInUS);

  const poll = usePollRequestByState({ reportRunDateAndID, pageParameters });

  useEffectSkipMount(() => {
    poll.start();
  }, [reportRunDateAndID, pageParameters]);

  useEffectSkipMount(() => {
    if (!poll.result) return;

    setRows(poll.result.pageRecords ?? []);
    setTotalRecords(poll.result.totalRecords ?? 0);
  }, [poll.result]);

  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [rows, setRows] = useState<TxReportRecordUI[] | NhReportRecordUI[]>([]);
  const columns = useMemo(() => getColumnsByState(stateInUS), [reportRunDateAndID]);

  return { table: { rows, columns }, totalRecords };
}

function getColumnsByState(stateInUS: string) {
  switch (stateInUS) {
    case "TX":
      return mapColumnHeadersToDataGrid(generateTxColumns());
    case "NH":
      return mapColumnHeadersToDataGrid(generateNhColumns());
    default:
      throw new Error(ACCOUNT_STUDENT_REPORT_STATEINUS_FALLTHROUGH);
  }
}
