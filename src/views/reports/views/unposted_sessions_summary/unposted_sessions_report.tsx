import ReportsLayout from "../../reports_layout";
import { useDataGridBase } from "../../../../hooks/use_datagrid_base";
import { Stack } from "@mui/material";
import { useCallback, useState } from "react";
import { API_CLIENT_SESSION_COUNTS, API_DISTRICTS } from "../../../../api/api";
import { useReportingPollRequest } from "../../hooks/use_polling_mechanism";
import { ClientSessionCountsReportRecordUI } from "@xng/reporting";
import useEffectSkipMount from "../../../../hooks/use_effect_after_mount";
import { useXNGSelector } from "../../../../context/store";
import { selectClientID } from "../../../../context/slices/loggedInClientSlice";
import useFetchNullableResponse from "../../../../hooks/use_fetch_nullable_response";
import dayjs, { Dayjs } from "dayjs";
import useBreakpointHelper from "../../../../design/hooks/use_breakpoint_helper";
import { UNPOSTED_SESSIONS_REPORT_COLUMNS as columns } from "./columns";
import TableInputControls from "./table_input_controls";
import { selectLoggedInClientAssignment } from "../../../../context/slices/userProfileSlice";
import { selectStateInUS } from "../../../../context/slices/stateInUsSlice";
import { SchoolCampusRef } from "../../../../profile-sdk";
import { campusDropdownStyleHack } from "./campus_dropdown_style_hack";
import downloadFile from "../../../../utils/downloadFile";
import { getUserTimeZoneByState } from "../../../../utils/timeZones";
import { DataGrid } from "@mui/x-data-grid";
import UnpostedSessionsReportToolbar from "./unposted_sessions_report_toolbar";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import useDataGridPagination from "../../hooks/use_data_grid_pagination";
import { LoadingResponseMessageTemplate } from "../../../../design/templates/loading_response_message_template";
import PaginatedDataGridLoadingLayout from "../../../../design/high-level/paginated_data_grid_loading_layout";

