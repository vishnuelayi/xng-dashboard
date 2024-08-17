import { useEffect, useState } from "react";
import AdminHeaderDistrictSelector from "../../common/admin_header_district_selector";
import { DistrictRef } from "../../../../profile-sdk";
import SidebarLayout from "../../../../layouts/SidebarLayout";
import AdminLayout from "../../common/admin_wrapper";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { MSBICONS, MSBIconRenderer, MSBSearch } from "../../../../fortitude";
import { DataGrid } from "@mui/x-data-grid";
import {
  FrontEndStudentMergeRow,
  useFetchPotentialsAsRows,
  useFetchStudentsAsRows,
} from "./mapper";
import { useDataGridBase } from "../../../../hooks/use_datagrid_base";
import { MergeModalView } from "./merge_modal_view";
import { LoadingAsyncResponseMessageTemplate } from "../../../../design/templates/loading_async_request_template";
import useBreakpointHelper from "../../../../design/hooks/use_breakpoint_helper";
import { debounce } from "@mui/material/utils";
import useSidebarLayoutBtns from "../../constants/sidebar_layout_btns";
import { useDataGridSelectionManager } from "../../../../hooks/use_data_grid_selection_manager";
import DataGridLoadingLayout from "../../../../design/high-level/data_grid_loading_layout";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../api/constants/query_keys";

const LABEL_LIKELY_DUPLICATES_REPORT = "Potential Student Duplicates";

/**
 * TODO: Introduce Context. Feature was not expected to incur as much logic as it did, and as such, there are some
 * calculated variables drilled 1-2 layers that could be consolidated and centralized.
 */
function StudentMerge() {
  const [district, setDistrict] = useState<DistrictRef | null>(null);
  const sidebarButtons = useSidebarLayoutBtns();

  return (
    <SidebarLayout
      sidebarContent={sidebarButtons}
      content={
        <AdminLayout>
          <AdminHeaderDistrictSelector
            onChange={(d) => {
              setDistrict(d);
            }}
          />

          {district && <StudentMergeView />}
        </AdminLayout>
      }
    />
  );
}

// Style constants
const INPUT_WIDTH = "24rem";

