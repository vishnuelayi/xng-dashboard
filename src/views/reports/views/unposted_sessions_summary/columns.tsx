import { ClientSessionCountsReportRecordUI, DocumentationType } from "@xng/reporting";
import { ColumnHeader } from "../../../../hooks/use_datagrid_base";
import { GridColDef } from "@mui/x-data-grid";
import { reportingDocumentationTypeToStringRecord } from "../../utils/reporting_documentation_type_to_string_record";
import dayjs from "dayjs";
import SessionStatusCircle, { SessionStatus } from "./components/session_status_circle";

const baseColumnProps: Partial<GridColDef> = { sortable: false, filterable: false };

// All columns should rely on the below defined values below as their `columnProps`:

const defaultSizeColumnProps: Partial<GridColDef> = { ...baseColumnProps, minWidth: 140 };
const largeSizeColumnProps: Partial<GridColDef> = { ...baseColumnProps, minWidth: 220 };
function getSessionCountColumnProps(status: SessionStatus): Partial<GridColDef> {
  return {
    ...baseColumnProps,
    minWidth: 80,
    maxWidth: 80,
    renderCell: (params) => <SessionStatusCircle params={params} status={status} />,
  };
}

export const UNPOSTED_SESSIONS_REPORT_COLUMNS: ColumnHeader<ClientSessionCountsReportRecordUI>[] = [
  { key: "serviceProviderLastName", title: "SP Last Name", columnProps: defaultSizeColumnProps },
  { key: "serviceProviderFirstName", title: "SP First Name", columnProps: defaultSizeColumnProps },
  { key: "serviceProviderEmail", title: "Email", columnProps: largeSizeColumnProps },
  {
    key: "serviceProviderType",
    title: "Service Provider Type",
    columnProps: defaultSizeColumnProps,
  },
  { key: "campusName", title: "Campus Name", columnProps: defaultSizeColumnProps },
  {
    key: "unpostedUnsubmittedSessionCount",
    title: "Unposted",
    columnProps: getSessionCountColumnProps("unposted"),
  },
  {
    key: "submittedSessionCount",
    title: "Submitted",
    columnProps: getSessionCountColumnProps("submitted"),
  },
  { key: "postedSessionCount", title: "Posted", columnProps: getSessionCountColumnProps("posted") },
  {
    key: "oldestSessionDate",
    title: "Oldest Session",
    columnProps: {
      renderCell: (v) => dayjs(v.value).format("MM/DD/YYYY"),
      minWidth: 120,
      maxWidth: 120,
      sortable: false,
    },
  },
  {
    key: "documentationType",
    title: "Documentation Type",
    columnProps: {
      renderCell: (params) =>
        reportingDocumentationTypeToStringRecord[params.value as DocumentationType],
      minWidth: 140,
      maxWidth: 140,
    },
  },
  { key: "teamLeaders", title: "Team Lead", columnProps: defaultSizeColumnProps },
];