function UnpostedSessionsReport() {
  // Misc
  const stateInUs = useXNGSelector(selectStateInUS);

  // Breakpoint Management
  const bph = useBreakpointHelper();
  const screenShouldCollapse = !bph.isGreaterThanEqualTo("md"); // TECH DEBT: Technically this is a hook invocation. We should examine the helper module and see what can be kept, refactored, or phased out.

  // School Campus Options Declaration
  const primaryDistrict = useXNGSelector(selectLoggedInClientAssignment).authorizedDistricts![0];
  const fetchedCampusOptions = useFetchNullableResponse(() =>
    API_DISTRICTS.v1DistrictsIdSchoolCampusesDropdownDisplaysGet(
      primaryDistrict.id!,
      stateInUs,
    ).then((v) => v.schoolCampuses!),
  );

  // Form States
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().subtract(1, "year"));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());
  const [selectedCampusOptions, setSelectedCampusOptions] = useState<SchoolCampusRef[]>([]);
  const [includeSPsWithoutCampusesCheckbox, setIncludeSPsWithoutCampusesCheckbox] =
    useState<boolean>(false);
  const [runReportClickToggle, setRunReportClickToggle] = useState<boolean>(false);

  // Request for Run Parameters
  const clientId = useXNGSelector(selectClientID);

  const reportRunParameters = useFetchNullableResponse(
    () =>
      API_CLIENT_SESSION_COUNTS.v1SessionReportsClientSessionCountsQueueReportPost({
        queueClientSessionCountReportPostRequest: {
          filterParameters: {
            clientId,
            campusIds: new Set(selectedCampusOptions.map((c) => c.id!)),
            startDate: startDate.toDate(),
            endDate: endDate.toDate(),
            includeServiceProvidersWithoutCampus: includeSPsWithoutCampusesCheckbox,
          },
        },
      }),
    [runReportClickToggle],
    { skipMount: true },
  );

  // Polled Request for Table Rows & Pagination Controls
  const tablePollRequest = useReportingPollRequest({
    mutationFn: () =>
      API_CLIENT_SESSION_COUNTS.v1SessionReportsClientSessionCountsGetReportPostRaw({
        getPaginatedReportFromRunPostRequest: {
          pageParameters,
          reportRunDate: reportRunParameters!.reportRunDate,
          reportRunId: reportRunParameters!.reportRunId,
        },
      }),
    mutationKey: ["v1SessionReportsClientSessionCountsGetReportPostRaw"],
  });
  const { pageParameters, dataGridPaginationProps } = useDataGridPagination({
    rowCount: tablePollRequest.result?.totalRecords,
  });
  useEffectSkipMount(() => {
    if (reportRunParameters) {
      clearReportCache(queryClient);
      tablePollRequest.stop();
      tablePollRequest.start();
    }
  }, [reportRunParameters, pageParameters]);

  // Export to CSV Poll Request & Callback
  const csvPollRequest = useReportingPollRequest({
    mutationFn: () =>
      API_CLIENT_SESSION_COUNTS.v1SessionReportsClientSessionCountsDownloadCsvPostRaw({
        getReportCsvFromRunPostRequest: {
          reportRunDate: reportRunParameters?.reportRunDate!,
          reportRunId: reportRunParameters?.reportRunId!,
          timeZoneId: getUserTimeZoneByState(stateInUs),
        },
      }),
    mutationKey: ["v1SessionReportsClientSessionCountsDownloadCsvPostRaw"],
  });
  useEffectSkipMount(() => {
    if (reportRunParameters) {
      csvPollRequest.stop();
      csvPollRequest.start();
    }
  }, [reportRunParameters]);
  const handleExportToCSVClick = useCallback(() => {
    if (csvPollRequest.result) {
      downloadFile(csvPollRequest.result, "unpostedSessionsReport.csv");
    }
  }, [csvPollRequest.result]);

  // Data Grid Props Declaration
  const dataGridProps = useDataGridBase<ClientSessionCountsReportRecordUI>({
    rows: tablePollRequest.result?.pageRecords ?? [],
    columns,
  });

  // Clear Current Cache on Run Click
  const queryClient = useQueryClient();
  useEffectSkipMount(() => {
    clearReportCache(queryClient);
    clearCsvCache(queryClient);
  }, [runReportClickToggle]);

  return (
    <ReportsLayout title="Unposted Sessions Report">
      <Stack sx={{ pr: "2rem" }}>
        <TableInputControls
          shouldCollapse={screenShouldCollapse}
          checkboxState={{
            value: includeSPsWithoutCampusesCheckbox,
            onCheckboxClick: () =>
              setIncludeSPsWithoutCampusesCheckbox(!includeSPsWithoutCampusesCheckbox),
          }}
          dateRangeState={{
            endDate,
            startDate,
            onStartDateChange: setStartDate,
            onEndDateChange: setEndDate,
          }}
          campusDropdownProps={{
            options: fetchedCampusOptions ?? [],
            selectedOptions: selectedCampusOptions,
            onChange: setSelectedCampusOptions,
            getOptionLabel: (v) => v.name!,
            variant: "no overflow",
            label: "",
            sx: campusDropdownStyleHack,
            renderOptionVariant: "checkbox",
            textFieldProps: {
              placeholder: selectedCampusOptions.length > 0 ? "" : "None selected",
            },
            isOptionEqualToValue: (a, b) => a.id === b.id,
          }}
          onRunClick={() => setRunReportClickToggle(!runReportClickToggle)}
        />

        <PaginatedDataGridLoadingLayout
          isLoading={tablePollRequest.isPolling}
          loadingContent={<LoadingResponseMessageTemplate />}
          sizeAnchor={screenShouldCollapse ? "25rem" : "21rem"}
        >
          <DataGrid
            slots={{
              toolbar: UnpostedSessionsReportToolbar,
            }}
            slotProps={{
              toolbar: {
                onDownload: handleExportToCSVClick,
                shouldDisableDownloadAsCsv: !csvPollRequest.result,
                isPolling: csvPollRequest.isPolling,
              },
            }}
            columns={dataGridProps.columns}
            rows={dataGridProps.rows}
            getRowId={() => crypto.randomUUID()}
            {...dataGridPaginationProps}
          />
        </PaginatedDataGridLoadingLayout>
      </Stack>
    </ReportsLayout>
  );
}

function clearReportCache(queryClient: QueryClient) {
  queryClient.removeQueries({
    queryKey: ["v1SessionReportsClientSessionCountsGetReportPostRaw"],
  });
}

function clearCsvCache(queryClient: QueryClient) {
  queryClient.removeQueries({
    queryKey: ["v1SessionReportsClientSessionCountsDownloadCsvPostRaw"],
  });
}

export default UnpostedSessionsReport;
