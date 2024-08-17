import { Alert, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { SessionCountReportDisplayTableRow } from "@xng/reporting";
import { usePostedSessionsTableColumnDefinition } from "../../../hooks/table/use_posted_sessions_table_column_definition";

type PostedSessionsTabTableRowsAndColumns = {
  rows: SessionCountReportDisplayTableRow[];
  columnDef: ReturnType<typeof usePostedSessionsTableColumnDefinition>;
};

const PostedSessionsTabTable = (props: PostedSessionsTabTableRowsAndColumns) => {
  return (
    <Box
      aria-label="posted-sessions-tab-table"
      sx={{
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "contrasts.1",
        },
      }}
    >
      <DataGrid
        autoHeight
        rows={props.rows.map((row, i) => ({ fallBackId: i, ...row }))}
        getRowId={
          (row) =>
            row?.id && row?.serviceId // Check if both row.id and row.serviceId exist
              ? row.id + row.serviceId // If they both exist, concatenate them
              : row.id // If only row.id exists, use it
              ? row.id // If only row.id exists, use it
              : (row as any).fallBackId // If none of the above conditions are met, use row.fallBackId
        }
        columns={props.columnDef}
        slots={{
          noRowsOverlay: () => (
            <Box
              aria-label="BUM!"
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Alert severity="info" sx={{ width: "80%" }}>
                No Posted Sessions Data found
              </Alert>
            </Box>
          ),
        }}
        sortingOrder={["asc", "desc"]}
        disableRowSelectionOnClick
        disableColumnSelector
        pagination
        paginationMode="client"
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
        }}
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </Box>
  );
};

export default PostedSessionsTabTable;