function StudentMergeView() {
  // --- Generic Hooks ---
  const { palette } = useTheme();
  const bph = useBreakpointHelper();

  // --- State ---
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const [isMergeModalOpen, setIsMergeModalOpen] = useState<boolean>(false);

  // --- Table Management ---
  const { fetchedStudentRows, fetchedPotentialsRows, refetchStudentRows } = useFetchedRows({
    searchInputValue,
  });
  const showSearchOverPotentials: boolean = searchInputValue.length > 0;
  const table = useDataGridBase<FrontEndStudentMergeRow>({
    rows: showSearchOverPotentials ? fetchedStudentRows : fetchedPotentialsRows,
    columns: [
      { key: "firstName", title: "First Name" },
      { key: "lastName", title: "Last Name" },
      { key: "studentID", title: "Student ID" },
      { key: "birthdate", title: "Birthdate" },
      { key: "createdBy", title: "Created by" },
      { key: "school", title: "School" },
      { key: "gender", title: "Gender" },
    ],
  });
  const tableSelection = useDataGridSelectionManager<FrontEndStudentMergeRow>({
    rows: table.rows,
  });

  // --- Helper/Readability Constants ---
  const showGeneratingPotentialsOverlay =
    fetchedPotentialsRows.length < 1 && !showSearchOverPotentials;
  const isCollapsed = !bph.isGreaterThanEqualTo(705);

  // --- Lifecycle Side-Effects ---
  useEffect(() => {
    tableSelection.setRowSelectionModel([]);
  }, [searchInputValue]);

  return (
    <>
      {/* Modals */}
      <MergeModalView
        open={isMergeModalOpen}
        onClose={() => {
          setIsMergeModalOpen(false);
        }}
        selectedRows={tableSelection.selectedRows}
        onRequestRefreshTable={() => {
          if (showSearchOverPotentials) {
            // Is seach workflow, uses transactional DB. Refresh is applicable.
            refetchStudentRows();
          } else {
            // Is report workflow, uses delayed DB. Refresh will not help. We do
            // nothing for now, and resolve once this BE/DB tech debt is addressed.
          }
        }}
        workflow={showSearchOverPotentials ? "search" : "potentials"}
        onClearSelection={() => tableSelection.setRowSelectionModel([])}
      />

      {/* Dom Hierarchy */}
      <Stack gap="1rem" mt="1rem">
        <Stack gap="1rem">
          <Box sx={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <Typography variant="h5" className="noselect">
              Merge Student Profiles
            </Typography>
            <Tooltip
              arrow
              placement="top"
              title={
                fetchedPotentialsRows.length > 0
                  ? "Kindly search for students using the search bar below or choose from the potential duplicates we've gathered."
                  : "Kindly search for students using the search bar below or wait as we find potential duplicates for you."
              }
            >
              <IconButton disableTouchRipple>
                <MSBIconRenderer i={<MSBICONS.Help />} size="sm" />
              </IconButton>
            </Tooltip>
          </Box>
          <Stack sx={{ width: isCollapsed ? "100%" : INPUT_WIDTH }}>
            <MSBSearch
              useClear={{ onClear: () => setSearchInputValue("") }}
              value={searchInputValue}
              onChange={(e) => {
                setSearchInputValue(e.target.value);
              }}
              fullWidth={isCollapsed}
            />
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            justifyContent: "space-between",
          }}
        >
          <Typography
            className="noselect"
            sx={{ color: palette.text.primary, opacity: 0.7, minWidth: "6rem" }}
          >
            Results ({table.rows.length})
          </Typography>

          <Box
            sx={{
              display: "flex",
              width: "18rem",
              height: "2rem",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: palette.grey[100],
              borderRadius: ".5rem",
            }}
          >
            <Typography variant="body2" className="noselect">
              Viewing:{" "}
              <strong>
                {showSearchOverPotentials ? "Search Results" : LABEL_LIKELY_DUPLICATES_REPORT}
              </strong>
            </Typography>
          </Box>
        </Box>

        <DataGridLoadingLayout
          isLoading={showGeneratingPotentialsOverlay}
          loadingContent={
            <LoadingAsyncResponseMessageTemplate
              title="We're searching for potential duplicates for you"
              extraContent={
                <Alert className="noselect" severity="info">
                  Feel free to manually search for students instead!
                </Alert>
              }
            />
          }
          sizeAnchor="26.5rem"
        >
          <DataGrid
            rows={table.rows}
            columns={table.columns}
            rowSelectionModel={tableSelection.rowSelectionModel}
            onRowSelectionModelChange={tableSelection.onRowSelectionModelChange}
            checkboxSelection
          />
        </DataGridLoadingLayout>

        <Stack alignItems="flex-end">
          <Button
            fullWidth={isCollapsed}
            sx={{ minWidth: INPUT_WIDTH, maxWidth: "100%" }}
            disabled={tableSelection.selectedRows.length < 2}
            onClick={() => {
              setIsMergeModalOpen(true);
            }}
          >
            Merge
          </Button>
        </Stack>
      </Stack>
    </>
  );
}

function useFetchedRows(props: { searchInputValue: string }) {
  const { searchInputValue } = props;

  const fetchStudentsAsRows = useFetchStudentsAsRows();
  const [fetchedStudentRows, setFetchedStudentRows] = useState<any[]>([]);

  async function fetchAndSetStudentRows() {
    const rows = await fetchStudentsAsRows(searchInputValue);
    setFetchedStudentRows(rows);
  }
  const fetchAndSetStudentRowsDebounce = debounce(async () => fetchAndSetStudentRows(), 100);

  useEffect(() => {
    if (searchInputValue.trim() !== "") {
      fetchAndSetStudentRowsDebounce();
    }
    return () => fetchAndSetStudentRowsDebounce.clear();
  }, [searchInputValue]);

  const fetchPotentialsAsRows = useFetchPotentialsAsRows();

  const { data: fetchedPotentialsRows } = useQuery({
    queryFn: fetchPotentialsAsRows,
    queryKey: QUERY_KEYS.studentMergePotentialDuplicates,
  });

  return {
    fetchedStudentRows,
    fetchedPotentialsRows: fetchedPotentialsRows ?? [],
    refetchStudentRows: fetchAndSetStudentRowsDebounce,
  };
}

export default StudentMerge;
