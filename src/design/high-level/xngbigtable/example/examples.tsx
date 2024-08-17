import { Typography } from "@mui/material";
/// ---------------- FOR EXAMPLE USAGE, UNCOMMENT BELOW. Please re-comment when done! ---------------- ///
// import { Stack } from "@mui/material";
// import useXNGBigTablePaginationStateManager from "../hooks/use_pagination_state_manager";
// import XNGBigTable from "../table";
// import useXNGBigTableSortStateManager from "../hooks/use_sort_state_manager";
// import useBigTableKeyedRows from "../hooks/use_big_table_keyed_rows";
// import { DUMMY_ROWS, useFetchTable, ExampleRow } from "./gen/gen";

export default function XNGBigTableExamples() {
  return (
    <Typography>
      Examples have been commented to reduce the amount of JavaScript sent to the browser. Please
      visit the internal file and uncomment to view example usages.
    </Typography>
  );

  /// ---------------- FOR EXAMPLE USAGE, UNCOMMENT BELOW. Please re-comment when done! ---------------- ///

  // const { table, refetch } = useFetchTable();
  // const keyedRows = useBigTableKeyedRows({ defaultRows: table?.fetchedRows ?? [] });
  // const paginationState = useXNGBigTablePaginationStateManager({
  //   totalCount: table?.totalCount ?? 0,
  // });
  // const sortState = useXNGBigTableSortStateManager({ keyedRows });
  // return (
  //   <Stack gap="2rem" mt="2rem">
  //     {/* <Typography variant="h5">Basic static table, no dynamic functionality</Typography>
  //     <XNGBigTable<ExampleRow>
  //       rows={DUMMY_ROWS}
  //       columns={[
  //         { key: "campusName", label: "Campus Name" },
  //         { key: "stateID", label: "State ID" },
  //         { key: "address", label: "Address" },
  //         { key: "contact", label: "Contact" },
  //         { key: "contactRole", label: "Contact Role" },
  //         { key: "contactEmail", label: "Contact Email" },
  //       ]}
  //     /> */}

  //     {/* <Typography variant="h5">Dynamic table, paginated</Typography>
  //     <XNGBigTable<ExampleRow>
  //       rows={table?.fetchedRows ?? []}
  //       columns={[
  //         { key: "campusName", label: "Campus Name" },
  //         { key: "stateID", label: "State ID" },
  //         { key: "address", label: "Address" },
  //         { key: "contact", label: "Contact" },
  //         { key: "contactRole", label: "Contact Role" },
  //         { key: "contactEmail", label: "Contact Email" },
  //       ]}
  //       usePagination={paginationState}
  //       onTableRequestParametersChange={(trp) => {
  //         refetch(trp);
  //       }}
  //     /> */}

  //     {/* <Typography variant="h5">Dynamic table, paginated, sortable</Typography>
  //     <XNGBigTable<ExampleRow>
  //       columns={[
  //         { key: "campusName", label: "Campus Name" },
  //         { key: "stateID", label: "State ID" },
  //         { key: "address", label: "Address" },
  //         { key: "contact", label: "Contact" },
  //         { key: "contactRole", label: "Contact Role" },
  //         { key: "contactEmail", label: "Contact Email" },
  //       ]}
  //       usePagination={paginationState}
  //       useSort={sortState}
  //       onTableRequestParametersChange={(trp) => {
  //         refetch(trp);
  //       }}
  //     /> */}

  //     {/* <Typography variant="h5">Static table, sortable</Typography>
  //     <XNGBigTable<ExampleRow>
  //       columns={[
  //         { key: "campusName", label: "Campus Name" },
  //         { key: "stateID", label: "State ID" },
  //         { key: "address", label: "Address" },
  //         { key: "contact", label: "Contact" },
  //         { key: "contactRole", label: "Contact Role" },
  //         { key: "contactEmail", label: "Contact Email" },
  //       ]}
  //       useSort={sortState}
  //       onTableRequestParametersChange={(trp) => {
  //         refetch(trp);
  //       }}
  //     /> */}
  //   </Stack>
  // );
  ///////// ---------------- ^^ UNCOMMENT ABOVE ^^ ---------------- /////////
}
